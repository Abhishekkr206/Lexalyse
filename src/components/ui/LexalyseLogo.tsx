import React from 'react';

export const LexalyseLogo = () => (
  <div className="relative w-10 h-10 flex items-center justify-center">
    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
    <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
      <path d="M50 5L15 20V45C15 70 50 95 50 95C50 95 85 70 85 45V20L50 5Z" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="text-primary"/>
      <path d="M50 25V75" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-primary"/>
      <path d="M30 40V60" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-primary/60"/>
      <path d="M70 40V60" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-primary/60"/>
    </svg>
  </div>
);
