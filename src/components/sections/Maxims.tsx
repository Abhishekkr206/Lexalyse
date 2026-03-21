import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Copy, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

interface MaximsProps {
  maximSearch: string;
  setMaximSearch: (val: string) => void;
  maximResult: string | null;
  setMaximResult: (val: string | null) => void;
  isMaximLoading: boolean;
  groupedMaxims: Record<string, any[]>;
  sortedLetters: string[];
}

export const Maxims: React.FC<MaximsProps> = ({
  maximSearch,
  setMaximSearch,
  maximResult,
  setMaximResult,
  isMaximLoading,
  groupedMaxims,
  sortedLetters
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto py-16 px-6"
    >
      <div className="text-center mb-20">
        <h2 className="text-6xl font-serif font-bold mb-6 text-foreground tracking-tighter">Legal Maxims</h2>
        <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-8" />
        <p className="text-muted-foreground max-w-2xl mx-auto text-xl leading-relaxed font-light">
          A comprehensive directory of fundamental Latin principles that form the bedrock of modern jurisprudence.
        </p>
      </div>

      <div className="relative mb-24 group">
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={24} />
        <input 
          type="text" 
          placeholder="Search for a maxim or definition..." 
          className="w-full pl-16 pr-6 py-6 bg-card border border-border rounded-[2rem] text-foreground text-xl focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-2xl backdrop-blur-sm transition-all relative z-10"
          value={maximSearch}
          onChange={(e) => setMaximSearch(e.target.value)}
        />
      </div>

      <div className="space-y-32 pb-20">
        {/* AI Search Result Modal */}
        <AnimatePresence>
          {maximResult && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-[2.5rem] p-10 mb-16 shadow-[0_40px_100px_rgba(0,0,0,0.1)] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[100px] rounded-full -mr-40 -mt-40" />
              <button 
                onClick={() => setMaximResult(null)}
                className="absolute top-6 right-6 p-2.5 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-all z-10"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-foreground">AI Maxim Analysis</h3>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(maximResult);
                    toast.success("Analysis copied");
                  }}
                  className="p-2.5 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-all border border-transparent hover:border-border"
                  title="Copy analysis"
                >
                  <Copy size={20} />
                </button>
              </div>

              <div className="prose prose-invert max-w-none text-foreground leading-relaxed">
                <ReactMarkdown>{maximResult}</ReactMarkdown>
                {isMaximLoading && <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {sortedLetters.map((letter) => {
          const filteredMaxims = groupedMaxims[letter].filter(m => 
            m.term.toLowerCase().includes(maximSearch.toLowerCase()) || 
            m.definition.toLowerCase().includes(maximSearch.toLowerCase())
          );

          if (filteredMaxims.length === 0) return null;

          return (
            <div key={letter} className="relative">
              {/* Letter Heading */}
              <div className="mb-12">
                <h3 className="text-5xl font-serif font-bold text-foreground inline-block border-b-8 border-primary/20 pb-2 px-2">
                  {letter}
                </h3>
              </div>
              
              {/* Maxims List */}
              <div className="space-y-12 pl-8 border-l-2 border-border">
                {filteredMaxims.map((m, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex gap-8 group"
                  >
                    <span className="text-muted-foreground/30 font-serif italic text-2xl mt-1 min-w-[40px]">{idx + 1}.</span>
                    <div className="space-y-3">
                      <h4 className="text-3xl font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                        {m.term}
                      </h4>
                      <p className="text-muted-foreground text-xl leading-relaxed italic font-light">
                        — {m.definition}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Thick separator line as seen in image under Q */}
              <div className="mt-16 h-2 bg-gradient-to-r from-white/40 via-white/10 to-transparent w-full rounded-full" />
            </div>
          );
        })}

        {maximSearch && sortedLetters.every(l => 
          groupedMaxims[l].filter(m => 
            m.term.toLowerCase().includes(maximSearch.toLowerCase()) || 
            m.definition.toLowerCase().includes(maximSearch.toLowerCase())
          ).length === 0
        ) && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 border border-border">
              <Search size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-medium text-muted-foreground">No maxims found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
