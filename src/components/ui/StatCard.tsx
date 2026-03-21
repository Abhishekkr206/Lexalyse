import React from 'react';

export const StatCard = ({ title, value }: { title: string, value: string }) => (
  <div className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:border-primary/20 transition-all group">
    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest group-hover:text-primary transition-colors">{title}</p>
    <p className="text-3xl font-bold mt-2 text-foreground">{value}</p>
  </div>
);
