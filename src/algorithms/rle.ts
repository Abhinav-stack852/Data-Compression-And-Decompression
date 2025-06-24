export const rleCompress = (data: Uint8Array): Uint8Array => {
  if (data.length === 0) {
    return new Uint8Array(0);
  }

  const compressed: number[] = [];
  let count = 1;
  let current = data[0];

  for (let i = 1; i < data.length; i++) {
    if (data[i] === current && count < 255) {
      count++;
    } else {
      compressed.push(count, current);
      current = data[i];
      count = 1;
    }
  }
  
  compressed.push(count, current);
  return new Uint8Array(compressed);
};

export const rleDecompress = (compressedData: Uint8Array): Uint8Array => {
  if (compressedData.length === 0) {
    return new Uint8Array(0);
  }

  if (compressedData.length % 2 !== 0) {
    throw new Error('Invalid RLE compressed data format');
  }

  const decompressed: number[] = [];
  
  for (let i = 0; i < compressedData.length; i += 2) {
    const count = compressedData[i];
    const value = compressedData[i + 1];
    
    for (let j = 0; j < count; j++) {
      decompressed.push(value);
    }
  }
  
  return new Uint8Array(decompressed);
};