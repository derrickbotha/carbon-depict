import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// Plugins removed due to missing dependencies

/**
 * Vite Configuration - Phase 2 Week 6: Bundle Optimization
 *
 * Optimizations:
 * - Code splitting by route and vendor
 * - Tree shaking
 * - Gzip/Brotli compression
 * - Bundle analysis
 * - Lazy loading support
 */

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development'
  const isProduction = mode === 'production'

  return {
    plugins: [
      react(),
      // Plugins removed
    ].filter(Boolean),

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@atoms': path.resolve(__dirname, './src/components/atoms'),
        '@molecules': path.resolve(__dirname, './src/components/molecules'),
        '@organisms': path.resolve(__dirname, './src/components/organisms'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@styles': path.resolve(__dirname, './src/styles'),
      },
    },

    server: {
      port: 3500,
      hmr: {
        overlay: true,
        protocol: 'ws',
        host: 'localhost',
        port: 3500,
      },
      proxy: {
        '/api': {
          target: 'http://localhost:5500',
          changeOrigin: true,
        },
      },
    },

    build: {
      outDir: 'dist',
      sourcemap: isProduction ? false : true, // Disable sourcemaps in production
      minify: 'esbuild', // Faster than terser
      target: 'es2020', // Modern browsers only

      // Optimize chunk size
      chunkSizeWarningLimit: 1000, // Warn if chunk > 1MB

      rollupOptions: {
        output: {
          // Advanced code splitting strategy
          manualChunks: (id) => {
            // Vendor chunks
            if (id.includes('node_modules')) {
              // React core
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'react-vendor'
              }

              // Chart libraries
              if (id.includes('chart.js') || id.includes('recharts') || id.includes('react-chartjs')) {
                return 'chart-vendor'
              }

              // PDF generation
              if (id.includes('jspdf') || id.includes('html2canvas')) {
                return 'pdf-vendor'
              }

              // Excel/Data processing
              if (id.includes('xlsx')) {
                return 'data-vendor'
              }

              // UI libraries
              if (id.includes('lucide-react') || id.includes('clsx')) {
                return 'ui-vendor'
              }

              // Utilities
              if (id.includes('axios') || id.includes('date-fns')) {
                return 'utils-vendor'
              }

              // Everything else in node_modules
              return 'vendor'
            }

            // Split by route/feature
            if (id.includes('/src/pages/dashboard/')) {
              return 'dashboard'
            }

            if (id.includes('/src/pages/reports/')) {
              return 'reports'
            }

            if (id.includes('/src/components/organisms/')) {
              return 'organisms'
            }
          },

          // Consistent hashing for better caching
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]'
        },
      },

      // CSS code splitting
      cssCodeSplit: true,

      // Asset inlining threshold
      assetsInlineLimit: 4096, // Inline assets < 4KB
    },

    // PWA Configuration
    define: {
      '__APP_VERSION__': JSON.stringify(process.env.npm_package_version || '1.0.0'),
    },

    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'axios',
        'date-fns'
      ],
      exclude: [
        // Exclude large deps that should be lazy loaded
        'xlsx',
        'jspdf'
      ]
    }
  }
})
