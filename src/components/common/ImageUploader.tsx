import React, { useState, useRef } from 'react';
import { Camera, Upload, Image as ImageIcon, Link as LinkIcon, X, Check, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  currentImage?: string;
  onImageChange: (newImageDataUrl: string) => void;
  label?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  className?: string;
  placeholderText?: string;
  rounded?: 'full' | 'xl' | '2xl' | '3xl';
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageChange,
  label,
  aspectRatio = 'square',
  className = '',
  placeholderText = 'Upload Photo',
  rounded = '2xl'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const roundedClasses = {
    full: 'rounded-full',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl'
  }[rounded];

  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]'
  }[aspectRatio];

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    // Limit size check (e.g., max 10MB input before compression)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size too large. Please select an image under 10MB.');
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // Optional client-side image resize to optimize storage & rendering
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.88);
            onImageChange(compressed);
          } else {
            onImageChange(result);
          }
          setLoading(false);
        };
        img.onerror = () => {
          onImageChange(result);
          setLoading(false);
        };
        img.src = result;
      } else {
        setLoading(false);
      }
    };
    reader.onerror = () => setLoading(false);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlValue.trim()) {
      onImageChange(urlValue.trim());
      setShowUrlInput(false);
      setUrlValue('');
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden ${roundedClasses} ${aspectClasses} border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center ${
          isDragging
            ? 'border-[#00A1DE] bg-[#00A1DE]/10 scale-[1.02]'
            : 'border-slate-300 dark:border-slate-700 hover:border-[#00A1DE] bg-slate-50 dark:bg-slate-900/50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {currentImage ? (
          <>
            <img
              src={currentImage}
              alt="Uploaded Preview"
              className="w-full h-full object-cover"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white space-y-1 p-2">
              <Camera className="w-6 h-6 text-[#00A1DE] animate-bounce" />
              <span className="text-[11px] font-bold">Change Image</span>
              <span className="text-[9px] text-slate-300">Click or Drag File</span>
            </div>
          </>
        ) : (
          <div className="p-4 space-y-2 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            {loading ? (
              <RefreshCw className="w-6 h-6 animate-spin text-[#00A1DE]" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#00A1DE]/10 text-[#00A1DE] flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
            )}
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                {placeholderText}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Drag & drop image or browse
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Alternative URL paste toggle */}
      <div className="flex items-center justify-between text-[11px]">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-slate-500 hover:text-[#00A1DE] flex items-center gap-1 font-medium transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlInput ? 'Hide URL input' : 'Paste Image Web Link'}
        </button>
        {currentImage && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onImageChange('');
            }}
            className="text-red-500 hover:underline text-[10px]"
          >
            Remove Image
          </button>
        )}
      </div>

      {showUrlInput && (
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <input
            type="url"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-[#00A1DE]"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-[#00A1DE] text-white font-bold text-xs hover:bg-[#0081B3]"
          >
            Apply
          </button>
        </form>
      )}
    </div>
  );
};
