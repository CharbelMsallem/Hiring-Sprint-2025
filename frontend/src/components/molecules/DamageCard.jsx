import React from 'react';

export const DamageCard = ({ damage }) => (
  <div className="bg-slate-800/80 rounded-xl p-4 md:p-6 border border-slate-700 hover:border-slate-600 transition-all hover:scale-[1.02]">
    <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
      <div>
        <p className="text-lg font-bold text-white">{damage.type}</p>
        <p className="text-slate-400 text-sm">{damage.location}</p>
      </div>
      <span className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
        damage.severity > 7 ? 'bg-red-500/20 text-red-400' :
        damage.severity > 4 ? 'bg-orange-500/20 text-orange-400' :
        'bg-yellow-500/20 text-yellow-400'
      }`}>
        Severity: {damage.severity}/10
      </span>
    </div>
    <p className="text-slate-300 mb-2">{damage.description}</p>
    <p className="text-blue-400 font-semibold">Estimated Repair: ${damage.cost}</p>
  </div>
);