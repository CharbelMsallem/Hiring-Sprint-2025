import React from 'react';
import { Upload } from 'lucide-react';

export const ImageUploadCard = ({ title, icon: Icon, preview, onUpload, iconColor }) => (
  <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-slate-700 hover:border-slate-600 transition-all">
    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
      <Icon className={`w-5 h-5 md:w-6 md:h-6 ${iconColor}`} />
      {title}
    </h2>
    <label className="block cursor-pointer group">
      <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 md:p-8 text-center hover:border-blue-400 transition-all bg-slate-900/50 group-hover:bg-slate-900/70">
        {preview ? (
          <img src={preview} alt={title} className="w-full h-48 md:h-64 object-cover rounded-lg" />
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 md:w-16 md:h-16 mx-auto text-slate-400 group-hover:text-blue-400 transition-colors" />
            <div>
              <p className="text-white font-semibold">Upload {title}</p>
              <p className="text-slate-400 text-sm mt-1">Click to browse</p>
            </div>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={onUpload}
          className="hidden"
        />
      </div>
    </label>
  </div>
);