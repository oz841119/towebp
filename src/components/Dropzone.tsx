'use client';

import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileImage } from 'lucide-react';
import clsx from 'clsx';

interface DropzoneProps {
  onDrop: (files: File[]) => void;
  text: {
    dragDrop: string;
    support: string;
  };
}

export default function Dropzone({ onDrop, text }: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': [],
      'image/jpeg': [],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={clsx(
        'border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300',
        'flex flex-col items-center justify-center min-h-[200px]',
        isDragActive
          ? 'border-teal-500 bg-teal-50'
          : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'
      )}
    >
      <input {...getInputProps()} />
      <div className="bg-teal-100 p-4 rounded-full mb-4">
        {isDragActive ? (
          <FileImage className="w-8 h-8 text-teal-600" />
        ) : (
          <UploadCloud className="w-8 h-8 text-teal-600" />
        )}
      </div>
      <p className="text-lg font-medium text-slate-700 mb-2">{text.dragDrop}</p>
      <p className="text-sm text-slate-500">{text.support}</p>
    </div>
  );
}
