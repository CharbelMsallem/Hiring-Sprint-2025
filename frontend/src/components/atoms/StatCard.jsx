import React from 'react';

export const StatCard = ({ label, value, color = 'blue' }) => {
  const colors = {
    orange: 'text-orange-400',
    red: 'text-red-400',
    blue: 'text-blue-400',
    green: 'text-green-400'
  };
  
  return (
    <div className="bg-slate-800/80 rounded-xl p-4 md:p-6 border border-slate-700 hover:border-slate-600 transition-all hover:scale-105">
      <p className="text-slate-400 text-sm mb-2">{label}</p>
      <p className={`text-3xl md:text-4xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
};