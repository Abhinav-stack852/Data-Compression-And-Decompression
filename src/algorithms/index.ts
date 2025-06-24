import { huffmanCompress, huffmanDecompress } from './huffman';
import { rleCompress, rleDecompress } from './rle';
import { lz77Compress, lz77Decompress } from './lz77';
import { CompressionResult, DecompressionResult, Algorithm } from '../types';

export const compress = async (
  data: Uint8Array,
  algorithm: Algorithm
): Promise<CompressionResult> => {
  const startTime = performance.now();
  let compressedData: Uint8Array;
  let metadata = '';

  try {
    switch (algorithm) {
      case 'huffman':
        const huffmanResult = huffmanCompress(data);
        compressedData = huffmanResult.compressed;
        metadata = huffmanResult.metadata;
        break;
      case 'rle':
        compressedData = rleCompress(data);
        break;
      case 'lz77':
        compressedData = lz77Compress(data);
        break;
      default:
        throw new Error(`Unknown algorithm: ${algorithm}`);
    }

    const endTime = performance.now();
    const processingTime = endTime - startTime;
    
    const originalSize = data.length;
    const compressedSize = compressedData.length;
    const compressionRatio = originalSize > 0 ? ((originalSize - compressedSize) / originalSize) * 100 : 0;

    return {
      compressedData,
      originalSize,
      compressedSize,
      compressionRatio,
      processingTime,
      algorithm
    };
  } catch (error) {
    throw new Error(`Compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const decompress = async (
  compressedData: Uint8Array,
  algorithm: Algorithm
): Promise<DecompressionResult> => {
  const startTime = performance.now();
  let decompressedData: Uint8Array;

  try {
    switch (algorithm) {
      case 'huffman':
        decompressedData = huffmanDecompress(compressedData);
        break;
      case 'rle':
        decompressedData = rleDecompress(compressedData);
        break;
      case 'lz77':
        decompressedData = lz77Decompress(compressedData);
        break;
      default:
        throw new Error(`Unknown algorithm: ${algorithm}`);
    }

    const endTime = performance.now();
    const processingTime = endTime - startTime;

    return {
      decompressedData,
      originalSize: compressedData.length,
      decompressedSize: decompressedData.length,
      processingTime,
      algorithm
    };
  } catch (error) {
    throw new Error(`Decompression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};