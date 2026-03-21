import React from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Users, Calendar, Copy, AlertTriangle, ArrowLeftRight, Gavel, CheckCircle, ShieldAlert, Scale, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { CaseAnalysis } from '../../types';

interface RepositoryProps {
  repoSearch: string;
  setRepoSearch: (val: string) => void;
  caseResult: CaseAnalysis | null;
  isRepoLoading: boolean;
  handleCaseSearch: () => void;
  EXAMPLE_CASES: CaseAnalysis[];
  handleExampleClick: (example: CaseAnalysis) => void;
}

export const Repository: React.FC<RepositoryProps> = ({
  repoSearch,
  setRepoSearch,
  caseResult,
  isRepoLoading,
  handleCaseSearch,
  EXAMPLE_CASES,
  handleExampleClick
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-6xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-4xl font-serif text-foreground mb-2">Precedent Repository</h2>
        <p className="text-muted-foreground">Search judgements by case name, citation or topic...</p>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input 
          type="text" 
          placeholder="Search judgements (e.g., Kesavananda Bharati, Basic Structure)..." 
          className="w-full pl-12 pr-32 py-5 bg-card border border-border rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-muted-foreground/50 transition-all shadow-lg relative z-10"
          value={repoSearch}
          onChange={(e) => setRepoSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCaseSearch()}
        />
        <button 
          onClick={handleCaseSearch}
          disabled={isRepoLoading || !repoSearch.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold tracking-widest uppercase transition-all hover:scale-105 active:scale-95 disabled:opacity-50 z-20"
        >
          {isRepoLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Result Card */}
      {caseResult ? (
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header */}
          <div className="bg-secondary/30 p-8 border-b border-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-8 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2.5">
                <FileText size={14} /> {caseResult.citation}
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} /> {caseResult.bench}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} /> {caseResult.year}
              </div>
            </div>
            <div className="text-muted-foreground text-xs">{caseResult.year}</div>
          </div>

          {/* Title & Tags */}
          <div className="p-8 border-b border-border flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-serif text-foreground mb-4">{caseResult.caseName}</h1>
              <div className="flex flex-wrap gap-2">
                {caseResult.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-secondary text-muted-foreground text-xs rounded-full border border-border">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button 
              onClick={() => {
                const text = `Case Name: ${caseResult.caseName}\nYear: ${caseResult.year}\nFacts: ${caseResult.facts}\nCore Issues: ${caseResult.coreIssues}\nArguments: ${caseResult.arguments}\nJudgement: ${caseResult.judgement}\nHolding: ${caseResult.holding}\nStatus: ${caseResult.status}\nRatio Decidendi: ${caseResult.ratioDecidendi}`;
                navigator.clipboard.writeText(text);
                toast.success("Case summary copied");
              }}
              className="p-3 hover:bg-secondary rounded-2xl text-muted-foreground hover:text-foreground transition-all border border-transparent hover:border-border"
              title="Copy case summary"
            >
              <Copy size={20} />
            </button>
          </div>

          {/* Content Columns - 4 Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Facts */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4 text-amber-600 text-xs font-bold uppercase tracking-widest">
                <FileText size={14} /> Facts
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {caseResult.facts}
              </p>
              
              <div className="flex items-center gap-2 mb-2 text-foreground text-xs font-bold uppercase tracking-widest">
                <AlertTriangle size={14} /> Core Issues
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {caseResult.coreIssues}
              </p>
            </div>

            {/* Arguments & Judgement */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4 text-amber-600 text-xs font-bold uppercase tracking-widest">
                <ArrowLeftRight size={14} /> Arguments
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {caseResult.arguments}
              </p>

              <div className="flex items-center gap-2 mb-4 text-foreground text-xs font-bold uppercase tracking-widest">
                <Gavel size={14} /> Judgement
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {caseResult.judgement}
              </p>
            </div>

            {/* Holding & Status */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4 text-foreground text-xs font-bold uppercase tracking-widest">
                <CheckCircle size={14} /> Holding
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {caseResult.holding}
              </p>
              
              <div className="flex items-center gap-2 mb-4 text-foreground text-xs font-bold uppercase tracking-widest">
                <ShieldAlert size={14} /> Status
              </div>
              <p className={`text-sm font-bold ${caseResult.status === 'Overruled' ? 'text-red-600' : 'text-green-600'}`}>
                {caseResult.status}
              </p>
            </div>

            {/* Ratio Decidendi & Sources */}
            <div className="p-6 bg-secondary/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 text-foreground text-xs font-bold uppercase tracking-widest">
                  <Scale size={14} /> Ratio Decidendi
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed italic mb-6">
                  "{caseResult.ratioDecidendi}"
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Example Cases Grid */
        !isRepoLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXAMPLE_CASES.map((example, idx) => (
              <div 
                key={idx}
                onClick={() => handleExampleClick(example)}
                className="bg-card border border-border rounded-xl p-6 cursor-pointer hover:border-primary/30 hover:bg-secondary transition-all group shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">{example.year}</span>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="text-lg font-serif text-foreground mb-2 group-hover:text-primary transition-colors">{example.caseName}</h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{example.holding}</p>
                <div className="flex flex-wrap gap-2">
                  {example.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 bg-muted text-muted-foreground rounded border border-border">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {!caseResult && !isRepoLoading && (
        <div className="text-center py-10 text-gray-600">
          <p className="text-sm">Select an example above or search for any other judgement.</p>
        </div>
      )}
    </motion.div>
  );
};
