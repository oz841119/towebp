'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Dropzone from './Dropzone';
import Controls from './Controls';
import { Download, ArrowRight, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';

interface Dictionary {
  hero: any;
  dropzone: any;
  controls: any;
  converter: any;
}

export default function WebPConverter({ dictionary }: { dictionary: Dictionary }) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [webpUrl, setWebpUrl] = useState<string | null>(null);
  const [webpBlob, setWebpBlob] = useState<Blob | null>(null);

  const [quality, setQuality] = useState(0.8);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [originalAspectRatio, setOriginalAspectRatio] = useState(1);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [isConverting, setIsConverting] = useState(false);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);

      // Get dimensions
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setOriginalAspectRatio(img.width / img.height);
      };
      img.src = url;
    }
  }, []);

  // Handle aspect ratio
  useEffect(() => {
    if (maintainAspectRatio && width && originalAspectRatio) {
      setHeight(Math.round(width / originalAspectRatio));
    }
  }, [width, maintainAspectRatio, originalAspectRatio]);

  // Handle conversion
  useEffect(() => {
    if (!file || !previewUrl) return;

    const convert = async () => {
      setIsConverting(true);
      const img = new Image();
      img.src = previewUrl;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement('canvas');
      canvas.width = width || img.width;
      canvas.height = height || img.height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setWebpBlob(blob);
              const newUrl = URL.createObjectURL(blob);
              setWebpUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return newUrl;
              });
            }
            setIsConverting(false);
          },
          'image/webp',
          quality
        );
      }
    };

    const timer = setTimeout(convert, 500); // Debounce
    return () => clearTimeout(timer);
  }, [file, previewUrl, quality, width, height]);

  const handleDownload = () => {
    if (webpUrl) {
      const link = document.createElement('a');
      link.href = webpUrl;
      link.download = file?.name.replace(/\.[^/.]+$/, "") + ".webp";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-5xl mx-auto">
      {!file ? (
        <Dropzone onDrop={onDrop} text={dictionary.dropzone} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">{dictionary.converter.original}</span>
                <button onClick={() => setFile(null)} className="text-teal-600 text-sm font-medium hover:underline cursor-pointer">{dictionary.converter.changeFile}</button>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                  {previewUrl && <img src={previewUrl} className="max-h-64 object-contain rounded-lg" alt="Original" />}
                  <div className="mt-2 text-center text-xs text-slate-500 font-medium">
                    {file && formatSize(file.size)}
                  </div>
                </div>

                <ArrowRight className="w-6 h-6 text-slate-400 hidden md:block" />

                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 relative">
                  {isConverting && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                    </div>
                  )}
                  {webpUrl && <img src={webpUrl} className="max-h-64 object-contain rounded-lg" alt="WebP" />}
                  <div className="mt-2 text-center text-xs text-teal-600 font-bold">
                    {webpBlob && formatSize(webpBlob.size)}
                    {file && webpBlob && ` (${Math.round((1 - webpBlob.size / file.size) * 100)}% ${dictionary.converter.saved})`}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-start gap-3">
              <ImageIcon className="w-5 h-5 text-teal-600 mt-0.5" />
              <p className="text-sm text-teal-800">
                {dictionary.converter.previewNote}
              </p>
            </div>
          </div>

          <div>
            <Controls
              quality={quality}
              setQuality={setQuality}
              width={width}
              setWidth={setWidth}
              height={height}
              setHeight={(h) => {
                setHeight(h);
                if (maintainAspectRatio) {
                  setMaintainAspectRatio(false);
                }
              }}
              maintainAspectRatio={maintainAspectRatio}
              setMaintainAspectRatio={setMaintainAspectRatio}
              onDownload={handleDownload}
              text={dictionary.controls}
            />
          </div>
        </div>
      )}
    </div>
  );
}
