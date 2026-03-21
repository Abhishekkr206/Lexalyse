import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Gavel, Copy, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

interface MootCourtProps {
  mootSide: string;
  setMootSide: (val: string) => void;
  mootArgument: string;
  setMootArgument: (val: string) => void;
  handleMootAnalysis: () => void;
  isMootLoading: boolean;
  mootAnalysis: string | null;
}

export const MootCourt: React.FC<MootCourtProps> = ({
  mootSide,
  setMootSide,
  mootArgument,
  setMootArgument,
  handleMootAnalysis,
  isMootLoading,
  mootAnalysis
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-serif flex items-center gap-4 text-foreground">
          <Scale className="text-primary" size={36} /> Advanced Arguments
        </h2>
        <p className="text-muted-foreground mt-3 max-w-2xl text-lg leading-relaxed">
          Advanced AI-powered argumentation partner. Input your legal arguments to find loopholes, precedents, and strategic improvements.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 min-h-0">
        {/* Left Panel - Input */}
        <div className="lg:col-span-4 flex flex-col space-y-8">
          {/* Side Selector */}
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 block">Select Your Side</label>
            <div className="flex bg-secondary p-1.5 rounded-2xl border border-border">
              <button
                onClick={() => setMootSide('petitioner')}
                className={cn(
                  "flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
                  mootSide === 'petitioner' 
                    ? "bg-primary text-primary-foreground shadow-lg" 
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                Petitioner
              </button>
              <button
                onClick={() => setMootSide('respondent')}
                className={cn(
                  "flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
                  mootSide === 'respondent' 
                    ? "bg-primary text-primary-foreground shadow-lg" 
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                Respondent
              </button>
            </div>
          </div>

          {/* Argument Input */}
          <div className="flex-1 flex flex-col min-h-[300px]">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 block">Your Argument</label>
            <textarea
              className="flex-1 w-full bg-card border border-border rounded-3xl p-6 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none placeholder:text-muted-foreground/30 font-mono leading-relaxed shadow-inner"
              placeholder="Enter your legal argument here. Be detailed about the facts and legal grounds..."
              value={mootArgument}
              onChange={(e) => setMootArgument(e.target.value)}
            />
          </div>

          {/* Action Button */}
          <button 
            onClick={handleMootAnalysis}
            disabled={isMootLoading || !mootArgument.trim()}
            className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-bold tracking-[0.2em] uppercase shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMootLoading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Gavel size={20} /> Analyze Argument</>
            )}
          </button>

          {/* Disclaimer */}
          <div className="bg-secondary/50 border border-border rounded-2xl p-5 flex gap-4 items-start">
            <AlertTriangle className="text-primary shrink-0" size={18} />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-bold text-foreground">Disclaimer:</span> This is an AI-generated response for educational and simulation purposes only. It is <span className="text-primary font-bold">not binding</span> and does not constitute professional legal advice. Always verify citations and consult a qualified attorney.
            </p>
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className="lg:col-span-8 bg-card border border-border rounded-[2.5rem] flex flex-col p-10 overflow-y-auto shadow-2xl relative">
          {mootAnalysis ? (
            <div className="w-full h-full text-left">
              <div className="flex items-center justify-between gap-3 mb-8">
                <div className="flex items-center gap-3 text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                  <Scale size={18} /> Judicial Analysis
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(mootAnalysis);
                    toast.success("Analysis copied to clipboard");
                  }}
                  className="p-2 hover:bg-secondary rounded-xl transition-all text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
                  title="Copy analysis"
                >
                  <Copy size={16} />
                </button>
              </div>
              <div className="prose prose-invert max-w-none text-foreground leading-relaxed">
                <ReactMarkdown>{mootAnalysis}</ReactMarkdown>
                {isMootLoading && <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />}
              </div>
            </div>
          ) : isMootLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <Scale className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={24} />
              </div>
              <p className="text-muted-foreground font-medium tracking-wide">The Senior Advocate is reviewing your argument...</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-32 h-32 bg-secondary rounded-full flex items-center justify-center mb-8 shadow-inner border border-border relative">
                 <Scale size={56} className="text-muted-foreground/30" />
                 <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full" />
              </div>
              <h3 className="text-2xl font-serif text-muted-foreground mb-3">Ready to judge your case</h3>
              <p className="text-sm text-muted-foreground/60 max-w-xs">Enter your argument on the left to begin the judicial analysis</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
