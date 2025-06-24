import React from 'react';
import { Zap, Repeat, Archive } from 'lucide-react';
import { Algorithm, AlgorithmInfo } from '../types';

interface AlgorithmSelectorProps {
  selectedAlgorithm: Algorithm;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  disabled?: boolean;
}

const algorithmData: AlgorithmInfo[] = [
  {
    id: 'huffman',
    name: 'Huffman Coding',
    description: 'Optimal prefix-free encoding based on character frequency. Excellent for text files and data with uneven character distribution.',
    complexity: 'O(n log n)',
    bestFor: ['Text files', 'Source code', 'CSV data'],
    icon: 'zap'
  },
  {
    id: 'rle',
    name: 'Run-Length Encoding',
    description: 'Simple compression that replaces consecutive identical bytes with count-value pairs. Best for data with many repetitions.',
    complexity: 'O(n)',
    bestFor: ['Images with solid areas', 'Binary data', 'Simple graphics'],
    icon: 'repeat'
  },
  {
    id: 'lz77',
    name: 'LZ77',
    description: 'Dictionary-based compression that replaces repeated sequences with references to previous occurrences. Foundation of ZIP and GZIP.',
    complexity: 'O(n²)',
    bestFor: ['Mixed content', 'General purpose', 'Large files'],
    icon: 'archive'
  }
];

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'zap': return Zap;
    case 'repeat': return Repeat;
    case 'archive': return Archive;
    default: return Zap;
  }
};

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedAlgorithm,
  onAlgorithmChange,
  disabled = false
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Choose Compression Algorithm</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {algorithmData.map((algorithm) => {
          const Icon = getIcon(algorithm.icon);
          const isSelected = selectedAlgorithm === algorithm.id;
          
          return (
            <button
              key={algorithm.id}
              onClick={() => onAlgorithmChange(algorithm.id)}
              disabled={disabled}
              className={`relative p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  isSelected ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    isSelected ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold ${
                    isSelected ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {algorithm.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {algorithm.description}
                  </p>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="font-medium">Complexity:</span>
                      <span className="ml-1">{algorithm.complexity}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {algorithm.bestFor.slice(0, 2).map((item, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded-full ${
                            isSelected
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};