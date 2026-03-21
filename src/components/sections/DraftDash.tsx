import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Bot, Sparkles, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

interface DraftDashProps {
  draftType: string;
  setDraftType: (val: string) => void;
  customDraftType: string;
  setCustomDraftType: (val: string) => void;
  draftDetails: string;
  setDraftDetails: (val: string) => void;
  handleDraftGeneration: () => void;
  isDraftLoading: boolean;
  draftResult: string | null;
}

export const DraftDash: React.FC<DraftDashProps> = ({
  draftType,
  setDraftType,
  customDraftType,
  setCustomDraftType,
  draftDetails,
  setDraftDetails,
  handleDraftGeneration,
  isDraftLoading,
  draftResult
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto py-16 px-6 w-full"
    >
      <div className="text-center mb-20">
        <h2 className="text-6xl font-serif font-bold mb-6 text-foreground tracking-tighter">Lexalyse DraftDash</h2>
        <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-8" />
        <p className="text-muted-foreground max-w-2xl mx-auto text-xl leading-relaxed font-light">
          Professional legal drafting at your fingertips. Generate high-quality legal notices, agreements, and petitions in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Configuration Panel */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8 flex items-center gap-3">
              <FileText size={18} className="text-primary" /> Document Type
            </h3>
            <div className="space-y-3">
              {['Legal Notice', 'Rent Agreement', 'Employment Contract', 'Will / Testament', 'Power of Attorney', 'Partnership Deed', 'Non-Disclosure Agreement (NDA)', 'Consumer Complaint', 'Other / Custom'].map((type) => (
                <button
                  key={type}
                  onClick={() => setDraftType(type)}
                  className={cn(
                    "w-full text-left px-5 py-4 rounded-2xl transition-all text-sm font-medium border",
                    draftType === type 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 border-primary" 
                      : "bg-secondary/50 text-muted-foreground border-transparent hover:border-border hover:text-foreground"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>

            {draftType === 'Other / Custom' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6"
              >
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 block">Specify Document Type</label>
                <input 
                  type="text"
                  placeholder="e.g., Writ Petition, Bail Application..."
                  className="w-full bg-secondary/50 border border-border rounded-xl px-5 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  value={customDraftType}
                  onChange={(e) => setCustomDraftType(e.target.value)}
                />
              </motion.div>
            )}
          </div>

          <div className="bg-secondary/30 border border-border p-8 rounded-[2.5rem] relative overflow-hidden">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-3">
              <Plus size={18} className="text-primary" /> Quick Tips
            </h3>
            <ul className="text-xs text-muted-foreground space-y-4 leading-relaxed">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                Be specific about party names and addresses.
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                Mention the core dispute or terms clearly.
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                Include dates and monetary amounts if applicable.
              </li>
            </ul>
          </div>
        </div>

        {/* Input & Output Panel */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-card border border-border p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8 flex items-center gap-3">
              <Bot size={18} className="text-primary" /> Drafting Instructions
            </h3>
            <textarea
              placeholder={`Provide details for your ${draftType}... (e.g., "Draft a legal notice for non-payment of rent for 3 months by tenant Mr. X residing at...")`}
              className="w-full h-48 bg-secondary/30 border border-border rounded-[2rem] p-8 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none mb-8 placeholder:text-muted-foreground/30 font-serif text-lg leading-relaxed shadow-inner"
              value={draftDetails}
              onChange={(e) => setDraftDetails(e.target.value)}
            />
            <button
              onClick={handleDraftGeneration}
              disabled={isDraftLoading || !draftDetails.trim()}
              className="w-full py-6 bg-primary text-primary-foreground rounded-[2rem] font-bold tracking-[0.2em] uppercase shadow-xl shadow-primary/20 flex items-center justify-center gap-4 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isDraftLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Generating Draft...
                </>
              ) : (
                <>
                  <Sparkles size={24} /> Generate Professional Draft
                </>
              )}
            </button>
          </div>

          <AnimatePresence>
            {draftResult && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-[3rem] overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,0.2)] relative"
              >
                <div className="p-8 border-b border-border flex items-center justify-between bg-secondary/30">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                      <FileText size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-foreground leading-none">Generated {draftType === 'Other / Custom' ? customDraftType : draftType}</h3>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mt-2">Lexalyse Professional Draft</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(draftResult);
                        toast.success("Draft copied to clipboard");
                      }}
                      className="px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-2xl text-foreground transition-all flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] border border-border"
                    >
                      <Copy size={16} /> Copy Text
                    </button>
                  </div>
                </div>
                <div className="p-12 max-h-[800px] overflow-y-auto custom-scrollbar bg-card/50">
                  <div className="prose prose-invert max-w-none text-foreground leading-relaxed font-serif text-lg">
                    <ReactMarkdown>{draftResult}</ReactMarkdown>
                    {isDraftLoading && <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />}
                  </div>
                </div>
                <div className="p-8 bg-secondary/30 border-t border-border">
                  <p className="text-[10px] text-muted-foreground text-center uppercase tracking-[0.3em] font-bold">
                    End of Document • Generated by Lexalyse DraftDash
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
