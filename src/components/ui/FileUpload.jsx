import React, { useRef, useState } from 'react';
import { UploadCloud, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileUpload = ({ 
  label, 
  error, 
  value = [], 
  onChange, 
  multiple = true, 
  accept = '*/*',
  maxSize = 5242880, // 5MB
  className = '' 
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Max size is ${maxSize / 1024 / 1024}MB.`);
        return false;
      }
      return true;
    });
    
    if (multiple) {
      onChange([...value, ...validFiles]);
    } else {
      onChange([validFiles[0]]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (index) => {
    const newValues = [...value];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center w-full h-36 px-4 py-6 
          border-2 border-dashed rounded-2xl cursor-pointer transition-colors
          ${isDragging 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' 
            : 'border-slate-300 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-dark-bg dark:hover:bg-slate-800/50'}
          ${error ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : ''}
        `}
      >
        <UploadCloud className={`w-10 h-10 mb-2 ${isDragging ? 'text-primary-500' : 'text-slate-400'}`} />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 text-center">
          <span className="text-primary-600 dark:text-primary-400 font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG, PDF (MAX. 5MB)</p>
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          onChange={handleFileChange}
          multiple={multiple}
          accept={accept}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-sm font-medium text-red-500">
          {error}
        </p>
      )}

      {/* Selected Files List */}
      <AnimatePresence>
        {value.length > 0 && (
          <div className="mt-4 space-y-2">
            {value.map((file, idx) => (
              <motion.div 
                key={`${file.name}-${idx}`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm dark:bg-dark-card dark:border-slate-800"
              >
                <div className="flex items-center overflow-hidden">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg mr-3 shrink-0">
                    <FileText className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
