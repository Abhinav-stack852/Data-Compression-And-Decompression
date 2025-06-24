import React from 'react';
import { Play, Download, RotateCcw, Loader2 } from 'lucide-react';
import { Algorithm } from '../types';

interface ProcessingPanelProps {
  mode: 'compress' | 'decompress';
  onModeChange: (mode: 'compress' | 'decompress') => void;
  algorithm: Algorithm;
  onProcess: () => void;
  onDownload: () => void;
  canProcess: boolean;
  canDownload: boolean;
  isProcessing: boolean;
}

export const ProcessingPanel: React.FC<ProcessingPanelProps> = ({
  mode,
  onModeChange,
  algorithm,
  onProcess,
  onDownload,
  canProcess,
  canDownload,
  isProcessing
}) => {
  const algorithmNames = {
    huffman: 'Huffman Coding',
    rle: 'Run-Length Encoding',
    lz77: 'LZ77'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Processing Options</h3>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onModeChange('compress')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              mode === 'compress'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Compress
          </button>
          <button
            onClick={() => onModeChange('decompress')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              mode === 'decompress'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Decompress
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div>
            <p className="font-medium text-gray-900">Selected Algorithm</p>
            <p className="text-sm text-gray-600">{algorithmNames[algorithm]}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onProcess}
            disabled={!canProcess || isProcessing}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              canProcess && !isProcessing
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>{mode === 'compress' ? 'Compress File' : 'Decompress File'}</span>
              </>
            )}
          </button>

          <button
            onClick={onDownload}
            disabled={!canDownload || isProcessing}
            className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              canDownload && !isProcessing
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>

        {mode === 'decompress' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <RotateCcw className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">Decompression Mode</p>
                <p className="text-amber-700">
                  Upload a file compressed with the same algorithm to restore the original data.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};