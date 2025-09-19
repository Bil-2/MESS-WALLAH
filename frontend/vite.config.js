import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Optimize JSX runtime
      jsxRuntime: 'automatic'
    })
  ],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
    // Enable minification for better performance
    minify: true,
    // Target modern browsers for better performance
    target: 'es2020'
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      },
      target: 'es2020'
    },
    // Pre-bundle these dependencies for faster loading
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'react-hot-toast',
      'react-icons/fi',
      'axios'
    ]
  },
  server: {
    port: 5173,
    host: true,
    // Enable HTTP/2 for better performance
    https: false,
    // Optimize HMR
    hmr: {
      port: 24678,
      host: 'localhost',
      overlay: false
    },
    // Enable compression
    middlewareMode: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        ws: true,
        timeout: 10000,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Enable minification
    minify: 'esbuild',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Target modern browsers
    target: 'es2020',
    rollupOptions: {
      output: {
        // Optimize chunk splitting for better caching
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom'],
          // Routing
          'router': ['react-router-dom'],
          // UI and animations
          'ui-vendor': ['framer-motion', 'react-hot-toast'],
          // Icons
          'icons': ['react-icons/fi'],
          // HTTP client
          'http': ['axios'],
          // Utilities
          'utils': ['date-fns', 'js-cookie']
        },
        // Optimize file naming for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Enable tree shaking
    treeshake: {
      moduleSideEffects: false
    }
  },
  // Performance optimizations
  define: {
    // Remove development code in production
    __DEV__: JSON.stringify(false)
  },
  // CSS optimizations
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      // Optimize CSS processing
      scss: {
        charset: false
      }
    }
  }
})
