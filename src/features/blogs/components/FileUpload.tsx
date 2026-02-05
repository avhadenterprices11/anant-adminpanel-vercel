import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface FileUploadProps {
  label: string;
  hint?: string;
  accept?: string;
  onChange: (file: File | null) => void;
  preview?: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  hint,
  accept = 'image/*',
  onChange,
  preview
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <Label className="text-slate-700 mb-2 block">{label}</Label>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${dragActive
          ? 'border-slate-400 bg-slate-50'
          : 'border-slate-200 bg-slate-50 hover:border-slate-300'
          }`}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {preview ? (
          <div className="flex items-center justify-center">
            <img src={preview} alt="Preview" className="max-h-32 rounded-lg" />
          </div>
        ) : (
          <div className="text-center">
            <Upload className="size-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 mb-1">
              <span className="font-semibold text-slate-600">Click to upload</span> or drag and drop
            </p>
            {hint && <p className="text-xs text-slate-500">{hint}</p>}
          </div>
        )}
      </div>
    </div>
  );
};
