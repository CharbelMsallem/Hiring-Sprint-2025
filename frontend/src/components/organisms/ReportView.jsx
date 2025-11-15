import React, { useState, useRef } from 'react';
import { FileText, CheckCircle, Eye, EyeOff, ArrowLeft, Download, Printer, Share2, FileJson } from 'lucide-react';
import { StatCard } from '../atoms/StatCard';
import { DamageCard } from '../molecules/DamageCard';
import { AnnotatedImage } from '../molecules/AnnotatedImage';
import { Button } from '../atoms/Button';

export const ReportView = ({ results, pickupPreview, returnPreview, onBackToDashboard }) => {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const reportRef = useRef(null);

  const downloadPDF = () => {
    // Use browser's print dialog to save as PDF
    window.print();
  };

  const downloadJSON = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `vehicle-damage-data-${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  const shareReport = async () => {
    const shareText = `Vehicle Damage Report: ${results.new_damages?.length || 0} new damage(s) found. Estimated cost: $${results.estimated_cost || 0}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vehicle Damage Report',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          copyToClipboard(shareText);
        }
      }
    } else {
      // Fallback: copy to clipboard
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Report details copied to clipboard!');
      }).catch(() => {
        alert('Failed to copy to clipboard');
      });
    } else {
      alert('Clipboard not supported');
    }
  };

  return (
    <div ref={reportRef} className="space-y-6 md:space-y-8">
      {/* Action Buttons Bar */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          {/* Left side - Back button */}
          <Button
            onClick={onBackToDashboard}
            variant="tab"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Button>

          {/* Right side - Action buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={downloadPDF}
              variant="tab"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">PDF</span>
            </Button>

            <Button
              onClick={downloadJSON}
              variant="tab"
              className="flex items-center gap-2"
            >
              <FileJson className="w-4 h-4" />
              <span className="hidden md:inline">Export Data</span>
            </Button>

            <Button
              onClick={printReport}
              variant="tab"
              className="flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden md:inline">Print</span>
            </Button>

            <Button
              onClick={shareReport}
              variant="tab"
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden md:inline">Share</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Toggle Annotations Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAnnotations(!showAnnotations)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-lg text-blue-300 font-semibold transition-all duration-200"
        >
          {showAnnotations ? (
            <>
              <EyeOff className="w-5 h-5" />
              Hide Damage Markers
            </>
          ) : (
            <>
              <Eye className="w-5 h-5" />
              Show Damage Markers
            </>
          )}
        </button>
      </div>

      {/* Image Comparison */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-slate-700">
          <h3 className="text-lg md:text-xl font-bold text-white mb-4">Pickup Condition</h3>
          {showAnnotations && results.pickup_damages?.length > 0 ? (
            <AnnotatedImage 
              imageSrc={pickupPreview}
              detections={results.pickup_damages}
              showLabels={true}
            />
          ) : (
            <img src={pickupPreview} alt="Pickup" className="w-full rounded-lg" />
          )}
          <div className="mt-4">
            <p className="text-slate-300">
              Detected Issues: <span className="font-bold text-green-400">{results.pickup_damages?.length || 0}</span>
            </p>
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-slate-700">
          <h3 className="text-lg md:text-xl font-bold text-white mb-4">Return Condition</h3>
          {showAnnotations && results.return_damages?.length > 0 ? (
            <AnnotatedImage 
              imageSrc={returnPreview}
              detections={results.return_damages}
              showLabels={true}
            />
          ) : (
            <img src={returnPreview} alt="Return" className="w-full rounded-lg" />
          )}
          <div className="mt-4">
            <p className="text-slate-300">
              Detected Issues: <span className="font-bold text-orange-400">{results.return_damages?.length || 0}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Damage Assessment Report */}
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

      {/* Report Footer */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 text-center text-sm text-slate-400 print:block">
        Report generated on {new Date().toLocaleString()} | AutoInspect.AI - AI-Powered Vehicle Inspection
      </div>
    </div>
  );
};