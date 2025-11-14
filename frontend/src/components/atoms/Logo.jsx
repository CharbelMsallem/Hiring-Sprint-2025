import React from 'react';
import { Shield } from 'lucide-react';

export const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="relative">
      <Shield className="w-10 h-10 text-blue-400" />
      <div className="absolute inset-0 bg-blue-400 blur-xl opacity-50" />
    </div>
    <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
      AutoInspect
    </span>
  </div>
);