import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, Bot, Copy, FileText, X, Paperclip, Mic, Send, ShieldAlert } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { ChatMessage } from '../../types';

interface LexalyseAIProps {
  chatMessages: ChatMessage[];
  setChatMessages: (val: ChatMessage[]) => void;
  chatInput: string;
  setChatInput: (val: string) => void;
  handleChatSubmit: () => void;
  isAiLoading: boolean;
  chatFiles: any[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  isListening: boolean;
  toggleListening: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

export const LexalyseAI: React.FC<LexalyseAIProps> = ({
  chatMessages,
  setChatMessages,
  chatInput,
  setChatInput,
  handleChatSubmit,
  isAiLoading,
  chatFiles,
  handleFileChange,
  removeFile,
  isListening,
  toggleListening,
  fileInputRef,
  chatEndRef
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col relative w-full overflow-hidden bg-background"
    >
      {/* Modern Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          {chatMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
              >
                <Sparkles size={12} className="text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Lexalyse AI</span>
              </motion.div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 shadow-2xl"
              >
                <Sparkles size={40} className="text-primary" />
              </motion.div>
              <div className="space-y-4">
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-4xl md:text-5xl font-bold tracking-tight"
                >
                  How can I help you today?
                </motion.h2>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed"
                >
                  Experience the next generation of legal research. 
                  Ask about case laws, statutes, or upload documents for instant analysis.
                </motion.p>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl"
              >
                {[
                  "Analyze the Doctrine of Pith and Substance",
                  "Summarize the Kesavananda Bharati case",
                  "Draft a legal notice for breach of contract",
                  "Compare IPC Section 302 with BNS Section 101"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setChatInput(suggestion)}
                    className="text-left p-4 rounded-2xl bg-secondary/50 border border-border hover:bg-secondary hover:border-primary/30 transition-all text-sm group"
                  >
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">{suggestion}</span>
                  </button>
                ))}
              </motion.div>
            </div>
          )}

          {chatMessages.length > 0 && (
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => {
                  setChatMessages([]);
                  toast.info("Chat cleared");
                }}
                className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-destructive/10"
              >
                <X size={12} /> Clear Conversation
              </button>
            </div>
          )}

          {chatMessages.map((msg, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex w-full gap-4",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm",
                msg.role === 'user' ? "bg-secondary border-border" : "bg-primary border-primary"
              )}>
                {msg.role === 'user' ? <Users size={14} /> : <Bot size={14} className="text-primary-foreground" />}
              </div>
              
              <div className={cn(
                "flex flex-col space-y-2 max-w-[85%]",
                msg.role === 'user' ? "items-end" : "items-start"
              )}>
                <div className={cn(
                  "rounded-2xl px-5 py-3.5 shadow-sm relative group/msg",
                  msg.role === 'user' 
                    ? "bg-secondary text-foreground rounded-tr-none" 
                    : "bg-muted/50 border border-border text-foreground rounded-tl-none"
                )}>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(msg.text);
                      toast.success("Copied to clipboard");
                    }}
                    className={cn(
                      "absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm border border-border rounded-xl opacity-0 group-hover/msg:opacity-100 transition-all hover:bg-secondary hover:scale-110 active:scale-95 shadow-lg z-30",
                      msg.role === 'user' ? "hidden" : ""
                    )}
                    title="Copy message"
                  >
                    <Copy size={14} className="text-muted-foreground" />
                  </button>

                  {msg.role === 'model' && (
                    <div className="flex items-center gap-2 mb-2 text-primary text-[10px] font-bold uppercase tracking-widest">
                      <Sparkles size={10} /> Lexalyse AI
                    </div>
                  )}
                  
                  {msg.files && msg.files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {msg.files.map((file: any, fIdx: number) => (
                        <div key={fIdx} className="rounded-xl overflow-hidden border border-border bg-background/50">
                          {file.mimeType.startsWith('image/') ? (
                            <img 
                              src={file.data} 
                              alt={file.name} 
                              className="max-w-[240px] max-h-[240px] object-contain"
                            />
                          ) : (
                            <div className="flex items-center gap-3 p-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <FileText size={16} className="text-primary" />
                              </div>
                              <span className="text-xs font-medium">{file.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.role === 'model' ? (
                    <div className="prose prose-invert prose-sm md:prose-base max-w-none leading-relaxed">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                      {isAiLoading && idx === chatMessages.length - 1 && (
                        <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />
                      )}
                    </div>
                  ) : (
                    <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">{msg.text}</p>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground px-1">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
          
          {isAiLoading && chatMessages[chatMessages.length - 1]?.role === 'user' && (
            <div className="flex justify-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary border border-primary flex items-center justify-center shrink-0">
                <Bot size={14} className="text-primary-foreground" />
              </div>
              <div className="bg-muted/50 border border-border rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Modern Input Area */}
      <div className="p-2 md:p-4 z-20">
        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence>
            {chatFiles.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-0 right-0 mb-4 flex flex-wrap gap-3 p-4 bg-background/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl"
              >
                {chatFiles.map((file, idx) => (
                  <div key={idx} className="relative group">
                    {file.mimeType.startsWith('image/') ? (
                      <img 
                        src={file.data} 
                        alt={file.name} 
                        className="w-20 h-20 object-cover rounded-xl border border-border shadow-sm"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-secondary rounded-xl border border-border flex flex-col items-center justify-center p-2 text-center">
                        <FileText size={24} className="text-primary mb-1" />
                        <span className="text-[10px] text-muted-foreground truncate w-full">{file.name}</span>
                      </div>
                    )}
                    <button 
                      onClick={() => removeFile(idx)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-secondary/80 backdrop-blur-2xl border border-border rounded-[20px] p-1.5 shadow-2xl transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30">
            <div className="flex items-end gap-2 px-2">
              <div className="flex items-center gap-1 pb-1">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-9 h-9 text-muted-foreground hover:text-foreground hover:bg-background rounded-full flex items-center justify-center transition-all shrink-0"
                  title="Upload documents"
                >
                  <Paperclip size={18} />
                </button>
                <button 
                  onClick={toggleListening}
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0",
                    isListening ? "bg-destructive text-destructive-foreground animate-pulse" : "text-muted-foreground hover:text-foreground hover:bg-background"
                  )}
                  title={isListening ? "Stop listening" : "Voice input"}
                >
                  <Mic size={18} />
                </button>
              </div>
              
              <textarea 
                rows={1}
                placeholder="Ask Lexalyse AI anything..." 
                className="flex-1 bg-transparent border-none text-foreground px-2 py-2.5 focus:outline-none placeholder:text-muted-foreground resize-none text-sm md:text-base min-h-[44px] max-h-40 custom-scrollbar"
                value={chatInput}
                onChange={(e) => {
                  setChatInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSubmit();
                  }
                }}
              />
              
              <div className="pb-1">
                <button 
                  onClick={handleChatSubmit}
                  disabled={(!chatInput.trim() && chatFiles.length === 0) || isAiLoading}
                  className="w-9 h-9 bg-primary text-primary-foreground hover:opacity-90 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-3 gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
            <ShieldAlert size={10} />
            <span>AI can make mistakes. Verify legal citations.</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
