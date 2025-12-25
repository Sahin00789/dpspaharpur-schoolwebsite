import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      react({
        // Use the automatic JSX runtime
        jsxRuntime: 'automatic',
        // Use React as the JSX import source
        jsxImportSource: 'react',
        // Enable fast refresh in development
        fastRefresh: !isProduction,
        // Ensure React is imported automatically
        babel: {
          plugins: [
            ['@babel/plugin-transform-react-jsx', {
              runtime: 'automatic',
              importSource: 'react'
            }]
          ]
        }
      }),
      // Visualize bundle size (only in production build)
      isProduction && visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),
    
    resolve: {
      alias: {
        '@': '/src',
      },
      extensions: ['.js', '.jsx', '.json', '.mjs'],
    },
    
    server: {
      port: 5173,
      strictPort: true,
      open: true,
      fs: {
        allow: ['..'],
      },
      hmr: {
        overlay: false
      }
    },
    
    publicDir: 'public',
    
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: isProduction ? false : 'hidden',
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
      // Disable SSR
      ssr: false,
      // Optimize dependencies to ensure React is properly bundled
      commonjsOptions: {
        transformMixedEsModules: true,
        include: [/node_modules/],
        esmExternals: true
      },
      // Configure Rollup for optimal chunking
      rollupOptions: {
        // Don't externalize React - we want it bundled
        external: [],
        output: {
          // Disable manual chunks to ensure React is bundled properly
          manualChunks: undefined,
          // Use consistent file naming
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
          // Use ESM format
          format: 'esm',
          // Don't use globals - let the modules handle their own imports
          globals: {}
        },
      },
      // Remove console.log in production
      esbuild: {
        drop: isProduction ? ['console', 'debugger'] : [],
      },
    },
    
    preview: {
      port: 5173,
      strictPort: true,
    },
  };
});
