'use client';

import clsx from 'clsx';
import { Download } from 'lucide-react';

interface ControlsProps {
  quality: number;
  setQuality: (q: number) => void;
  width: number;
  setWidth: (w: number) => void;
  height: number;
  setHeight: (h: number) => void;
  maintainAspectRatio: boolean;
  setMaintainAspectRatio: (m: boolean) => void;
  onDownload: () => void;
  text: {
    quality: string;
    width: string;
    height: string;
    maintainAspectRatio: string;
    download: string;
  };
}

export default function Controls({
  quality,
  setQuality,
  width,
  setWidth,
  height,
  setHeight,
  maintainAspectRatio,
  setMaintainAspectRatio,
  onDownload,
  text,
}: ControlsProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
      {/* Quality Slider */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {text.quality}: {Math.round(quality * 100)}%
        </label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={quality}
          onChange={(e) => setQuality(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
        />
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            {text.width} (px)
          </label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            {text.height} (px)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="aspect-ratio"
          type="checkbox"
          checked={maintainAspectRatio}
          onChange={(e) => setMaintainAspectRatio(e.target.checked)}
          className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
        />
        <label
          htmlFor="aspect-ratio"
          className="ml-2 text-sm text-slate-600 select-none"
        >
          {text.maintainAspectRatio}
        </label>
      </div>

      <button
        onClick={onDownload}
        className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md shadow-teal-600/20 cursor-pointer"
      >
        <Download className="w-5 h-5" />
        {text.download}
      </button>
    </div>
  );
}
