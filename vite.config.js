import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500, // Increased chunk size warning limit
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Create a Firebase chunk
          if (id.includes('firebase/app') || id.includes('firebase/firestore')) {
            return 'firebase';
          }
          // Create a vendor chunk for node_modules
          if (id.includes('node_modules')) {
            // Group React and related libraries
            if (id.includes('react') || id.includes('scheduler') || id.includes('scheduler/')) {
              return 'vendor-react';
            }
            // Group form-related libraries
            if (id.includes('react-hook-form') || id.includes('yup') || id.includes('@hookform')) {
              return 'vendor-forms';
            }
            // Group UI libraries
            if (id.includes('@chakra-ui') || id.includes('framer-motion') || id.includes('@emotion')) {
              return 'vendor-ui';
            }
            // Group utility libraries
            if (id.includes('date-fns') || id.includes('lodash') || id.includes('axios')) {
              return 'vendor-utils';
            }
            // Default vendor chunk for other node_modules
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'firebase/app',
      'firebase/firestore',
      'firebase/storage',
      'firebase/auth'
    ],
    exclude: [],
  },
  server: {
    open: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
});
