interface LZ77Match {
  offset: number;
  length: number;
  nextChar: number;
}

const WINDOW_SIZE = 4096;
const LOOKAHEAD_BUFFER_SIZE = 18;

export const lz77Compress = (data: Uint8Array): Uint8Array => {
  if (data.length === 0) {
    return new Uint8Array(0);
  }

  const compressed: number[] = [];
  let position = 0;

  while (position < data.length) {
    let bestMatch: LZ77Match = { offset: 0, length: 0, nextChar: data[position] };
    
    const searchStart = Math.max(0, position - WINDOW_SIZE);
    const maxLength = Math.min(LOOKAHEAD_BUFFER_SIZE, data.length - position);
    
    for (let i = searchStart; i < position; i++) {
      let length = 0;
      
      while (
        length < maxLength &&
        position + length < data.length &&
        data[i + length] === data[position + length]
      ) {
        length++;
      }
      
      if (length > bestMatch.length) {
        bestMatch = {
          offset: position - i,
          length: length,
          nextChar: position + length < data.length ? data[position + length] : 0
        };
      }
    }
    
    compressed.push(bestMatch.offset >> 8);
    compressed.push(bestMatch.offset & 0xFF);
    compressed.push(bestMatch.length);
    compressed.push(bestMatch.nextChar);
    
    position += bestMatch.length + 1;
  }
  
  return new Uint8Array(compressed);
};

export const lz77Decompress = (compressedData: Uint8Array): Uint8Array => {
  if (compressedData.length === 0) {
    return new Uint8Array(0);
  }

  if (compressedData.length % 4 !== 0) {
    throw new Error('Invalid LZ77 compressed data format');
  }

  const decompressed: number[] = [];
  
  for (let i = 0; i < compressedData.length; i += 4) {
    const offset = (compressedData[i] << 8) | compressedData[i + 1];
    const length = compressedData[i + 2];
    const nextChar = compressedData[i + 3];
    
    if (offset > 0 && length > 0) {
      const start = decompressed.length - offset;
      
      for (let j = 0; j < length; j++) {
        if (start + j >= 0 && start + j < decompressed.length) {
          decompressed.push(decompressed[start + j]);
        }
      }
    }
    
    if (nextChar !== 0 || offset === 0) {
      decompressed.push(nextChar);
    }
  }
  
  return new Uint8Array(decompressed);
};