
import React, { useRef } from 'react';
import { FileIcon, UploadIcon, XIcon } from './Icons';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  file: File | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, file }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    onFileChange(selectedFile || null);
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = () => {
    onFileChange(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div className="bg-surface border-2 border-dashed border-border-color rounded-xl p-6 text-center transition-all duration-300 ease-in-out hover:border-primary/80 hover:bg-surface/50">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
      />
      {!file ? (
        <>
            <div className="mx-auto h-12 w-12 text-text-secondary">
                <UploadIcon />
            </div>
            <h3 className="mt-2 text-sm font-medium text-text-main">
                <button
                    type="button"
                    onClick={handleButtonClick}
                    className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-brand-bg hover:text-primary-hover"
                >
                    Upload a document
                </button>
            </h3>
            <p className="mt-1 text-xs text-text-secondary">PDF, DOCX, TXT up to 20MB</p>
        </>
      ) : (
        <div className="flex items-center justify-center flex-col sm:flex-row text-sm">
            <div className="flex items-center">
                <div className="w-8 h-8 text-primary">
                    <FileIcon />
                </div>
                <span className="ml-2 font-medium text-text-main">{file.name}</span>
            </div>
          <button
            onClick={handleClearFile}
            className="mt-2 sm:mt-0 sm:ml-4 flex items-center justify-center bg-red-500/20 hover:bg-red-500/40 text-red-300 font-bold py-1 px-2 rounded-full text-xs transition-colors"
            aria-label="Remove file"
          >
            <XIcon className="w-3 h-3 mr-1"/>
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
