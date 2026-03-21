import React from 'react';
import { cn } from '../../lib/utils';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10" 
        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
    )}
  >
    <div className={cn(
      "transition-transform duration-200 group-hover:scale-110",
      active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
    )}>
      {icon}
    </div>
    <span className="text-sm font-medium">{label}</span>
  </button>
);
