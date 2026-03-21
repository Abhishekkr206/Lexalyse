import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowLeftRight, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

interface StatutoryBridgeProps {
  bridgeConversionType: string;
  setBridgeConversionType: (val: string) => void;
  bridgeSection: string;
  setBridgeSection: (val: string) => void;
  handleBridgeConversion: () => void;
  isBridgeLoading: boolean;
  bridgeResult: string | null;
}

export const StatutoryBridge: React.FC<StatutoryBridgeProps> = ({
  bridgeConversionType,
  setBridgeConversionType,
  bridgeSection,
  setBridgeSection,
  handleBridgeConversion,
  isBridgeLoading,
  bridgeResult
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto py-12"
    >
      <div className="text-center mb-16">
        <h2 className="text-5xl font-serif font-bold mb-6 text-foreground">Statutory Bridge</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
          Transition seamlessly between old and new criminal laws. Instantly map sections from IPC to BNS, CrPC to BNSS, and IEA to BSA.
        </p>
      </div>

      <div className="bg-card rounded-[2.5rem] shadow-2xl overflow-hidden mb-12 border border-border">
        <div className="p-10 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            
            {/* Conversion Type */}
            <div className="md:col-span-5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3 block">Conversion Type</label>
              <div className="relative group">
                <select 
                  value={bridgeConversionType}
                  onChange={(e) => setBridgeConversionType(e.target.value)}
                  className="w-full bg-secondary text-foreground border border-border rounded-2xl px-5 py-4 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer"
                >
                  <option>IPC → BNS (Penal Code)</option>
                  <option>BNS → IPC (Penal Code)</option>
                  <option>CrPC → BNSS (Procedure)</option>
                  <option>BNSS → CrPC (Procedure)</option>
                  <option>IEA → BSA (Evidence)</option>
                  <option>BSA → IEA (Evidence)</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none transition-transform group-hover:translate-y-[-40%]" size={18} />
              </div>
            </div>

            {/* Section Number */}
            <div className="md:col-span-4">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3 block">Section Number</label>
              <input 
                type="text" 
                placeholder="e.g., 302" 
                value={bridgeSection}
                onChange={(e) => setBridgeSection(e.target.value)}
                className="w-full bg-secondary text-foreground border border-border rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder-muted-foreground/50 transition-all"
              />
            </div>

            {/* Convert Button */}
            <div className="md:col-span-3">
              <button 
                onClick={handleBridgeConversion}
                disabled={isBridgeLoading || !bridgeSection.trim()}
                className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-2xl text-xs font-bold tracking-[0.2em] uppercase transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                {isBridgeLoading ? 'Converting...' : 'Convert'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Result Placeholder */}
      <div className="bg-card border-border rounded-[2.5rem] border p-12 text-center min-h-[300px] flex flex-col items-center justify-center shadow-2xl transition-colors relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />
        {bridgeResult ? (
          <div className="w-full text-left relative z-10">
            <div className="flex items-center justify-between gap-3 mb-8">
              <div className="flex items-center gap-3 text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                <ArrowLeftRight size={18} /> Conversion Result
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(bridgeResult);
                  toast.success("Result copied to clipboard");
                }}
                className="p-2 hover:bg-secondary rounded-xl transition-all text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
                title="Copy result"
              >
                <Copy size={16} />
              </button>
            </div>
            <div className="prose prose-invert max-w-none text-foreground leading-relaxed">
              <ReactMarkdown>{bridgeResult}</ReactMarkdown>
              {isBridgeLoading && <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />}
            </div>
          </div>
        ) : (
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 bg-secondary border border-border shadow-inner mx-auto">
              <ArrowLeftRight className="text-muted-foreground/30" size={32} />
            </div>
            <p className="text-xl text-muted-foreground font-light">Enter a section number to see the mapping.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
