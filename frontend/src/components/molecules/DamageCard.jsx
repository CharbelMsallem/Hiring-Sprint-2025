import React from 'react';

export const DamageCard = ({ damage }) => {
  // Map severity levels to display values
  const getSeverityColor = (severity) => {
    if (severity === 'high') return 'bg-red-500/20 text-red-400';
    if (severity === 'medium') return 'bg-orange-500/20 text-orange-400';
    if (severity === 'low') return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="bg-slate-800/80 rounded-xl p-4 md:p-6 border border-slate-700 hover:border-slate-600 transition-all hover:scale-[1.02]">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
        <div>
          <p className="text-lg font-bold text-white capitalize">
            {damage.type.replace(/_/g, ' ')}
          </p>
          <p className="text-slate-400 text-sm">{damage.location}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${getSeverityColor(damage.severity)}`}>
            {damage.severity.toUpperCase()}
          </span>
          {damage.confidence && (
            <span className="text-xs text-slate-400">
              {(damage.confidence * 100).toFixed(1)}% confidence
            </span>
          )}
        </div>
      </div>
      <p className="text-blue-400 font-semibold text-lg">
        Estimated Repair: ${damage.cost}
      </p>
    </div>
  );
};