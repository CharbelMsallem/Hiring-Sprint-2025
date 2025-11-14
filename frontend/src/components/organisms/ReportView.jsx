import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';
import { StatCard } from '../atoms/StatCard';
import { DamageCard } from '../molecules/DamageCard';

export const ReportView = ({ results, pickupPreview, returnPreview }) => (
  <div className="space-y-6 md:space-y-8">
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-slate-700">
        <h3 className="text-lg md:text-xl font-bold text-white mb-4">Pickup Condition</h3>
        <img src={pickupPreview} alt="Pickup" className="w-full rounded-lg" />
        <div className="mt-4">
          <p className="text-slate-300">Detected Issues: <span className="font-bold text-green-400">{results.pickup_damages?.length || 0}</span></p>
        </div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-slate-700">
        <h3 className="text-lg md:text-xl font-bold text-white mb-4">Return Condition</h3>
        <img src={returnPreview} alt="Return" className="w-full rounded-lg" />
        <div className="mt-4">
          <p className="text-slate-300">Detected Issues: <span className="font-bold text-orange-400">{results.return_damages?.length || 0}</span></p>
        </div>
      </div>
    </div>

    <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-slate-700">
      <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <FileText className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
        Damage Assessment Report
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <StatCard label="New Damages" value={results.new_damages?.length || 0} color="orange" />
        <StatCard label="Severity Score" value={results.severity_score?.toFixed(1) || '0.0'} color="red" />
        <StatCard label="Estimated Cost" value={`$${results.estimated_cost || '0'}`} color="blue" />
      </div>

      {results.new_damages && results.new_damages.length > 0 ? (
        <div className="space-y-4">
          <h4 className="text-lg md:text-xl font-bold text-white mb-4">Detected New Damages:</h4>
          {results.new_damages.map((damage, idx) => (
            <DamageCard key={idx} damage={damage} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 md:w-20 md:h-20 mx-auto text-green-400 mb-4" />
          <p className="text-xl md:text-2xl font-bold text-white mb-2">No New Damages Detected</p>
          <p className="text-slate-400">Vehicle returned in the same condition</p>
        </div>
      )}
    </div>
  </div>
);