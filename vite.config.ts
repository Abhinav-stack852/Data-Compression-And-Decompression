import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Data-Compression-And-Decompression/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
