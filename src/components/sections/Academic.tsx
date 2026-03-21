import React from 'react';
import { motion } from 'framer-motion';
import { Book, Search, ArrowRight, ArrowLeft, Copy, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { Act } from '../../types';

interface AcademicProps {
  selectedAct: Act | null;
  setSelectedAct: (act: Act | null) => void;
  academicSearch: string;
  setAcademicSearch: (val: string) => void;
  filteredActs: Act[];
  handleActSelect: (act: Act) => void;
  sectionSearchQuery: string;
  setSectionSearchQuery: (val: string) => void;
  handleAcademicAnalysis: () => void;
  isAcademicLoading: boolean;
  academicAnalysis: string | null;
}

export const Academic: React.FC<AcademicProps> = ({
  selectedAct,
  setSelectedAct,
  academicSearch,
  setAcademicSearch,
  filteredActs,
  handleActSelect,
  sectionSearchQuery,
  setSectionSearchQuery,
  handleAcademicAnalysis,
  isAcademicLoading,
  academicAnalysis
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="h-full flex flex-col"
    >
      {!selectedAct ? (
        // LIBRARY VIEW
        <div className="space-y-10 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-serif text-foreground mb-3">Academic Resources</h2>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">Browse our library of simplified bare acts. Each act is broken down into easy-to-understand sections with key terms and summaries.</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                {filteredActs.length} Acts Available
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Search for an Act or enter Section (e.g., Contract, IPC 302)..." 
              className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-muted-foreground/50 transition-all shadow-lg relative z-10"
              value={academicSearch}
              onChange={(e) => setAcademicSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {filteredActs.map(act => (
              <motion.div 
                key={act.id} 
                whileHover={{ y: -8 }}
                onClick={() => handleActSelect(act)}
                className="bg-card border-border p-8 rounded-3xl border shadow-sm hover:shadow-2xl hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all bg-secondary text-foreground group-hover:bg-primary group-hover:text-primary-foreground shadow-sm">
                    <Book size={24} />
                  </div>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-secondary text-muted-foreground uppercase tracking-widest">{act.year}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 transition-colors text-foreground group-hover:text-primary relative z-10">{act.title}</h3>
                <p className="text-sm text-muted-foreground mb-8 line-clamp-2 leading-relaxed relative z-10">{act.description}</p>
                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-primary group-hover:gap-3 transition-all relative z-10">
                  Explore Act <ArrowRight size={14} className="ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        // READER VIEW (Existing Split View)
        <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
          <button 
            onClick={() => setSelectedAct(null)}
            className="flex items-center text-sm text-muted-foreground mb-4 w-fit transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Library
          </button>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">{selectedAct.title} <span className="text-muted-foreground font-normal text-lg">({selectedAct.year})</span></h2>
            <div className="flex items-center space-x-2 w-1/3">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                <input 
                  type="text" 
                  placeholder={`Search ${selectedAct.title === 'Constitution' ? 'Article' : 'Section'} in ${selectedAct.title}...`}
                  className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-muted border-border text-foreground placeholder-muted-foreground"
                  value={sectionSearchQuery}
                  onChange={(e) => setSectionSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAcademicAnalysis();
                    }
                  }}
                />
              </div>
              <button 
                onClick={handleAcademicAnalysis}
                disabled={isAcademicLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isAcademicLoading ? '...' : 'Go'}
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col rounded-[2rem] overflow-hidden shadow-2xl border border-border bg-card">
            {/* SIMPLIFIED TEXT ONLY */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto transition-colors relative">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Simplified Analysis (AI)</span>
                  <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-3 py-1 rounded-full border border-destructive/20 uppercase tracking-widest">Advanced AI</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    {sectionSearchQuery ? `${selectedAct.title === 'Constitution' ? 'Art.' : 'Sec.'} ${sectionSearchQuery}` : `Select ${selectedAct.title === 'Constitution' ? 'Article' : 'Section'}`}
                  </span>
                  {academicAnalysis && (
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(academicAnalysis);
                        toast.success("Analysis copied");
                      }}
                      className="p-1.5 hover:bg-secondary rounded-lg transition-all text-muted-foreground hover:text-foreground"
                      title="Copy analysis"
                    >
                      <Copy size={14} />
                    </button>
                  )}
                </div>
              </div>
              
              {academicAnalysis ? (
                <div className="markdown-body max-w-4xl mx-auto">
                  <ReactMarkdown>{academicAnalysis}</ReactMarkdown>
                  {isAcademicLoading && <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />}
                </div>
              ) : isAcademicLoading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-muted-foreground">Analyzing {selectedAct.title === 'Constitution' ? 'article' : 'section'}...</p>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mb-8 mx-auto border border-border">
                    <Sparkles size={40} className="text-muted-foreground/30" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-4 text-foreground">What this actually means:</h3>
                  <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Enter {selectedAct.title === 'Constitution' ? 'an article' : 'a section'} number above and click "Go" to generate a simplified, student-friendly explanation using AI.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
