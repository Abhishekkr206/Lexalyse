import React from 'react';
import { cn } from '../../lib/utils';
import { LayoutDashboard, BookOpen, FileText, ScrollText, Quote, BrainCircuit, Gavel, Plus, Sparkles } from 'lucide-react';
import { LexalyseLogo } from '../ui/LexalyseLogo';
import { NavItem } from '../ui/NavItem';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (val: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-40 w-64 bg-card text-card-foreground flex flex-col p-6 border-r border-border shadow-xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
      isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="mb-10 flex items-center gap-3">
        <LexalyseLogo />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground leading-none">Lex<span className="font-light">alyse</span></h1>
          <p className="text-[8px] uppercase tracking-widest text-muted-foreground mt-1">AI-Powered Legal Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active={currentPath === '/app'} onClick={() => { navigate('/app'); setIsMobileMenuOpen(false); }} />
        <NavItem icon={<BookOpen size={18}/>} label="Academic Section" active={currentPath === '/app/academic'} onClick={() => { navigate('/app/academic'); setIsMobileMenuOpen(false); }} />
        <NavItem icon={<FileText size={18}/>} label="Precedent Repository" active={currentPath === '/app/repository'} onClick={() => { navigate('/app/repository'); setIsMobileMenuOpen(false); }} />
        <NavItem icon={<ScrollText size={18}/>} label="Statutory Bridge" active={currentPath === '/app/bridge'} onClick={() => { navigate('/app/bridge'); setIsMobileMenuOpen(false); }} />
        <NavItem icon={<Quote size={18}/>} label="Legal Maxims" active={currentPath === '/app/maxims'} onClick={() => { navigate('/app/maxims'); setIsMobileMenuOpen(false); }} />
        <NavItem icon={<BrainCircuit size={18}/>} label="Doctrines/Principles" active={currentPath === '/app/doctrines'} onClick={() => { navigate('/app/doctrines'); setIsMobileMenuOpen(false); }} />
        <NavItem icon={<Gavel size={18}/>} label="Advanced Arguments" active={currentPath === '/app/moot'} onClick={() => { navigate('/app/moot'); setIsMobileMenuOpen(false); }} />
        <NavItem icon={<Plus size={18}/>} label="Lexalyse DraftDash" active={currentPath === '/app/draft'} onClick={() => { navigate('/app/draft'); setIsMobileMenuOpen(false); }} />
        <NavItem icon={<Sparkles size={18}/>} label="Lexalyse AI" active={currentPath === '/app/research'} onClick={() => { navigate('/app/research'); setIsMobileMenuOpen(false); }} />
      </nav>
    </aside>
  );
};
