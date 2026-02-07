import React, { useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, UploadCloud, AlertCircle } from 'lucide-react';

interface ImageInputProps {
  /** Callback when a file is selected */
  onImageSelected: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Whether an upload is currently in progress */
  uploading?: boolean;
  /** Label text for the dropzone */
  label?: string;
  /** Allow multiple file selection */
  multiple?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Optional error message to display */
  error?: string;
  /** Accepted file types (default: image/*) */
  accept?: string;
  /** Unique ID for the input to prevent conflicts */
  id?: string;
}

const ImageInput: React.FC<ImageInputProps> = ({
  onImageSelected,
  uploading = false,
  label = "شعار الموقع",
  multiple = false,
  className = "",
  error,
  accept = "image/*",
  id,
}) => {
  // Generate a safe unique ID if one isn't provided manually
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`w-full ${className}`}>
      <motion.label
        htmlFor={inputId} // Uses the unique ID
        whileHover={!uploading ? { scale: 1.01, borderColor: "#6366f1" } : {}}
        whileTap={!uploading ? { scale: 0.98 } : {}}
        className={`
          relative flex flex-col items-center justify-center w-full h-40 
          border-2 border-dashed rounded-xl cursor-pointer 
          transition-colors duration-200 ease-in-out
          ${error 
            ? 'border-red-300 bg-red-50 hover:bg-red-100/50' 
            : uploading
              ? 'border-teal-300 bg-teal-50 cursor-not-allowed'
              : 'border-slate-300 bg-slate-50 hover:bg-white hover:border-teal-400 hover:shadow-sm'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <AnimatePresence mode="wait">
            {uploading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex flex-col items-center"
              >
                <Loader2 className="w-10 h-10 mb-3 text-teal-500 animate-spin" />
                <p className="text-sm font-medium text-teal-600">جارī الرفع...</p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex flex-col items-center"
              >
                <div className={`p-3 rounded-full mb-3 ${error ? 'bg-red-100' : 'bg-teal-100'}`}>
                   {error ? (
                     <AlertCircle className="w-6 h-6 text-red-500" />
                   ) : (
                     <UploadCloud className="w-6 h-6 text-teal-500" />
                   )}
                </div>
                
                <p className={`mb-1 text-sm font-semibold ${error ? 'text-red-600' : 'text-slate-700'}`}>
                  {label}
                </p>
                <p className="text-xs text-slate-500">
                  (Max 2MB) PNG, JPG
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <input
          id={inputId} // Uses the unique ID
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onImageSelected}
          className="hidden"
          disabled={uploading}
        />
      </motion.label>

      {/* Optional: Display error message text below the box if provided */}
      {error && (
        <motion.p 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 text-xs text-red-500 text-center font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default ImageInput;