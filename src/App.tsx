import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Search, Scale, BookOpen, Gavel, ScrollText, LayoutDashboard, Upload, ChevronRight, Book, ArrowRight, ArrowLeft, AlertTriangle, ArrowLeftRight, Sparkles, Send, Bot, FileText, Users, Calendar, CheckCircle, XCircle, ShieldAlert, X, Menu, BrainCircuit, Plus, Paperclip, ChevronDown, Mic, Quote, Copy } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "./lib/utils";
import { Toaster, toast } from "sonner";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  generateAcademicAnalysisStream, 
  generateMootAnalysisStream, 
  generateStatutoryConversionStream, 
  generateResearchResponseStream, 
  generateCaseAnalysis, 
  generateMaximExplanationStream, 
  generateDoctrineExplanationStream, 
  generateDraftStream
} from './services/gemini';
import { fetchCase } from './services/ecourt';
import LandingPage from './components/LandingPage';

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/sections/Dashboard';
import { Repository } from './components/sections/Repository';
import { Academic } from './components/sections/Academic';
import { MootCourt } from './components/sections/MootCourt';
import { StatutoryBridge } from './components/sections/StatutoryBridge';
import { Maxims } from './components/sections/Maxims';
import { Doctrines } from './components/sections/Doctrines';
import { DraftDash } from './components/sections/DraftDash';
import { LexalyseAI } from './components/sections/LexalyseAI';
import { Act, ChatMessage, CaseAnalysis } from './types';
import { acts } from './data/acts';
import { PROVIDED_MAXIMS } from './data/maxims';
import { PROVIDED_DOCTRINES } from './data/doctrines';



const LexalyseApp = () => {
  const [activeTab, setActiveTab] = useState('dash');

  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    if (path === '/app/repository') setActiveTab('repository');
    else if (path === '/app/academic') setActiveTab('academic');
    else if (path === '/app/moot') setActiveTab('moot');
    else if (path === '/app/bridge') setActiveTab('bridge');
    else if (path === '/app/maxims') setActiveTab('maxims');
    else if (path === '/app/doctrines') setActiveTab('doctrines');
    else if (path === '/app/draft') setActiveTab('draft');
    else if (path === '/app/research') setActiveTab('research');
    else setActiveTab('dash');
  }, [location.pathname]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAct, setSelectedAct] = useState<Act | null>(null);
  const [academicSearch, setAcademicSearch] = useState('');
  const [mootSide, setMootSide] = useState('petitioner');
  const [mootArgument, setMootArgument] = useState('');
  const [bridgeConversionType, setBridgeConversionType] = useState('IPC -> BNS');
  const [bridgeSection, setBridgeSection] = useState('');
  
  // Repository State
  const [repoSearch, setRepoSearch] = useState('');
  const [caseResult, setCaseResult] = useState<CaseAnalysis | null>(null);
  const [isRepoLoading, setIsRepoLoading] = useState(false);
  const [selectedCaseApiData, setSelectedCaseApiData] = useState<any>(null);
  const [isCaseApiLoading, setIsCaseApiLoading] = useState(false);

  // AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatFiles, setChatFiles] = useState<{ name: string, data: string, mimeType: string }[]>([]);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(prev => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Gemini Integration States
  const [academicAnalysis, setAcademicAnalysis] = useState<string | null>(null);
  const [sectionSearchQuery, setSectionSearchQuery] = useState('');
  const [isAcademicLoading, setIsAcademicLoading] = useState(false);
  
  const [mootAnalysis, setMootAnalysis] = useState<string | null>(null);
  const [isMootLoading, setIsMootLoading] = useState(false);

  const [bridgeResult, setBridgeResult] = useState<string | null>(null);
  const [isBridgeLoading, setIsBridgeLoading] = useState(false);

  // Legal Maxims State
  const [maximSearch, setMaximSearch] = useState('');
  const [maximResult, setMaximResult] = useState<string | null>(null);
  const [isMaximLoading, setIsMaximLoading] = useState(false);

  // Doctrines State
  const [doctrineSearch, setDoctrineSearch] = useState('');
  const [doctrineResult, setDoctrineResult] = useState<string | null>(null);
  const [isDoctrineLoading, setIsDoctrineLoading] = useState(false);
  const [selectedDoctrine, setSelectedDoctrine] = useState<string | null>(null);

  // DraftDash State
  const [draftType, setDraftType] = useState('Legal Notice');
  const [customDraftType, setCustomDraftType] = useState('');
  const [draftDetails, setDraftDetails] = useState('');
  const [draftResult, setDraftResult] = useState<string | null>(null);
  const [isDraftLoading, setIsDraftLoading] = useState(false);

  // Advanced Arguments State
  const [argumentAnalysis, setArgumentAnalysis] = useState('');
  const [isArgumentLoading, setIsArgumentLoading] = useState(false);
  
  // Rate Limiting State
  const [lastApiCallTime, setLastApiCallTime] = useState(0);
  const API_COOLDOWN_MS = 3000; // 3 second cooldown between any AI requests

  // Theme State
  const isDarkMode = true;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Auto-switch theme based on active tab removed

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Example Cases Data
  const EXAMPLE_CASES: CaseAnalysis[] = [
    {
      caseName: "Kesavananda Bharati v. State of Kerala",
      citation: "AIR 1973 SC 1461",
      year: "1973",
      bench: "13 Judges (Full Bench)",
      tags: ["Constitution", "Basic Structure", "Fundamental Rights"],
      facts: "Swami Kesavananda Bharati challenged the Kerala government's land reform acts restricting management of his property. The petition expanded to challenge the 24th, 25th, and 29th Constitutional Amendments.",
      coreIssues: "Whether Parliament has unlimited power to amend the Constitution under Article 368.",
      arguments: "Petitioner: Parliament cannot alter the essential features. Respondent: Parliament has unlimited power.",
      judgement: "By a narrow majority of 7:6, the Supreme Court held that while Parliament has wide powers to amend the Constitution under Article 368, this power is not unlimited.",
      holding: "The Court introduced the 'Basic Structure Doctrine'. It held that any amendment that alters the basic structure (democracy, secularism, federalism, judicial review, etc.) is ultra vires.",
      ratioDecidendi: "Parliament cannot alter the basic features of the Constitution. The power to amend is not a power to destroy.",
      status: "Valid",
      primarySourceUrl: "https://main.sci.gov.in/jonew/judis/4657.pdf"
    },
    {
      caseName: "Maneka Gandhi v. Union of India",
      citation: "AIR 1978 SC 597",
      year: "1978",
      bench: "7 Judges",
      tags: ["Article 21", "Personal Liberty", "Due Process"],
      facts: "Maneka Gandhi's passport was impounded by the government in 'public interest'. She was not given reasons or a hearing, challenging this as a violation of Article 21.",
      coreIssues: "Whether the procedure established by law under Article 21 must be fair, just and reasonable.",
      arguments: "Petitioner: Impounding without hearing violates natural justice. Respondent: Passport Act allows impounding in public interest.",
      judgement: "The Court expanded the scope of Article 21, ruling that 'procedure established by law' must be 'fair, just and reasonable', not fanciful, oppressive or arbitrary.",
      holding: "The right to travel abroad is part of personal liberty. The procedure for depriving liberty must satisfy the test of reasonableness and natural justice.",
      ratioDecidendi: "Article 21 is not a distinct code but interconnected with Articles 14 and 19. 'Procedure established by law' implies 'Due Process of Law'.",
      status: "Valid",
      primarySourceUrl: "https://main.sci.gov.in/jonew/judis/5314.pdf"
    },
    {
      caseName: "S.R. Bommai v. Union of India",
      citation: "AIR 1994 SC 1918",
      year: "1994",
      bench: "9 Judges",
      tags: ["Federalism", "Article 356", "Secularism"],
      facts: "Dismissal of state governments in Karnataka, Meghalaya, and others under Article 356 was challenged. The core issue was the scope of President's Rule.",
      coreIssues: "Scope of judicial review of Presidential Proclamation under Article 356.",
      arguments: "Petitioner: Dismissal was politically motivated. Respondent: President's satisfaction is subjective.",
      judgement: "The Court laid down strict guidelines for imposing President's Rule. It held that federalism and secularism are basic features of the Constitution.",
      holding: "Presidential Proclamation under Art 356 is subject to judicial review. The floor test is the only way to test a majority, not the Governor's opinion.",
      ratioDecidendi: "Secularism is a basic feature. Misuse of Art 356 to dismiss state governments on political grounds is unconstitutional.",
      status: "Valid",
      primarySourceUrl: "https://main.sci.gov.in/jonew/judis/11499.pdf"
    }
  ];

  const handleExampleClick = (example: CaseAnalysis) => {
    setCaseResult(example);
    setRepoSearch(example.caseName);
  };

  // Helper: detect quota/key errors in streamed text responses
  const checkResponseForErrors = (text: string): boolean => {
    if (!text) return false;
    if (text.includes('QUOTA_EXCEEDED') || text.includes('RESOURCE_EXHAUSTED') || text.includes('429')) {
      toast.error('AI Requests Exhausted', {
        description: 'You\'ve used up your free AI requests for now. Wait a few minutes and try again.',
        duration: 6000,
      });
      return true;
    }
    if (text.includes('API Key is missing') || text.includes('API key')) {
      toast.error('AI Service Down', {
        description: 'Our AI service is temporarily unavailable. We\'re working on it — please try again later.',
        duration: 8000,
      });
      return true;
    }
    if (text.includes('Unable to') || text.includes('error') && text.length < 100) {
      toast.error('Something Went Wrong', {
        description: 'Couldn\'t get a response. Check your internet connection and try again.',
        duration: 5000,
      });
      return true;
    }
    return false;
  };

  // Helper: Global rate limiter to prevent spam clicking
  const checkRateLimit = (): boolean => {
    const now = Date.now();
    if (now - lastApiCallTime < API_COOLDOWN_MS) {
      toast.error('Please Wait', {
        description: 'You are requesting too fast. Please wait a few seconds before your next AI request.',
        duration: 3000,
      });
      return false; // Not allowed
    }
    setLastApiCallTime(now);
    return true; // Allowed
  };

  const handleCaseSearch = async () => {
    if (!repoSearch.trim() || isRepoLoading) return;
    if (!checkRateLimit()) return;
    setIsRepoLoading(true);
    setCaseResult(null);
    
    try {
      const parsed = await fetchCase(repoSearch);
      if (parsed) {
        if (parsed.caseName === 'QUOTA_EXCEEDED') {
          toast.error('AI Requests Exhausted', {
            description: 'You\'ve used up your free AI requests for now. Wait a few minutes and try again.',
            duration: 6000,
          });
        } else {
          setCaseResult(parsed);
        }
      } else {
        toast.error('No Results Found', {
          description: 'We couldn\'t find that case. Try searching with a different name or citation.',
          duration: 4000,
        });
      }
    } catch (error: any) {
      console.error("Case Search Error:", error);
      if (error?.message?.includes('API Key is missing')) {
        toast.error('AI Service Down', {
          description: 'Our AI service is temporarily unavailable. We\'re working on it — please try again later.',
          duration: 8000,
        });
      } else {
        toast.error('Search Failed', {
          description: 'We couldn\'t complete your search. Please check your internet and try again.',
          duration: 5000,
        });
      }
    }
    setIsRepoLoading(false);
  };

  const handleChatSubmit = async () => {
    if ((!chatInput.trim() && chatFiles.length === 0) || isAiLoading) return;
    if (!checkRateLimit()) return;
    
    const userMsg = chatInput;
    const currentFiles = [...chatFiles];
    
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg, files: currentFiles }]);
    setChatInput('');
    setChatFiles([]);
    setIsAiLoading(true);

    try {
      const filesForAi = currentFiles.map(f => ({
        inlineData: {
          data: f.data.split(',')[1],
          mimeType: f.mimeType
        }
      }));

      // Add an empty message for the model that we will stream into
      setChatMessages(prev => [...prev, { role: 'model', text: '' }]);

      await generateResearchResponseStream(
        chatMessages.map(m => ({ role: m.role, text: m.text })),
        userMsg,
        (chunk) => {
          if (chunk.includes("QUOTA_EXCEEDED")) {
            toast.error("AI Requests Exhausted", {
              description: "You've used up your free AI requests for now. Wait a few minutes and try again."
            });
          }
          setChatMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = chunk;
            return newMessages;
          });
        },
        filesForAi
      );
    } catch (error) {
      console.error("AI Error:", error);
      toast.error("Something Went Wrong", {
        description: "We couldn't get a response right now. Please check your internet and try again."
      });
      setChatMessages(prev => {
        const newMessages = [...prev];
        if (newMessages[newMessages.length - 1].role === 'model' && !newMessages[newMessages.length - 1].text) {
          newMessages[newMessages.length - 1].text = "Sorry, I couldn't process your request. Please try again.";
        }
        return newMessages;
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setChatFiles(prev => [...prev, {
          name: file.name,
          data: reader.result as string,
          mimeType: file.type
        }]);
        toast.success("File attached", {
          description: `${file.name} is ready for analysis.`
        });
      };
      reader.readAsDataURL(file);
    });
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setChatFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAcademicAnalysis = async () => {
    if (!selectedAct) return;
    if (!checkRateLimit()) return;
    const query = sectionSearchQuery.trim() || "General Overview";
    
    setIsAcademicLoading(true);
    setAcademicAnalysis("");
    
    const actNameWithYear = selectedAct.year && selectedAct.year !== 'Various' && selectedAct.year !== 'Common Law'
      ? `${selectedAct.title} (${selectedAct.year})` 
      : selectedAct.title;

    const fullActContext = selectedAct.fullName 
      ? `${selectedAct.fullName} (${selectedAct.year})`
      : (selectedAct.description ? `${actNameWithYear} (Full Name: ${selectedAct.description})` : actNameWithYear);

    // Only fetch analysis by default to save API quota
    const result = await generateAcademicAnalysisStream(fullActContext, query, (chunk) => setAcademicAnalysis(chunk));
    if (result) checkResponseForErrors(result);
    
    setIsAcademicLoading(false);
  };

  const handleMootAnalysis = async () => {
    if (!mootArgument.trim() || isMootLoading) return;
    if (!checkRateLimit()) return;
    setIsMootLoading(true);
    setMootAnalysis("");
    const result = await generateMootAnalysisStream(mootSide, mootArgument, (chunk) => setMootAnalysis(chunk));
    if (result) checkResponseForErrors(result);
    setIsMootLoading(false);
  };

  const handleBridgeConversion = async () => {
    if (!bridgeSection.trim() || isBridgeLoading) return;
    if (!checkRateLimit()) return;
    setIsBridgeLoading(true);
    setBridgeResult("");
    const result = await generateStatutoryConversionStream(bridgeConversionType, bridgeSection, (chunk) => setBridgeResult(chunk));
    if (result) checkResponseForErrors(result);
    setIsBridgeLoading(false);
  };

  const handleMaximSearch = async (maxim?: string) => {
    const query = maxim || maximSearch;
    if (!query.trim() || isMaximLoading) return;
    
    setIsMaximLoading(true);
    setMaximResult(null);
    if (maxim) setMaximSearch(maxim);
    
    // Check if it's in our provided list first
    const provided = PROVIDED_MAXIMS.find(m => m.term.toLowerCase() === query.toLowerCase());
    if (provided) {
      setMaximResult(`### THE MAXIM\n**${provided.term}**\n\n### DEFINITION\n${provided.definition}`);
      setIsMaximLoading(false);
      return;
    }
    
    // Fallback to Gemini for other maxims
    if (!checkRateLimit()) {
      setIsMaximLoading(false);
      return;
    }
    setMaximResult("");
    const result = await generateMaximExplanationStream(query, (chunk) => setMaximResult(chunk));
    if (result) checkResponseForErrors(result);
    setIsMaximLoading(false);
  };

  const handleDoctrineAnalysis = async (doctrine: string) => {
    if (isDoctrineLoading) return;
    setIsDoctrineLoading(true);
    setSelectedDoctrine(doctrine);
    setDoctrineResult("");
    
    // Serve locally first to save API quota
    const provided = PROVIDED_DOCTRINES.find(d => d.term.toLowerCase() === doctrine.toLowerCase());
    if (provided) {
      setDoctrineResult(`### ${provided.term}\n\n${provided.definition}`);
      setIsDoctrineLoading(false);
      return;
    }
    
    // Fallback to Gemini for unknown doctrines
    if (!checkRateLimit()) {
      setIsDoctrineLoading(false);
      return;
    }
    const result = await generateDoctrineExplanationStream(doctrine, (chunk) => setDoctrineResult(chunk));
    if (result) checkResponseForErrors(result);
    setIsDoctrineLoading(false);
  };

  const handleDraftGeneration = async () => {
    if (!draftDetails.trim() || isDraftLoading) return;
    if (!checkRateLimit()) return;
    setIsDraftLoading(true);
    setDraftResult("");
    const finalType = draftType === 'Other / Custom' ? customDraftType : draftType;
    const result = await generateDraftStream(finalType || 'Legal Document', draftDetails, (chunk) => setDraftResult(chunk));
    if (result) checkResponseForErrors(result);
    setIsDraftLoading(false);
  };

  const handleSourceClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCaseApiLoading(true);
    setSelectedCaseApiData(null);
    try {
      const response = await fetch('https://apis.akshit.net/eciapi/17/district-court/case');
      const data = await response.json();
      setSelectedCaseApiData(data);
    } catch (error) {
      console.error("Error fetching case details:", error);
    } finally {
      setIsCaseApiLoading(false);
    }
  };

  
  
  // Group maxims by first letter for the document-style UI
  const groupedMaxims = PROVIDED_MAXIMS.reduce((acc, maxim) => {
    const firstLetter = maxim.term.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(maxim);
    return acc;
  }, {} as Record<string, typeof PROVIDED_MAXIMS>);

  const sortedLetters = Object.keys(groupedMaxims).sort();

  const handleActSelect = (act: Act) => {
    setSelectedAct(act);
    setAcademicAnalysis(null);
    setSectionSearchQuery('');
  };

  const filteredActs = acts.filter(act => 
    act.title.toLowerCase().includes(academicSearch.toLowerCase()) || 
    act.description.toLowerCase().includes(academicSearch.toLowerCase())
  );

  
  return (
    <div className="flex h-screen font-sans bg-background text-foreground">
      <Toaster position="top-center" richColors />
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative w-full bg-background">
        
        {/* HEADER / TOP BAR */}
        <Header activeTab={activeTab} setIsMobileMenuOpen={setIsMobileMenuOpen} />

        {/* DYNAMIC CONTENT */}
        <div className={`flex-1 overflow-y-auto p-4 md:p-8 relative ${showDisclaimer ? 'pb-32 md:pb-24' : ''}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="repository" element={<Repository 
              repoSearch={repoSearch}
              setRepoSearch={setRepoSearch}
              caseResult={caseResult}
              isRepoLoading={isRepoLoading}
              handleCaseSearch={handleCaseSearch}
              EXAMPLE_CASES={EXAMPLE_CASES}
              handleExampleClick={handleExampleClick}
            />} />
            <Route path="academic" element={<Academic 
              selectedAct={selectedAct}
              setSelectedAct={setSelectedAct}
              academicSearch={academicSearch}
              setAcademicSearch={setAcademicSearch}
              filteredActs={filteredActs}
              handleActSelect={handleActSelect}
              sectionSearchQuery={sectionSearchQuery}
              setSectionSearchQuery={setSectionSearchQuery}
              handleAcademicAnalysis={handleAcademicAnalysis}
              isAcademicLoading={isAcademicLoading}
              academicAnalysis={academicAnalysis}
            />} />
            <Route path="moot" element={<MootCourt 
              mootSide={mootSide}
              setMootSide={setMootSide}
              mootArgument={mootArgument}
              setMootArgument={setMootArgument}
              handleMootAnalysis={handleMootAnalysis}
              isMootLoading={isMootLoading}
              mootAnalysis={mootAnalysis}
            />} />
            <Route path="bridge" element={<StatutoryBridge 
              bridgeConversionType={bridgeConversionType}
              setBridgeConversionType={setBridgeConversionType}
              bridgeSection={bridgeSection}
              setBridgeSection={setBridgeSection}
              handleBridgeConversion={handleBridgeConversion}
              isBridgeLoading={isBridgeLoading}
              bridgeResult={bridgeResult}
            />} />
            <Route path="maxims" element={<Maxims 
              maximSearch={maximSearch}
              setMaximSearch={setMaximSearch}
              maximResult={maximResult}
              setMaximResult={setMaximResult}
              isMaximLoading={isMaximLoading}
              groupedMaxims={groupedMaxims}
              sortedLetters={sortedLetters}
            />} />
            <Route path="doctrines" element={<Doctrines 
              doctrineSearch={doctrineSearch}
              setDoctrineSearch={setDoctrineSearch}
              handleDoctrineAnalysis={handleDoctrineAnalysis}
              isDoctrineLoading={isDoctrineLoading}
              PROVIDED_DOCTRINES={PROVIDED_DOCTRINES}
              selectedDoctrine={selectedDoctrine}
              setSelectedDoctrine={setSelectedDoctrine}
              doctrineResult={doctrineResult}
              setDoctrineResult={setDoctrineResult}
            />} />
            <Route path="draft" element={<DraftDash 
              draftType={draftType}
              setDraftType={setDraftType}
              customDraftType={customDraftType}
              setCustomDraftType={setCustomDraftType}
              draftDetails={draftDetails}
              setDraftDetails={setDraftDetails}
              handleDraftGeneration={handleDraftGeneration}
              isDraftLoading={isDraftLoading}
              draftResult={draftResult}
            />} />
            <Route path="research" element={<LexalyseAI 
              chatMessages={chatMessages}
              setChatMessages={setChatMessages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleChatSubmit={handleChatSubmit}
              isAiLoading={isAiLoading}
              chatFiles={chatFiles}
              handleFileChange={handleFileChange}
              removeFile={removeFile}
              isListening={isListening}
              toggleListening={toggleListening}
              fileInputRef={fileInputRef}
              chatEndRef={chatEndRef}
            />} />
          </Routes>
        </div>
      </main>


      {/* UPGRADE MODAL */}
      <AnimatePresence>
        {selectedCaseApiData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-background/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card border border-border w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Gavel size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground leading-none">Case Details</h3>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Source: District Court API</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCaseApiData(null)}
                  className="p-2 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar bg-background">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.entries(selectedCaseApiData).map(([key, value]: [string, any]) => (
                    <div key={key} className="space-y-2">
                      <h4 className="text-[10px] uppercase tracking-widest text-foreground font-bold">{key.replace(/_/g, ' ')}</h4>
                      <div className="p-4 bg-primary/5 border border-border rounded-xl text-sm text-muted-foreground leading-relaxed">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 border-t border-border bg-secondary/30 flex justify-end">
                <button 
                  onClick={() => setSelectedCaseApiData(null)}
                  className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold transition-all"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOADING OVERLAY FOR CASE API */}
      <AnimatePresence>
        {isCaseApiLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-background/60 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-foreground font-medium animate-pulse">Fetching Case Details...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UPGRADE MODAL */}
      <AnimatePresence>
        {showDisclaimer && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-4 shadow-2xl"
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
              
              {/* Icon & Main Text */}
              <div className="flex gap-3 flex-1">
                <ShieldAlert className="text-foreground shrink-0 mt-0.5" size={20} />
                <div className="text-xs text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-bold">DISCLAIMER: NOT LEGAL ADVICE.</span> Lexalyse is an educational and research platform only. The "Simplified Law" and "AI Assistant" features are for academic purposes and do not constitute legal advice or an attorney-client relationship. Always refer to official government Gazettes for the definitive text of Bare Acts. 
                  <span className="block md:inline md:ml-2 mt-2 md:mt-0">
                    <span className="text-foreground font-bold">| LIMITATION OF LIABILITY:</span> Lexalyse shall not be held liable for any legal consequences, losses, or damages arising from the use or interpretation of the simplified content provided herein.
                  </span>
                </div>
              </div>

              {/* Institutional Use & Close */}
              <div className="flex items-center justify-between w-full md:w-auto gap-6 border-t md:border-t-0 border-border pt-3 md:pt-0">
                <div className="flex items-center gap-2">
                  <XCircle className="text-muted-foreground" size={16} />
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">INSTITUTIONAL USE</p>
                    <p className="text-[10px] text-muted-foreground">Support Tool Only.</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowDisclaimer(false)}
                  className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app/*" element={<LexalyseApp />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
