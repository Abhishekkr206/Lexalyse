import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setIsMobileMenuOpen: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setIsMobileMenuOpen }) => {
  return (
    <header className="h-16 border-b flex items-center justify-between px-4 md:px-8 bg-background border-border">
      <div className="flex items-center gap-4 flex-1">
        <button 
          className="lg:hidden p-2 text-muted-foreground hover:bg-secondary rounded-lg"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-primary rounded-full" />
          <h1 className="text-sm font-bold tracking-tight text-foreground uppercase flex items-center gap-2">
            {activeTab === 'dash' ? 'Dashboard' : 
             activeTab === 'academic' ? 'Academic Section' :
             activeTab === 'repository' ? 'Precedent Repository' :
             activeTab === 'bridge' ? 'Statutory Bridge' :
             activeTab === 'maxims' ? 'Legal Maxims' :
             activeTab === 'doctrines' ? 'Doctrines & Principles' :
             activeTab === 'moot' ? 'Advanced Arguments' :
             activeTab === 'draft' ? 'DraftDash' :
             activeTab === 'research' ? (
               <>
                 Lexalyse AI
                 <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded-full border border-primary/20 tracking-[0.1em]">PRO</span>
               </>
             ) : ''}
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-4 ml-4">
        <span className="hidden md:inline text-xs font-medium italic text-muted-foreground">"Ignorantia juris non excusat"</span>
        
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-foreground text-xs border border-border shrink-0">AD</div>
      </div>
    </header>
  );
};
