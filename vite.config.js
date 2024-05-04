/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), visualizer()],
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          'vis-network-react': ['vis-network-react'],
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
    server: {
      deps: {
        inline: ['vis-data'],
      },
    },
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: ['src/App/__test__/App.test.jsx'],
    },
  },
});
