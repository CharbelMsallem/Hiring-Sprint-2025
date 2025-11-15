import React from 'react';

export const Button = ({ children, onClick, disabled, variant = 'primary', className = '' }) => {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold transition-all duration-200";
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
    secondary: "bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",
    tab: "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:scale-105",
    tabActive: "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};