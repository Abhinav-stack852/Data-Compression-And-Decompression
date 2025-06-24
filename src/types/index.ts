export interface CompressionResult {
  compressedData: Uint8Array;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  processingTime: number;
  algorithm: string;
}

export interface DecompressionResult {
  decompressedData: Uint8Array;
  originalSize: number;
  decompressedSize: number;
  processingTime: number;
  algorithm: string;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface CompressionHistory {
  id: string;
  fileName: string;
  algorithm: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  timestamp: number;
  operation: 'compress' | 'decompress';
}

export type Algorithm = 'huffman' | 'rle' | 'lz77';

export interface AlgorithmInfo {
  id: Algorithm;
  name: string;
  description: string;
  complexity: string;
  bestFor: string[];
  icon: string;
}