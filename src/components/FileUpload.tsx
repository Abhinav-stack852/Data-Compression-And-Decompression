import React, { useCallback, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { FileInfo } from '../types';
import { formatFileSize } from '../utils/fileUtils';

interface FileUploadProps {
  onFileSelect: (file: File, fileInfo: FileInfo) => void;
  selectedFile: File | null;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  isProcessing
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');

  const validateFile = (file: File): string | null => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (file.size > maxSize) {
      return 'File size must be less than 50MB';
    }
    
    if (file.size === 0) {
      return 'File cannot be empty';
    }
    
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError('');
    const fileInfo: FileInfo = {
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      lastModified: file.lastModified
    };
    
    onFileSelect(file, fileInfo);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const clearFile = useCallback(() => {
    setError('');
    onFileSelect(null as any, null as any);
  }, [onFileSelect]);

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            isDragging
              ? 'border-blue-500 bg-blue-50 scale-105'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={`p-4 rounded-full transition-colors duration-300 ${
              isDragging ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Upload className={`w-8 h-8 transition-colors duration-300 ${
                isDragging ? 'text-blue-600' : 'text-gray-500'
              }`} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {isDragging ? 'Drop your file here' : 'Upload a file to compress'}
              </h3>
              <p className="text-gray-600">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports all file types • Max size: 50MB
              </p>
            </div>
            
            <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Choose File
              <input
                type="file"
                className="hidden"
                onChange={handleFileInput}
                disabled={isProcessing}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <File className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 truncate max-w-xs">
                  {selectedFile.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
                </p>
              </div>
            </div>
            
            {!isProcessing && (
              <button
                onClick={clearFile}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};