/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc';
import * as path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), visualizer(), ViteImageOptimizer()],
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          vis: ['vis-network', 'vis-data'],
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // or "modern"
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/auth': path.resolve(__dirname, '/src/Auth'),
      '@/app': path.resolve(__dirname, '/src/App'),
      '@styles': path.resolve(__dirname, './src/sass'),
      '@/assets': path.resolve(__dirname, '/src/assets'),
      '@/components': path.resolve(__dirname, '/src/components'),
      '@/features': path.resolve(__dirname, '/src/features'),
      '@/hooks': path.resolve(__dirname, '/src/hooks'),
      '@/pages': path.resolve(__dirname, '/src/pages'),
      '@/routes': path.resolve(__dirname, '/src/routes'),
      '@/utils': path.resolve(__dirname, '/src/utils'),
      '@/services': path.resolve(__dirname, '/src/services'),
      '@/config': path.resolve(__dirname, '/src/config'),
      '@/types': path.resolve(__dirname, '/src/types'),
      '@/store': path.resolve(__dirname, '/src/store'),
      '@/layout': path.resolve(__dirname, '/src/layout'),
      '@/data': path.resolve(__dirname, '/src/data'),
      '@/helper': path.resolve(__dirname, '/src/helper'),
      '@/i18n': path.resolve(__dirname, '/src/i18n'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.jsx',
    css: true,
    reporters: ['verbose'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: ['src/App/__test__/App.test.jsx'],
    },
  },
});
