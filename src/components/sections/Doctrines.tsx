import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BrainCircuit, ChevronRight, Copy, X, Sparkles, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

interface DoctrinesProps {
  doctrineSearch: string;
  setDoctrineSearch: (val: string) => void;
  handleDoctrineAnalysis: (term: string) => void;
  isDoctrineLoading: boolean;
  PROVIDED_DOCTRINES: any[];
  selectedDoctrine: string | null;
  setSelectedDoctrine: (val: string | null) => void;
  doctrineResult: string | null;
  setDoctrineResult: (val: string | null) => void;
}

export const Doctrines: React.FC<DoctrinesProps> = ({
  doctrineSearch,
  setDoctrineSearch,
  handleDoctrineAnalysis,
  isDoctrineLoading,
  PROVIDED_DOCTRINES,
  selectedDoctrine,
  setSelectedDoctrine,
  doctrineResult,
  setDoctrineResult
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto py-16 px-6"
    >
      <div className="text-center mb-20">
        <h2 className="text-6xl font-serif font-bold mb-6 text-foreground tracking-tighter">Legal Doctrines</h2>
        <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-8" />
        <p className="text-muted-foreground max-w-2xl mx-auto text-xl leading-relaxed font-light">
          Explore the foundational theories and judicial interpretations that shape the legal landscape.
        </p>
      </div>

      <div className="relative mb-24 group max-w-3xl mx-auto">
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={24} />
        <input 
          type="text" 
          placeholder="Search for a doctrine..." 
          className="w-full pl-16 pr-40 py-6 bg-card border border-border rounded-[2rem] text-foreground text-xl focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-2xl backdrop-blur-sm transition-all relative z-10"
          value={doctrineSearch}
          onChange={(e) => setDoctrineSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && doctrineSearch.trim() && handleDoctrineAnalysis(doctrineSearch)}
        />
        <button 
          onClick={() => handleDoctrineAnalysis(doctrineSearch)}
          disabled={isDoctrineLoading || !doctrineSearch.trim()}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-2xl font-bold tracking-widest uppercase text-xs transition-all disabled:opacity-50 z-20 shadow-lg shadow-primary/20"
        >
          {isDoctrineLoading ? '...' : 'Analyze'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {PROVIDED_DOCTRINES.filter(d => 
          d.term.toLowerCase().includes(doctrineSearch.toLowerCase()) || 
          d.definition.toLowerCase().includes(doctrineSearch.toLowerCase())
        ).map((doctrine, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => handleDoctrineAnalysis(doctrine.term)}
            className="bg-card border border-border p-10 rounded-[2.5rem] hover:border-primary/50 transition-all group relative overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-3xl rounded-full -mr-20 -mt-20 group-hover:bg-primary/10 transition-all" />
            
            <div className="flex flex-col gap-6">
              <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-inner">
                <BrainCircuit size={28} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                  {doctrine.term}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm font-light line-clamp-3">
                  {doctrine.definition}
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex items-center text-primary text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all">
              Deep Analysis <ChevronRight size={14} className="ml-1" />
            </div>
          </motion.div>
        ))}
      </div>

      {doctrineSearch && PROVIDED_DOCTRINES.filter(d => 
        d.term.toLowerCase().includes(doctrineSearch.toLowerCase()) || 
        d.definition.toLowerCase().includes(doctrineSearch.toLowerCase())
      ).length === 0 && (
        <div className="text-center py-24">
          <div className="w-32 h-32 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8 border border-border shadow-inner relative">
            <Search size={48} className="text-muted-foreground/30" />
            <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full" />
          </div>
          <h3 className="text-3xl font-serif text-muted-foreground mb-3">No doctrines found</h3>
          <p className="text-muted-foreground/60">Try adjusting your search terms or explore our directory</p>
        </div>
      )}

      {/* Analysis Modal */}
      <AnimatePresence>
        {selectedDoctrine && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-background/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              className="bg-card border border-border w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,0.3)] flex flex-col max-h-[90vh]"
            >
              <div className="p-10 border-b border-border flex items-center justify-between bg-secondary/30">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <BrainCircuit size={28} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-serif font-bold text-foreground leading-none">{selectedDoctrine}</h3>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mt-2">Lexalyse Judicial Analysis</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {doctrineResult && (
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(doctrineResult);
                        toast.success("Analysis copied");
                      }}
                      className="p-3 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-all border border-transparent hover:border-border"
                      title="Copy analysis"
                    >
                      <Copy size={20} />
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setSelectedDoctrine(null);
                      setDoctrineResult(null);
                    }}
                    className="p-3 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-12 overflow-y-auto custom-scrollbar bg-card/50">
                {isDoctrineLoading ? (
                  <div className="flex flex-col items-center justify-center py-32 space-y-8">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={32} />
                    </div>
                    <p className="text-muted-foreground font-medium tracking-[0.2em] uppercase text-xs animate-pulse">Synthesizing Legal Theory...</p>
                  </div>
                ) : doctrineResult ? (
                  <div className="prose prose-invert max-w-none text-foreground leading-relaxed">
                    <div className="flex items-center gap-3 mb-8 text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                      <Sparkles size={18} /> Expert Opinion
                    </div>
                    <div className="text-foreground text-lg leading-relaxed">
                      <ReactMarkdown>{doctrineResult}</ReactMarkdown>
                      {isDoctrineLoading && <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />}
                    </div>
                    
                    <div className="mt-16 p-8 bg-secondary/50 border border-border rounded-3xl flex gap-6 items-start">
                      <AlertTriangle className="text-primary shrink-0 mt-1" size={24} />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <span className="font-bold text-foreground">Note:</span> This analysis is generated by Lexalyse AI for educational purposes. While we strive for 100% accuracy, legal interpretations can vary. Always consult the latest Supreme Court rulings and Bare Acts for official citations.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-24">
                    <p className="text-muted-foreground">Failed to load analysis. Please try again.</p>
                  </div>
                )}
              </div>
              
              <div className="p-10 border-t border-border bg-secondary/30 flex justify-end">
                <button 
                  onClick={() => {
                    setSelectedDoctrine(null);
                    setDoctrineResult(null);
                  }}
                  className="px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-bold tracking-widest uppercase text-xs transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Close Analysis
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
