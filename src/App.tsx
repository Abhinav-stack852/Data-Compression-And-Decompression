import React, { useState, useCallback } from 'react';
import { Zap, Github, Info } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { AlgorithmSelector } from './components/AlgorithmSelector';
import { ProcessingPanel } from './components/ProcessingPanel';
import { StatisticsPanel } from './components/StatisticsPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { compress, decompress } from './algorithms';
import { readFileAsUint8Array, downloadFile, generateUniqueId } from './utils/fileUtils';
import { Algorithm, FileInfo, CompressionResult, DecompressionResult, CompressionHistory } from './types';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>('huffman');
  const [mode, setMode] = useState<'compress' | 'decompress'>('compress');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CompressionResult | DecompressionResult | null>(null);
  const [processedData, setProcessedData] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string>('');
  const [history, setHistory] = useState<CompressionHistory[]>([]);

  const handleFileSelect = useCallback((file: File | null, info: FileInfo | null) => {
    setSelectedFile(file);
    setFileInfo(info);
    setResult(null);
    setProcessedData(null);
    setError('');
  }, []);

  const handleProcess = useCallback(async () => {
    if (!selectedFile || !fileInfo) return;

    setIsProcessing(true);
    setError('');
    setResult(null);

    try {
      const fileData = await readFileAsUint8Array(selectedFile);
      
      if (mode === 'compress') {
        const compressionResult = await compress(fileData, selectedAlgorithm);
        setResult(compressionResult);
        setProcessedData(compressionResult.compressedData);
        
        const historyItem: CompressionHistory = {
          id: generateUniqueId(),
          fileName: fileInfo.name,
          algorithm: selectedAlgorithm,
          originalSize: compressionResult.originalSize,
          compressedSize: compressionResult.compressedSize,
          compressionRatio: compressionResult.compressionRatio,
          timestamp: Date.now(),
          operation: 'compress'
        };
        
        setHistory(prev => [...prev, historyItem]);
      } else {
        const decompressionResult = await decompress(fileData, selectedAlgorithm);
        setResult(decompressionResult);
        setProcessedData(decompressionResult.decompressedData);
        
        const historyItem: CompressionHistory = {
          id: generateUniqueId(),
          fileName: fileInfo.name,
          algorithm: selectedAlgorithm,
          originalSize: decompressionResult.originalSize,
          compressedSize: decompressionResult.decompressedSize,
          compressionRatio: 0, // Not applicable for decompression
          timestamp: Date.now(),
          operation: 'decompress'
        };
        
        setHistory(prev => [...prev, historyItem]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Processing failed';
      setError(errorMessage);
      console.error('Processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, fileInfo, mode, selectedAlgorithm]);

  const handleDownload = useCallback(() => {
    if (!processedData || !fileInfo) return;

    const extension = mode === 'compress' ? `.${selectedAlgorithm}` : '.decompressed';
    const baseFileName = fileInfo.name.replace(/\.[^/.]+$/, '');
    const fileName = `${baseFileName}${extension}`;
    
    downloadFile(processedData, fileName);
  }, [processedData, fileInfo, mode, selectedAlgorithm]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const canProcess = selectedFile && !isProcessing;
  const canDownload = processedData && !isProcessing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CompressFlow</h1>
                <p className="text-sm text-gray-600">Advanced File Compression Tool</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                title="View on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <button
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                title="About"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Compress & Decompress Files with Advanced Algorithms
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the power of Huffman Coding, Run-Length Encoding, and LZ77 compression algorithms. 
              Upload any file, choose your algorithm, and see real-time compression statistics.
            </p>
          </div>

          {/* File Upload */}
          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            isProcessing={isProcessing}
          />

          {/* Algorithm Selection */}
          {selectedFile && (
            <AlgorithmSelector
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmChange={setSelectedAlgorithm}
              disabled={isProcessing}
            />
          )}

          {/* Processing Panel */}
          {selectedFile && (
            <ProcessingPanel
              mode={mode}
              onModeChange={setMode}
              algorithm={selectedAlgorithm}
              onProcess={handleProcess}
              onDownload={handleDownload}
              canProcess={canProcess}
              canDownload={canDownload}
              isProcessing={isProcessing}
            />
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 text-red-600 mt-0.5">⚠️</div>
                <div>
                  <h3 className="font-semibold text-red-800">Processing Error</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Statistics and History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <StatisticsPanel result={result} mode={mode} />
            <HistoryPanel history={history} onClearHistory={handleClearHistory} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-8 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Algorithms</h4>
                <ul className="space-y-1">
                  <li>Huffman Coding</li>
                  <li>Run-Length Encoding</li>
                  <li>LZ77 Compression</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Features</h4>
                <ul className="space-y-1">
                  <li>Real-time Statistics</li>
                  <li>Multiple Formats</li>
                  <li>Processing History</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Support</h4>
                <ul className="space-y-1">
                  <li>Up to 50MB files</li>
                  <li>All file types</li>
                  <li>Browser-based</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-500">
                Built with React, TypeScript, and Tailwind CSS. Powered by advanced compression algorithms.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;