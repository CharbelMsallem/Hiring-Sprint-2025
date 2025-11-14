import React, { useState } from 'react';
import { Upload, Camera, CheckCircle, AlertCircle, FileText } from 'lucide-react';

export default function VehicleDamageAssessment() {
  const [pickupImage, setPickupImage] = useState(null);
  const [returnImage, setReturnImage] = useState(null);
  const [pickupPreview, setPickupPreview] = useState(null);
  const [returnPreview, setReturnPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'pickup') {
          setPickupImage(file);
          setPickupPreview(reader.result);
        } else {
          setReturnImage(file);
          setReturnPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImages = async () => {
    if (!pickupImage || !returnImage) {
      alert('Please upload both pickup and return images');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('pickup_image', pickupImage);
    formData.append('return_image', returnImage);

    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setResults(data);
      setActiveTab('report');
    } catch (error) {
      console.error('Error analyzing images:', error);
      alert('Error analyzing images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="w-12 h-12 text-blue-400" />
            <h1 className="text-5xl font-bold text-white">Vehicle Damage Inspector</h1>
          </div>
          <p className="text-blue-200 text-lg">AI-Powered Condition Assessment for Rental Businesses</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'report'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            disabled={!results}
          >
            Report
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Pickup Image */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  Pickup Image
                </h2>
                <div className="space-y-4">
                  <label className="block">
                    <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-colors bg-slate-900/50">
                      {pickupPreview ? (
                        <img src={pickupPreview} alt="Pickup" className="w-full h-64 object-cover rounded-lg" />
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-16 h-16 mx-auto text-slate-400" />
                          <div>
                            <p className="text-white font-semibold">Upload Pickup Photo</p>
                            <p className="text-slate-400 text-sm mt-1">Click to browse or drag and drop</p>
                          </div>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'pickup')}
                        className="hidden"
                      />
                    </div>
                  </label>
                </div>
              </div>

              {/* Return Image */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-orange-400" />
                  Return Image
                </h2>
                <div className="space-y-4">
                  <label className="block">
                    <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-colors bg-slate-900/50">
                      {returnPreview ? (
                        <img src={returnPreview} alt="Return" className="w-full h-64 object-cover rounded-lg" />
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-16 h-16 mx-auto text-slate-400" />
                          <div>
                            <p className="text-white font-semibold">Upload Return Photo</p>
                            <p className="text-slate-400 text-sm mt-1">Click to browse or drag and drop</p>
                          </div>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'return')}
                        className="hidden"
                      />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Analyze Button */}
            <div className="flex justify-center">
              <button
                onClick={analyzeImages}
                disabled={!pickupImage || !returnImage || loading}
                className="px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing Images...
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <Camera className="w-6 h-6" />
                    Analyze Vehicle Condition
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'report' && results && (
          <div className="space-y-8">
            {/* Comparison View */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">Pickup Condition</h3>
                <img src={pickupPreview} alt="Pickup" className="w-full rounded-lg" />
                <div className="mt-4 space-y-2">
                  <p className="text-slate-300">Detected Issues: <span className="font-bold text-green-400">{results.pickup_damages?.length || 0}</span></p>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">Return Condition</h3>
                <img src={returnPreview} alt="Return" className="w-full rounded-lg" />
                <div className="mt-4 space-y-2">
                  <p className="text-slate-300">Detected Issues: <span className="font-bold text-orange-400">{results.return_damages?.length || 0}</span></p>
                </div>
              </div>
            </div>

            {/* Damage Summary */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-400" />
                Damage Assessment Report
              </h3>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-600">
                  <p className="text-slate-400 text-sm mb-2">New Damages</p>
                  <p className="text-4xl font-bold text-orange-400">{results.new_damages?.length || 0}</p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-600">
                  <p className="text-slate-400 text-sm mb-2">Severity Score</p>
                  <p className="text-4xl font-bold text-red-400">{results.severity_score?.toFixed(1) || '0.0'}</p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-600">
                  <p className="text-slate-400 text-sm mb-2">Estimated Cost</p>
                  <p className="text-4xl font-bold text-blue-400">${results.estimated_cost || '0'}</p>
                </div>
              </div>

              {results.new_damages && results.new_damages.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-white mb-4">Detected New Damages:</h4>
                  {results.new_damages.map((damage, idx) => (
                    <div key={idx} className="bg-slate-900/50 rounded-xl p-6 border border-slate-600">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-lg font-bold text-white">{damage.type}</p>
                          <p className="text-slate-400 text-sm">{damage.location}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
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
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-20 h-20 mx-auto text-green-400 mb-4" />
                  <p className="text-2xl font-bold text-white mb-2">No New Damages Detected</p>
                  <p className="text-slate-400">Vehicle returned in the same condition</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}