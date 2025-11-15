import React, { useState } from 'react';
import { Header } from '../components/organisms/Header';
import { DashboardView } from '../components/organisms/DashboardView';
import { ReportView } from '../components/organisms/ReportView';
import { Button } from '../components/atoms/Button';

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
      const response = await fetch('/api/analyze', {
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

  const handleBackToDashboard = () => {
    setActiveTab('dashboard');
  };

  const handleNewAnalysis = () => {
    setPickupImage(null);
    setReturnImage(null);
    setPickupPreview(null);
    setReturnPreview(null);
    setResults(null);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8 justify-center">
          <Button
            onClick={() => setActiveTab('dashboard')}
            variant={activeTab === 'dashboard' ? 'tabActive' : 'tab'}
          >
            Dashboard
          </Button>
          <Button
            onClick={() => setActiveTab('report')}
            variant={activeTab === 'report' ? 'tabActive' : 'tab'}
            disabled={!results}
          >
            Report
          </Button>
          {results && (
            <Button
              onClick={handleNewAnalysis}
              variant="tab"
              className="ml-auto"
            >
              New Analysis
            </Button>
          )}
        </div>

        {activeTab === 'dashboard' && (
          <DashboardView
            pickupImage={pickupImage}
            returnImage={returnImage}
            pickupPreview={pickupPreview}
            returnPreview={returnPreview}
            onPickupUpload={(e) => handleImageUpload(e, 'pickup')}
            onReturnUpload={(e) => handleImageUpload(e, 'return')}
            onAnalyze={analyzeImages}
            loading={loading}
          />
        )}

        {activeTab === 'report' && results && (
          <ReportView
            results={results}
            pickupPreview={pickupPreview}
            returnPreview={returnPreview}
            onBackToDashboard={handleBackToDashboard}
          />
        )}
      </main>
    </div>
  );
}