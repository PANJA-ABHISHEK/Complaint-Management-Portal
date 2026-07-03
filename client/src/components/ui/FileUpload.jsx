import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { HiCloudUpload, HiX, HiDocument, HiPhotograph } from 'react-icons/hi';

const FileUpload = ({ accept = 'image/*,.pdf', multiple = true, maxFiles = 5, onChange, label }) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files).slice(0, maxFiles);
    setFiles(droppedFiles);
    onChange?.(droppedFiles);
  }, [maxFiles, onChange]);

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, maxFiles);
    setFiles(selectedFiles);
    onChange?.(selectedFiles);
  };

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onChange?.(updated);
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return HiPhotograph;
    return HiDocument;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      )}
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer
          ${dragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
            : 'border-slate-300 dark:border-slate-600 hover:border-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }
        `}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <HiCloudUpload className={`w-12 h-12 mx-auto mb-3 ${dragActive ? 'text-primary-500' : 'text-slate-400'}`} />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Drag & drop files here, or <span className="text-primary-500">browse</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Max {maxFiles} files. Supports images and PDFs (max 5MB each)
        </p>
      </motion.div>

      {files.length > 0 && (
        <div className="space-y-2 mt-3">
          {files.map((file, index) => {
            const FileIcon = getFileIcon(file);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl"
              >
                <FileIcon className="w-5 h-5 text-primary-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors cursor-pointer"
                >
                  <HiX className="w-4 h-4 text-red-500" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
