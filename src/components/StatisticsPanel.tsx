import React from 'react';
import { BarChart3, Clock, TrendingDown, FileText } from 'lucide-react';
import { CompressionResult, DecompressionResult } from '../types';
import { formatFileSize, formatTime } from '../utils/fileUtils';

interface StatisticsPanelProps {
  result: CompressionResult | DecompressionResult | null;
  mode: 'compress' | 'decompress';
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ result, mode }) => {
  if (!result) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No Statistics Available</h3>
        <p className="text-gray-500">
          Process a file to see compression statistics and performance metrics.
        </p>
      </div>
    );
  }

  const isCompressionResult = 'compressionRatio' in result;
  const compressionResult = result as CompressionResult;
  const decompressionResult = result as DecompressionResult;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          {mode === 'compress' ? 'Compression' : 'Decompression'} Statistics
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {mode === 'compress' ? 'Original Size' : 'Compressed Size'}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatFileSize(
              mode === 'compress' ? compressionResult.originalSize : decompressionResult.originalSize
            )}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {mode === 'compress' ? 'Compressed Size' : 'Decompressed Size'}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatFileSize(
              mode === 'compress' ? compressionResult.compressedSize : decompressionResult.decompressedSize
            )}
          </p>
        </div>

        {isCompressionResult && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingDown className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Compression Ratio</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {compressionResult.compressionRatio >= 0 
                ? `${compressionResult.compressionRatio.toFixed(1)}%`
                : `+${Math.abs(compressionResult.compressionRatio).toFixed(1)}%`
              }
            </p>
            {compressionResult.compressionRatio < 0 && (
              <p className="text-xs text-orange-600 mt-1">File expanded</p>
            )}
          </div>
        )}

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Processing Time</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {formatTime(result.processingTime)}
          </p>
        </div>
      </div>

      {isCompressionResult && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Space Saved:</span>
            <span className={`font-medium ${
              compressionResult.compressionRatio >= 0 ? 'text-green-600' : 'text-orange-600'
            }`}>
              {compressionResult.compressionRatio >= 0
                ? formatFileSize(compressionResult.originalSize - compressionResult.compressedSize)
                : `-${formatFileSize(compressionResult.compressedSize - compressionResult.originalSize)}`
              }
            </span>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Algorithm: {result.algorithm.toUpperCase()}</h4>
        <div className="text-sm text-gray-600 space-y-1">
          {result.algorithm === 'huffman' && (
            <p>Uses variable-length codes based on character frequency for optimal compression.</p>
          )}
          {result.algorithm === 'rle' && (
            <p>Replaces consecutive identical bytes with count-value pairs for simple compression.</p>
          )}
          {result.algorithm === 'lz77' && (
            <p>Dictionary-based compression that references previous occurrences of data patterns.</p>
          )}
        </div>
      </div>
    </div>
  );
};