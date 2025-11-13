// QUICK FRONT END CODE FOR VEHICLE DAMAGE DETECTION APP USING REACT AND TAILWIND CSS (NOT ACTUAL LAYOUT AND DESIGN PS.AI GENERATED)

import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, DollarSign } from 'lucide-react';

const API_URL = 'http://localhost:8000';

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setResults(null);
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetect = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`${API_URL}/api/detect`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Detection failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to detect damage');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      minor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      moderate: 'bg-orange-100 text-orange-800 border-orange-300',
      severe: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🚗 AI Vehicle Damage Detection
          </h1>
          <p className="text-gray-600">
            Upload vehicle images to automatically detect and assess damages
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Vehicle Image
            </h2>

            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-600 mb-2">
                  Drag and drop an image or click to browse
                </p>
                <p className="text-sm text-gray-400">
                  Supports: JPG, PNG, WEBP
                </p>
              </label>
            </div>

            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full rounded-lg shadow-md"
                />
                <button
                  onClick={handleDetect}
                  disabled={loading}
                  className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Detecting...' : 'Detect Damage'}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Detection Results</h2>

            {!results && (
              <div className="text-center py-12 text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>Upload and analyze an image to see results</p>
              </div>
            )}

            {results && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-blue-600 font-medium">Total Damages</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {results.summary.total_damages}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Est. Cost
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      ${results.summary.estimated_cost_usd}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Detected Damages:</h3>
                  <div className="space-y-2">
                    {results.detections.map((detection, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${getSeverityColor(detection.severity)}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold capitalize">
                            {detection.label.replace('_', ' ')}
                          </span>
                          <span className="text-xs font-medium">
                            {(detection.confidence * 100).toFixed(0)}% confident
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="capitalize">Severity: {detection.severity}</span>
                          <span className="text-xs">
                            Position: [{detection.bbox.join(', ')}]
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-800 font-medium">Analysis Complete</p>
                    <p className="text-green-700 text-sm">
                      Detected {results.summary.total_damages} damage(s) with{' '}
                      {(results.summary.average_confidence * 100).toFixed(0)}% avg confidence
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by AI • Built for Aspire Hiring Sprint</p>
        </div>
      </div>
    </div>
  );
}