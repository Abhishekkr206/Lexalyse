import { supabase } from './supabase';
import { generateCaseAnalysis, generateCaseAnalysisWithContext, extractCleanCaseName } from './gemini';
import { CaseAnalysis } from '../types';

const ECOURTS_BASE_URL = 'https://webapi.ecourtsindia.com';

const getEcourtHeaders = () => {
  const token = import.meta.env.VITE_ECOURTS_KEY;
  if (!token) {
    console.warn('VITE_ECOURTS_KEY is missing');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const fetchCase = async (query: string): Promise<CaseAnalysis | null> => {
  try {
    // 1. Check Supabase cache first
    const { data: cachedCases, error: cacheError } = await supabase
      .from('cases')
      .select('*')
      .ilike('search_query', `%${query}%`)
      .limit(1);

    if (!cacheError && cachedCases && cachedCases.length > 0) {
      console.log('Cache hit for query:', query);
      const cached = cachedCases[0];
      return {
        caseName: cached.case_name,
        cnr: cached.cnr,
        citation: cached.citation,
        year: cached.year,
        bench: cached.bench,
        tags: Array.isArray(cached.tags) ? cached.tags : [cached.tags].filter(Boolean),
        facts: cached.facts,
        coreIssues: cached.core_issues,
        arguments: cached.arguments,
        judgement: cached.judgement,
        holding: cached.holding,
        ratioDecidendi: cached.ratio_decidendi,
        status: cached.status,
        primarySourceUrl: cached.source_url
      };
    }

    console.log('Cache miss for query:', query);

    // 3. Cache miss -> Gemini + Google Search to extract proper case name
    const cleanCaseName = await extractCleanCaseName(query);
    console.log('Cleaned Case Name:', cleanCaseName);

    // 4. Use clean case name to hit eCourts search API
    let cnr: string | undefined = undefined;
    let ecourtsDetails: any = null;
    let isGoodMatch = false;

    try {
      const searchRes = await fetch(`${ECOURTS_BASE_URL}/api/partner/search?query=${encodeURIComponent(cleanCaseName)}&pageSize=3`, {
        headers: getEcourtHeaders()
      });
      
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const results = searchData?.data?.results || searchData?.results || [];        
        // 5. Get CNR from results
        if (results.length > 0 && results[0].cnr) {
          const firstResult = results[0];
          
          // Verify good match
          const resultStr = JSON.stringify(firstResult).toLowerCase();
          const queryWords = cleanCaseName.toLowerCase().split(/[\s,v\.]+/).filter(w => w.length > 3);
          
          if (queryWords.length === 0) {
            isGoodMatch = true;
          } else {
            isGoodMatch = queryWords.some(word => resultStr.includes(word));
          }

          if (isGoodMatch) {
            cnr = firstResult.cnr;
            // 6. Get full case details using CNR
            const detailRes = await fetch(`${ECOURTS_BASE_URL}/api/partner/case/${cnr}`, {
              headers: getEcourtHeaders()
            });
            
            if (detailRes.ok) {
              ecourtsDetails = await detailRes.json();
              console.log('Got eCourts details for CNR:', cnr);
            }
          } else {
            console.log('eCourts result was not a good match for query:', cleanCaseName);
          }
        }
      } else {
        console.warn('eCourts search failed:', searchRes.status);
      }
    } catch (e) {
      console.warn('Error hitting eCourts API:', e);
    }

    let ecourtContext = '';
    if (ecourtsDetails) {
      ecourtContext = JSON.stringify({
        cnr: cnr,
        petitioner: ecourtsDetails.petitioner,
        respondent: ecourtsDetails.respondent,
        courtName: ecourtsDetails.court_name,
        caseStatus: ecourtsDetails.case_status,
        decisionDate: ecourtsDetails.decision_date,
        natureOfDisposal: ecourtsDetails.nature_of_disposal,
        act: ecourtsDetails.act,
        section: ecourtsDetails.section
      });
    }

    console.log('Generating case analysis from Gemini...');
    let aiAnalysisString: string | null = null;
    
    // Heuristic: Landmark cases are generally heard in High/Supreme Courts or have established citations.
    // District/Taluka/Sessions/Civil Judge courts are generally obscure cases.
    const courtName = (ecourtsDetails?.court_name || '').toLowerCase();
    const isObscureCourt = courtName.includes('district') || 
                           courtName.includes('taluka') || 
                           courtName.includes('magistrate') || 
                           courtName.includes('sessions') ||
                           courtName.includes('civil judge');
                           
    const hasKnownCitation = /\b(scc|air|scr|scale|jt|crilj|llr)\b/i.test(cleanCaseName);
    const isLandmark = !isObscureCourt || hasKnownCitation;

    if (ecourtContext && isLandmark) {
      console.log('Using eCourts context for Gemini analysis (Landmark/Higher Court Case)');
      aiAnalysisString = await generateCaseAnalysisWithContext(cleanCaseName, ecourtContext);
    } else {
      console.log('Using standard Gemini analysis (Obscure/District Case or No eCourts Match)');
      aiAnalysisString = await generateCaseAnalysis(cleanCaseName);
    }
    
    if (!aiAnalysisString) {
      return null;
    }

    const cleanJson = aiAnalysisString.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
    if (!cleanJson.startsWith('{')) {
      return null;
    }

    const aiData = JSON.parse(cleanJson);
    if (aiData.caseName === 'QUOTA_EXCEEDED') {
      return aiData; // Return as is so App.tsx can show quota error
    }

    const finalCaseAnalysis: CaseAnalysis = {
      ...aiData,
      cnr: cnr // Include CNR from eCourts if found
    };

    // 7. Save to Supabase
    try {
      await supabase.from('cases').insert({
        case_name: finalCaseAnalysis.caseName,
        cnr: finalCaseAnalysis.cnr,
        citation: finalCaseAnalysis.citation,
        year: finalCaseAnalysis.year,
        bench: finalCaseAnalysis.bench,
        tags: Array.isArray(finalCaseAnalysis.tags) ? finalCaseAnalysis.tags : [finalCaseAnalysis.tags].filter(Boolean),
        facts: finalCaseAnalysis.facts,
        core_issues: finalCaseAnalysis.coreIssues,
        arguments: finalCaseAnalysis.arguments,
        judgement: finalCaseAnalysis.judgement,
        holding: finalCaseAnalysis.holding,
        ratio_decidendi: finalCaseAnalysis.ratioDecidendi,
        status: finalCaseAnalysis.status,
        source_url: finalCaseAnalysis.primarySourceUrl,
        search_query: query,
        created_at: new Date().toISOString()
      });
      console.log('Saved to Supabase cache');
    } catch (dbError) {
      console.error('Failed to save to Supabase:', dbError);
    }

    // 8. Return data
    return finalCaseAnalysis;

  } catch (error) {
    console.error("fetchCase Error:", error);
    throw error;
  }
};
