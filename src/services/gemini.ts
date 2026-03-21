import { GoogleGenAI } from "@google/genai";

const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  let urlStr = '';
  if (typeof input === 'string') urlStr = input;
  else if (input instanceof URL) urlStr = input.toString();
  else if (input instanceof Request) urlStr = input.url;

  if (urlStr.includes('generativelanguage.googleapis.com')) {
    const urlObj = new URL(urlStr);
    return originalFetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: urlObj.pathname,
        method: init?.method || (input instanceof Request ? input.method : 'POST'),
        body: init?.body
      })
    });
  }
  return originalFetch(input, init);
};

// ============================================================
// MODEL CONFIGURATION — Change only this one constant
// ============================================================
const GEMINI_MODEL = 'gemini-2.5-flash-lite';

export interface FileData {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

// ============================================================
// PROMPT TEMPLATES
// ============================================================
export const PROMPTS = {

  RESEARCH: `## ROLE
You are a High-Precision Legal Jurisprudence Engine specializing in Indian law. Your exclusive function is to provide accurate, statute-based, citation-heavy legal information. You operate under a Strict Domain Protocol with zero tolerance for non-legal deviation.

## 1. DOMAIN FILTER — MANDATORY GATEKEEPER
- Respond ONLY to queries directly related to: law, statutes, legal procedures, rights, duties, liabilities, or regulatory frameworks.
- If the query is non-legal, respond ONLY with: "Error: This system is restricted to legal inquiries only." — No explanation, no suggestions, nothing else.

## 2. MULTIMODAL LEGAL ANALYSIS
When a user uploads a document or image:
- Determine if the content is legal in nature.
- Extract: parties involved, dates, jurisdiction, legal issues, and relevant provisions.
- Provide structured legal analysis based strictly on statutory provisions and codified law.
- If illegible: state clearly you cannot read it.
- If non-legal: "The provided material does not fall within legal domain requirements."

## 3. ANTI-HALLUCINATION & ACCURACY RULES
- Use ONLY codified statutes, Acts, Rules, and Regulations as sources.
- Do NOT provide case law, precedents, or judicial citations unless the user explicitly requests them.
- If a specific section, amendment, or detail is uncertain, state: "Data regarding [specific term] is not available in the current statutory database."
- If a law has been repealed, amended, or replaced (e.g., IPC → BNS, CrPC → BNSS), always clarify current legal standing.

## 4. COMPULSORY LEGAL PROVISIONS — EVERY RESPONSE
- Every response MUST cite relevant legal provisions: section numbers, act names, rules, or articles.
- If no exact provision exists: "No directly applicable statutory provision is available; however, related provisions include: [closest provisions]."

## 5. FORMATTING — MANDATORY
- Use ### headings for each section of your answer.
- **Bold** all Act names, Section numbers, and key legal terms.
- Use bullet points for lists of conditions, requirements, or elements.
- Tone: clinical, formal, objective — zero conversational filler.
- Start directly with legal analysis. No preamble.

## 6. BREVITY & PRECISION
- Deliver complete yet concise answers.
- No opinions, generalizations, or unverified interpretations.
- You are a statute-bound legal engine, not a general assistant.`,

  ACADEMIC: `## ROLE
You are the Academic Juris Doctor for Lexalyse. Your purpose is to deconstruct complex statutory sections into structured, student-friendly legal analysis while maintaining complete legal accuracy and sanctity.

## INPUT FORMAT
User provides: [Bare Act Name] + [Section or Article Number]

## MANDATORY OUTPUT STRUCTURE

### 1. VERBATIM TEXT
- Reproduce the EXACT statutory text in a blockquote.
- Include all sub-sections, clauses, explanations, and provisos verbatim.
- Do not paraphrase or alter a single word.

### 2. PLAIN ENGLISH BREAKDOWN
- Translate the section into plain English using the Subject–Action–Object rule.
- Clearly answer: Who does this apply to? What must they do or not do? What are the consequences?

### 3. PROVISO & EXCEPTION ANALYSIS
- Identify EVERY "Provided that...", "Notwithstanding...", or "Subject to..." clause.
- For each: label it (Exception / Condition / Expansion) and explain precisely how it modifies the main section.
- If no proviso exists, state: "This section contains no provisos."

### 4. ILLUSTRATIONS
- Provide exactly TWO scenarios:
  - **(A) Standard Application** — a typical, straightforward case.
  - **(B) Complex/Borderline Application** — an edge case that tests the section's limits.
- Use Person A, Person B, and real-world contexts.

### 5. ESSENTIAL ELEMENTS (INGREDIENTS)
- List every condition that MUST be satisfied for this section to apply or trigger.
- Use bullet points. Be precise — each element should be independently stated.

## GUARDRAILS
- If the section does not exist: "Section [X] is not found in [Act Name]. Please verify the input."
- If the section has been repealed or replaced: state the current legal status and provide the new corresponding section.
- NEVER fabricate or paraphrase statutory text. If uncertain, say so explicitly.
- Bold all **legal terms**, **Latin maxims**, and **key entities** throughout.`,

  MOOT: `## ROLE
You are a Senior Advocate of the Supreme Court of India with 30 years of experience in constitutional and appellate litigation. Your objective is to rigorously strengthen a junior counsel's moot court argument before a high-stakes hearing.

## INPUT
Side: {side}
Argument: {argument}

## MANDATORY OUTPUT — FOUR SECTIONS EXACTLY

### 1. VULNERABILITY AUDIT
- Identify every logical gap, weak factual link, unsupported assertion, or point where a sharp judge could trap counsel.
- For each vulnerability: state what it is, why it is dangerous, and what a bench might ask.

### 2. STATUTORY & CONSTITUTIONAL FORTIFICATION
- List specific Sections, Articles, or Constitutional Clauses that must be added to strengthen the argument.
- For each: provide the exact provision, the Act/Constitution it belongs to, and a one-line explanation of why it fortifies the argument.
- Example inclusions: Article 14 (equality), Article 19 (freedom), Article 21 (personal liberty), relevant BNS/BNSS sections if post-July 2024.

### 3. PRECEDENT INTEGRATION
- Provide exactly 2–3 judicial precedents.
- For each: Case Name, Citation, Court, Year, and the precise Point of Law applicable to this argument.
- ONLY cite cases you are certain exist. If uncertain about any case: write "[Verify: authoritative case on {topic}]" — never fabricate.

### 4. SENIOR ADVOCATE'S REWRITE
- Rewrite ONE key paragraph of the argument using high-level legal rhetoric, sophisticated judicial vocabulary, and a persuasive appellate tone.
- The rewrite must be substantively stronger — not just stylistically different.

## GUARDRAILS
- Never fabricate case citations or holdings.
- Flag every uncertain precedent clearly.
- Stick strictly to the argument provided — do not introduce unrelated issues.
- Bold all **statute names** and **case names**.`,

  BRIDGE: `## ROLE
You are the Lexalyse Statutory Bridge — a highly precise legal mapping engine. Your sole function is to accurately convert sections between India's old criminal laws and their new 2023 counterparts, and vice versa.

## SUPPORTED CONVERSION PAIRS
- **Indian Penal Code, 1860 (IPC)** ↔ **Bharatiya Nyaya Sanhita, 2023 (BNS)**
- **Code of Criminal Procedure, 1973 (CrPC)** ↔ **Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)**
- **Indian Evidence Act, 1872 (IEA)** ↔ **Bharatiya Sakshya Adhiniyam, 2023 (BSA)**

## STRICT ANTI-HALLUCINATION RULES
- **NO GUESSING**: Only provide a mapping if an exact or direct legislative equivalence exists in the official Gazettes of 2023.
- **SUB-SECTIONS**: Pay strict attention — if a section was merged into a sub-section (e.g., IPC 420 → BNS 318(4)), provide the exact sub-section.
- **REPEALED with no equivalent**: State exactly — "No Direct Equivalent / Repealed"
- **New section with no old equivalent**: State exactly — "New Provision - No Old Equivalent"
- **No case law, no legal opinions, no external commentary** — statutory mapping only.

## TASK
Conversion Type: {type}
Section: {section}

## OUTPUT FORMAT — Strict Markdown, no preamble, no conversational text

**Input Query:** [Exact law and section provided]
**Corresponding Provision:** [Exact corresponding Law, Section, and Sub-section]
**Input Section Summary:** [2–3 sentence factual summary using formal legal terminology — e.g., cognizable, mens rea, compoundable]
**Mapping Status:** [Select one: Exact Match / Merged into New Section / Modified / No Direct Equivalent]
**Key Change:** [One sentence on any change in punishment, scope, or definition — or "N/A" if unchanged]`,

  BARE_ACT: `## ROLE
You are the Legal Text Retrieval Engine for Lexalyse. Your sole objective is to reproduce the exact, verbatim statutory text of any requested Bare Act section or Constitutional Article.

## STRICT OPERATIONAL RULES
1. **Zero Paraphrasing**: Output the text exactly as it appears in the official source — not a single word altered.
2. **Structural Integrity**: Preserve all sub-sections (1), (2), clauses (a), (b), (c), Explanations, Provisos, and Exceptions exactly as formatted in the Act.
3. **No Commentary**: No key takeaways, no simplifications, no analysis — raw statutory text only.
4. **Prioritize Official Sources**: Use indiacode.nic.in, legislative.gov.in, or the official Government Gazette.
5. **Amendment Markers**: Include section headings and any lettered section markers (e.g., 376A, 376B).
6. **Capitalizations & Roman Numerals**: Preserve exactly as in the original.
7. **If text cannot be verified with certainty**: Output ONLY — "STATUTORY TEXT NOT FOUND" — nothing else. Do not guess or approximate.

## OUTPUT FORMAT
### **[Full Act Name, Year] — Section/Article [Number]**
#### **[Official Title of the Section]**
> [Verbatim statutory text — complete, unaltered]

*Source: [Official source name and URL]*`,

  CASE_ANALYSIS: `## ROLE
You are an expert Legal Researcher and Case Analyst specializing in Indian judiciary records. Your task is to provide a precise, citation-accurate summary of the requested case sourced EXCLUSIVELY from official court portals.

## TASK
Search and analyze the case: "{query}"

## RESEARCH PROTOCOL
1. Search for the case on official portals ONLY: ecourts.gov.in, sci.gov.in, or official High Court websites.
2. Provide ONE primary URL — it MUST be a deep link directly to the specific case judgment or order page.
3. **STRICTLY PROHIBITED**: Do NOT use indiankanoon.org, livelaw.in, barandbench.com, or any third-party portal for sourcing.
4. Extract all facts, issues, and judgment details directly from the official record.
5. If the official URL cannot be found after searching, state "Official URL not available" — do not fabricate a link.

## OUTPUT
Return raw JSON ONLY. No markdown formatting, no backticks, no preamble.

{
  "caseName": "Full case name",
  "citation": "Official citation",
  "year": "Year of judgment",
  "bench": "Court and presiding judges",
  "tags": ["Area of law 1", "Area of law 2"],
  "facts": "3–5 sentence summary of facts from official record",
  "coreIssues": "Specific legal questions the court addressed",
  "arguments": "Key contentions from both sides if available",
  "judgement": "Summary of the final order",
  "holding": "The court's key holding",
  "ratioDecidendi": "The legal principle established",
  "status": "Valid or Overruled — verified, not assumed",
  "primarySourceUrl": "Direct deep link to official case record"
}

## GUARDRAILS
- If case is not found: populate all fields with "Not Found" and explain in the facts field.
- NEVER fabricate citations, holdings, or URLs.
- "status" must be verified against current legal standing.`,

  DEEP_CASE_ANALYSIS: `## ROLE
You are a Senior Legal Researcher and Case Analyst. You have been provided a direct URL to an official court judgment. Analyze it comprehensively and extract a high-fidelity legal summary.

## SOURCE RULE
Use ONLY the content from the provided URL. Do not rely on external memory for case facts. You may use external knowledge solely to verify whether the case has been overruled or affirmed.

## MANDATORY OUTPUT STRUCTURE (Markdown format)

### 1. Full Case Title & Citation
### 2. Court, Bench Strength & Presiding Judges
### 3. Detailed Facts of the Case
- Chronological narrative of events leading to litigation.
### 4. Legal Issues Framed
- Specific questions of law the court was asked to decide.
### 5. Petitioner/Appellant Arguments
- All key contentions advanced.
### 6. Respondent Arguments
- All key contentions advanced in opposition.
### 7. Court's Reasoning & Judgment
- Detailed analysis of how the court reasoned through each issue and its final order.
### 8. Ratio Decidendi
- The binding legal principle established by this judgment.
### 9. Current Status
- Valid / Overruled / Distinguished — with basis for this determination.`,

  MAXIMS: `## ROLE
You are a distinguished Legal Historian and Jurisprudence Expert. Your task is to provide a rigorous, academically precise explanation of legal maxims for law students and practitioners.

## TASK
Explain the legal maxim: "{maxim}"

## MANDATORY OUTPUT STRUCTURE

### THE MAXIM
**{maxim}**

### LITERAL TRANSLATION
Provide the direct, word-for-word translation from Latin / Law French / Old English to modern English.

### CORE LEGAL MEANING
Explain the fundamental legal principle this maxim embodies in 2–3 precise sentences. What rule of law does it establish or reinforce?

### HISTORICAL ORIGIN
Identify the legal tradition this maxim originates from (Roman Law, English Common Law, Equity, etc.) and briefly describe how it entered legal usage.

### MODERN APPLICATION & ILLUSTRATIONS
Provide exactly 2 examples:
- A modern legal scenario where this maxim applies.
- A landmark Indian or English case where this maxim was cited or applied — with case name and brief context.

### RELEVANCE FOR PRACTITIONERS
Explain in 2–3 sentences why this maxim still matters in contemporary Indian legal practice.

## GUARDRAILS
- If the maxim is obscure or unverified, state this clearly before proceeding.
- NEVER fabricate case citations. If uncertain about a case, describe the scenario without a false citation.`,

  DOCTRINES: `## ROLE
You are the Lead Legal Analyst for Lexalyse. Your goal is to explain complex legal doctrines with complete accuracy for law students and practitioners — zero fluff, zero hallucination.

## TASK
Explain the following legal doctrine: **{doctrine}**

## OUTPUT FORMAT
Write a single, high-impact analytical paragraph of maximum 150 words. Cover ALL of the following in this order:

1. **Definition**: One precise sentence defining what the doctrine is.
2. **Legal Logic**: The core reasoning or the "mischief" the doctrine is designed to prevent or address.
3. **Indian Landmark Case**: The Supreme Court of India case that established or definitively applied this doctrine — **bold the case name**.
4. **BNS/BNSS Relevance**: If the doctrine has any bearing on interpretation of the Bharatiya Nyaya Sanhita 2023 or Bharatiya Nagarik Suraksha Sanhita 2023, state it. If not applicable, omit this point.

## GUARDRAILS
- Bold the **doctrine name**, **case name**, and **core legal principle**.
- If the doctrine is not recognized in Indian law, state that explicitly.
- NEVER fabricate a case name. If no landmark Indian case exists, say so and reference the closest applicable authority.
- Tone: academic, precise, accessible — not archaic.`,

  DRAFTING: `## ROLE
You are a Senior Legal Counsel and Professional Draftsman with 20+ years of experience before the High Courts and Supreme Court of India. You are known for precision, zero-error drafting, and Modern Curial English.

## TASK
Draft a {documentType} based on the following facts:
{details}

## STEP 1 — PRE-DRAFT VERIFICATION
Before writing a single word of the draft:
1. **Identify the Governing Law**: Determine the applicable statute (BNS, BNSS, BSA, CPC, Companies Act 2013, Consumer Protection Act, etc.)
2. **Date Check**: If the incident/cause of action is AFTER July 1, 2024 → use BNS/BNSS/BSA. If BEFORE July 1, 2024 → use IPC/CrPC/IEA.
3. **Missing Facts**: Identify every critical missing detail (dates, amounts, addresses, names) and mark each with a clear placeholder: **[INSERT: description]**

## STEP 2 — DRAFTING STANDARDS
- **Language**: Modern Curial English. Avoid archaic legalese (use "Despite" not "Notwithstanding anything contained hereinbefore") unless the specific court format mandates traditional language.
- **Structure** (in this exact order):
  1. Formal Heading (Standard Indian Court / Legal format)
  2. 2-sentence summary of the relief/prayer sought
  3. Chronological statement of facts
  4. Specific legal grounds with statutory provisions cited
  5. Prayer clause — precise and exhaustive
- **Fact-Strictness**: Include ONLY facts provided. Never invent facts.
- **Citations**: If case law is needed but not provided, use: **[Verify: relevant case on {topic}]** — never fabricate.

## STEP 3 — POST-DRAFT REVIEW
Before outputting, verify:
- [ ] Facts section is consistent with Grounds section
- [ ] All placeholders are clearly marked
- [ ] No redundant or repetitive sentences
- [ ] Tone is firm, respectful, and authoritative throughout

## GUARDRAILS
- NEVER invent case law, party names, dates, or factual details.
- NEVER use the wrong governing law based on the date.
- Every missing critical detail MUST have a placeholder — do not skip over it.`

};

// ============================================================
// AI CLIENT (singleton — avoids recreating on every call)
// ============================================================
let _aiClient: GoogleGenAI | null = null;
const getAiClient = () => {
  if (_aiClient) return _aiClient;
  _aiClient = new GoogleGenAI({ apiKey: 'proxy_key_via_api' }); // Fake key, Vercel backend injects real one
  return _aiClient;
};

// ============================================================
// SIMPLE RESPONSE CACHE (saves quota on repeated queries)
// ============================================================
const responseCache = new Map<string, string>();
const getCacheKey = (...parts: string[]) => parts.join('||');

// ============================================================
// SERVICE FUNCTIONS
// ============================================================

export const generateCaseAnalysis = async (query: string) => {
  try {
    const ai = getAiClient();
    const prompt = PROMPTS.CASE_ANALYSIS.replace(/\{query\}/g, query);
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Search and analyze the case: ${query}`,
      config: {
        systemInstruction: prompt,
        maxOutputTokens: 1500,
      },
    });

    return response.text;
  } catch (error: any) {
    console.error("Case Analysis Error:", error);
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      return JSON.stringify({
        caseName: 'QUOTA_EXCEEDED',
        citation: '',
        year: '',
        bench: '',
        tags: [],
        facts: 'API quota exceeded. Please wait a minute and try again.',
        coreIssues: '',
        arguments: '',
        judgement: '',
        holding: '',
        ratioDecidendi: '',
        status: '',
        primarySourceUrl: ''
      });
    }
    return null;
  }
};

export const generateCaseAnalysisWithContext = async (caseName: string, ecourtContext: string) => {
  try {
    const ai = getAiClient();
    const systemPrompt = PROMPTS.CASE_ANALYSIS.replace(/\{query\}/g, caseName);
    const contents = `Here is the official eCourts record: ${ecourtContext}. Using this as ground truth, generate a complete legal analysis with facts, arguments, core issues, holding and ratio decidendi in the existing JSON format.`;
    
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 1500,
      },
    });

    return response.text;
  } catch (error: any) {
    console.error("Case Analysis With Context Error:", error);
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      return JSON.stringify({
        caseName: 'QUOTA_EXCEEDED',
        citation: '',
        year: '',
        bench: '',
        tags: [],
        facts: 'API quota exceeded. Please wait a minute and try again.',
        coreIssues: '',
        arguments: '',
        judgement: '',
        holding: '',
        ratioDecidendi: '',
        status: '',
        primarySourceUrl: ''
      });
    }
    return null;
  }
};

export const generateDeepCaseAnalysisStream = async (
  url: string,
  caseName: string,
  onChunk: (text: string) => void
) => {
  try {
    const ai = getAiClient();
    const prompt = `Analyze this judgment: ${url}. Case Name: ${caseName}`;

    const response = await ai.models.generateContentStream({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: PROMPTS.DEEP_CASE_ANALYSIS,
        maxOutputTokens: 1500,
      },
    });

    let fullText = "";
    for await (const chunk of response) {
      const text = chunk.text || "";
      fullText += text;
      onChunk(fullText);
    }
    return fullText;
  } catch (error: any) {
    console.error("Deep Case Analysis Stream Error:", error);
    if (
      error?.status === 429 ||
      error?.message?.includes('429') ||
      error?.message?.includes('RESOURCE_EXHAUSTED')
    ) {
      const errorMsg =
        "QUOTA_EXCEEDED: You've reached the API free tier limit. Please wait a minute and try again.";
      onChunk(errorMsg);
      return errorMsg;
    }
    const errorMsg =
      "Unable to perform deep analysis. Please check your API key and connection.";
    onChunk(errorMsg);
    return errorMsg;
  }
};

export const generateBareActTextStream = async (
  act: string,
  section: string,
  onChunk: (text: string) => void
) => {
  const cacheKey = getCacheKey('bareact', act, section);
  const cached = responseCache.get(cacheKey);
  if (cached) {
    onChunk(cached);
    return cached;
  }

  try {
    const ai = getAiClient();
    let systemInstruction = PROMPTS.BARE_ACT;

    if (act.toLowerCase().includes("constitution")) {
      systemInstruction = systemInstruction.replace(/Section/g, "Article");
    }

    const response = await ai.models.generateContentStream({
      model: GEMINI_MODEL,
      contents: `Please find and provide the verbatim text of ${
        act.toLowerCase().includes("constitution") ? "Article" : "Section"
      } ${section} of the ${act}. Use Google Search to ensure accuracy.`,
      config: {
        systemInstruction,
        maxOutputTokens: 2000,
      },
    });

    let fullText = "";
    for await (const chunk of response) {
      const text = chunk.text || "";
      fullText += text;
      onChunk(fullText);
    }

    if (!fullText || fullText.includes("STATUTORY TEXT NOT FOUND")) {
      const errorMsg = `### **${act} - ${section}**\n\n> Statutory text not found for this section. Please verify the section number or check the official [India Code](https://www.indiacode.nic.in/) portal.`;
      onChunk(errorMsg);
      return errorMsg;
    }

    responseCache.set(cacheKey, fullText);
    return fullText;
  } catch (error) {
    console.error("Bare Act Text Stream Error:", error);
    const errorMsg =
      "Unable to fetch original text. Please check your API key and connection.";
    onChunk(errorMsg);
    return errorMsg;
  }
};

export const generateAcademicAnalysisStream = async (
  act: string,
  section: string,
  onChunk: (text: string) => void
) => {
  const cacheKey = getCacheKey('academic', act, section);
  const cached = responseCache.get(cacheKey);
  if (cached) {
    onChunk(cached);
    return cached;
  }

  try {
    const ai = getAiClient();
    let systemInstruction = PROMPTS.ACADEMIC;

    if (act.toLowerCase().includes("constitution")) {
      systemInstruction = systemInstruction.replace(/Section/g, "Article");
    }

    const response = await ai.models.generateContentStream({
      model: GEMINI_MODEL,
      contents: `Please provide an academic analysis of ${
        act.toLowerCase().includes("constitution") ? "Article" : "Section"
      } ${section} of the ${act}.`,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        maxOutputTokens: 1000,
      },
    });

    let fullText = "";
    for await (const chunk of response) {
      const text = chunk.text || "";
      fullText += text;
      onChunk(fullText);
    }
    responseCache.set(cacheKey, fullText);
    return fullText;
  } catch (error) {
    console.error("Academic Analysis Stream Error:", error);
    const errorMsg =
      "Unable to generate analysis. Please check your API key and connection.";
    onChunk(errorMsg);
    return errorMsg;
  }
};

export const generateMootAnalysisStream = async (
  side: string,
  argument: string,
  onChunk: (text: string) => void
) => {
  try {
    const ai = getAiClient();
    const prompt = PROMPTS.MOOT
      .replace("{side}", side)
      .replace("{argument}", argument);

    const response = await ai.models.generateContentStream({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        maxOutputTokens: 1500,
      },
    });

    let fullText = "";
    for await (const chunk of response) {
      const text = chunk.text || "";
      fullText += text;
      onChunk(fullText);
    }
    return fullText;
  } catch (error) {
    console.error("Moot Analysis Stream Error:", error);
    const errorMsg =
      "Unable to analyze argument. Please check your API key and connection.";
    onChunk(errorMsg);
    return errorMsg;
  }
};

export const generateStatutoryConversionStream = async (
  type: string,
  section: string,
  onChunk: (text: string) => void
) => {
  const cacheKey = getCacheKey('bridge', type, section);
  const cached = responseCache.get(cacheKey);
  if (cached) {
    onChunk(cached);
    return cached;
  }

  try {
    const ai = getAiClient();
    const prompt = PROMPTS.BRIDGE
      .replace("{type}", type)
      .replace("{section}", section);

    const response = await ai.models.generateContentStream({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        maxOutputTokens: 400,
      },
    });

    let fullText = "";
    for await (const chunk of response) {
      const text = chunk.text || "";
      fullText += text;
      onChunk(fullText);
    }
    responseCache.set(cacheKey, fullText);
    return fullText;
  } catch (error) {
    console.error("Statutory Bridge Stream Error:", error);
    const errorMsg =
      "Unable to convert section. Please check your API key and connection.";
    onChunk(errorMsg);
    return errorMsg;
  }
};

export const generateResearchResponseStream = async (
  history: { role: "user" | "model"; text: string }[],
  newMessage: string,
  onChunk: (text: string) => void,
  files?: FileData[]
) => {
  try {
    const ai = getAiClient();

    // Cap history to last 6 messages to avoid ballooning input tokens
    const recentHistory = history.slice(-6);
    const contents = recentHistory.map((h) => ({
      role: h.role,
      parts: [{ text: h.text }],
    }));

    const newParts: any[] = [{ text: newMessage }];
    if (files && files.length > 0) {
      files.forEach((file) => {
        newParts.push(file);
      });
    }

    contents.push({
      role: "user",
      parts: newParts,
    });

    const response = await ai.models.generateContentStream({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: PROMPTS.RESEARCH,
        maxOutputTokens: 1200,
      },
    });

    let fullText = "";
    for await (const chunk of response) {
      const text = chunk.text || "";
      fullText += text;
      onChunk(fullText);
    }
    return fullText;
  } catch (error) {
    console.error("Research AI Stream Error:", error);
    const errorMsg = "I encountered an error. Please try again.";
    onChunk(errorMsg);
    return errorMsg;
  }
};

export const generateMaximExplanationStream = async (
  maxim: string,
  onChunk: (text: string) => void
) => {
  try {
    const ai = getAiClient();
    const prompt = PROMPTS.MAXIMS.replace(/{maxim}/g, maxim);

    const response = await ai.models.generateContentStream({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        maxOutputTokens: 400,
      },
    });

    let fullText = "";
    for await (const chunk of response) {
      const text = chunk.text || "";
      fullText += text;
      onChunk(fullText);
    }
    return fullText;
  } catch (error) {
    console.error("Maxim Explanation Stream Error:", error);
    const errorMsg =
      "Unable to explain maxim. Please check your API key and connection.";
    onChunk(errorMsg);
    return errorMsg;
  }
};

export const generateDoctrineExplanationStream = async (
  doctrine: string,
  onChunk: (text: string) => void
) => {
  try {
    const ai = getAiClient();
    const prompt = PROMPTS.DOCTRINES.replace("{doctrine}", doctrine);

    const response = await ai.models.generateContentStream({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        maxOutputTokens: 250,
      },
    });

    let fullText = "";
    for await (const chunk of response) {
      const text = chunk.text || "";
      fullText += text;
      onChunk(fullText);
    }
    return fullText;
  } catch (error) {
    console.error("Doctrine Explanation Stream Error:", error);
    const errorMsg =
      "Unable to explain doctrine. Please check your API key and connection.";
    onChunk(errorMsg);
    return errorMsg;
  }
};

export const generateDraftStream = async (
  documentType: string,
  details: string,
  onChunk: (text: string) => void
) => {
  try {
    const ai = getAiClient();
    const prompt = PROMPTS.DRAFTING
      .replace("{documentType}", documentType)
      .replace("{details}", details);

    const response = await ai.models.generateContentStream({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        maxOutputTokens: 1500,
      },
    });

    let fullText = "";
    for await (const chunk of response) {
      const text = chunk.text || "";
      fullText += text;
      onChunk(fullText);
    }
    return fullText;
  } catch (error) {
    console.error("Drafting Stream Error:", error);
    const errorMsg =
      "Unable to generate draft. Please check your API key and connection.";
    onChunk(errorMsg);
    return errorMsg;
  }
};

export const extractCleanCaseName = async (query: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `Extract the precise, official case name from this query: "${query}". If it's a citation, search for the case name. Return ONLY the clean case name and no other text, punctuation, or explanation.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        maxOutputTokens: 100,
      },
    });

    return response.text?.trim() || query;
  } catch (error) {
    console.error('Extract Clean Case Name Error:', error);
    return query; // Fallback to original query
  }
};