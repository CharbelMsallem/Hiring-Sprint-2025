import React from 'react';
import { Logo } from '../atoms/Logo';

export const Header = () => (
  <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo />
        <p className="text-slate-300 text-sm md:text-base text-center sm:text-right">
          AI-Powered Vehicle Inspection
        </p>
      </div>
    </div>
  </header>
);