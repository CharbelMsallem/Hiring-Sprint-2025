import React from 'react';
import { Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../atoms/Button';
import { ImageUploadCard } from '../molecules/ImageUploadCard';

export const DashboardView = ({ 
  pickupImage, 
  returnImage, 
  pickupPreview, 
  returnPreview, 
  onPickupUpload, 
  onReturnUpload, 
  onAnalyze, 
  loading 
}) => (
  <div className="space-y-6 md:space-y-8">
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      <ImageUploadCard
        title="Pickup Image"
        icon={CheckCircle}
        iconColor="text-green-400"
        preview={pickupPreview}
        onUpload={onPickupUpload}
      />
      <ImageUploadCard
        title="Return Image"
        icon={AlertCircle}
        iconColor="text-orange-400"
        preview={returnPreview}
        onUpload={onReturnUpload}
      />
    </div>

    <div className="flex justify-center">
      <Button
        onClick={onAnalyze}
        disabled={!pickupImage || !returnImage || loading}
        className="w-full sm:w-auto"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
            Analyzing Images...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-3">
            <Camera className="w-5 h-5" />
            Analyze Vehicle Condition
          </span>
        )}
      </Button>
    </div>
  </div>
);