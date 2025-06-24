import React from 'react';
import { History, Download, Trash2, TrendingDown } from 'lucide-react';
import { CompressionHistory } from '../types';
import { formatFileSize, formatTime } from '../utils/fileUtils';

interface HistoryPanelProps {
  history: CompressionHistory[];
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClearHistory }) => {
  if (history.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
        <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No History Available</h3>
        <p className="text-gray-500">
          Your compression and decompression history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <History className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Processing History</h3>
        </div>
        
        <button
          onClick={onClearHistory}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear</span>
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {history.slice().reverse().map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.operation === 'compress'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {item.operation}
                  </span>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                    {item.algorithm.toUpperCase()}
                  </span>
                </div>
                
                <h4 className="font-medium text-gray-900 truncate">{item.fileName}</h4>
                
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <span>{formatFileSize(item.originalSize)} → {formatFileSize(item.compressedSize)}</span>
                  {item.operation === 'compress' && (
                    <div className="flex items-center space-x-1">
                      <TrendingDown className="w-3 h-3" />
                      <span className={item.compressionRatio >= 0 ? 'text-green-600' : 'text-orange-600'}>
                        {item.compressionRatio >= 0 ? '-' : '+'}{Math.abs(item.compressionRatio).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right text-xs text-gray-500">
                <p>{new Date(item.timestamp).toLocaleDateString()}</p>
                <p>{new Date(item.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};