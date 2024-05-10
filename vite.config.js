/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), visualizer(), ViteImageOptimizer()],
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          'vis': ['vis-network', 'vis-data'],
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
    reporters: ['verbose'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: ['src/App/__test__/App.test.jsx'],
    },
  },
});
