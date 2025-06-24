export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatTime = (milliseconds: number): string => {
  if (milliseconds < 1000) {
    return `${milliseconds.toFixed(2)}ms`;
  }
  return `${(milliseconds / 1000).toFixed(2)}s`;
};

export const calculateCompressionRatio = (originalSize: number, compressedSize: number): number => {
  if (originalSize === 0) return 0;
  return ((originalSize - compressedSize) / originalSize) * 100;
};

export const readFileAsUint8Array = (file: File): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        const arrayBuffer = event.target.result as ArrayBuffer;
        resolve(new Uint8Array(arrayBuffer));
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsArrayBuffer(file);
  });
};

export const downloadFile = (data: Uint8Array, filename: string, mimeType: string = 'application/octet-stream'): void => {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};