/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc';
import * as path from "node:path";
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Vite does NOT populate process.env from .env files for THIS file — config is
  // evaluated before that happens, so `process.env.VITE_*` is undefined here even
  // when the variable is set in .env. loadEnv reads them explicitly. Without it,
  // the proxy silently fell back to its localhost default and every API call came
  // back 500 (the upstream saw an unprefixed path and the GKE Ingress routed it
  // to a different backend). Shell variables still win, via the spread order.
  const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env };

  return {
  base: '/',
  plugins: [react(), visualizer(), ViteImageOptimizer()],
  build: {
    outDir: 'build',
  },
  server: {
    proxy: {
      // The PreCAWG visualization on /data-viz calls its FastAPI service under
      // this prefix. In production the VM's web server proxies it; without the
      // same mapping in dev those calls hit Vite and 404. Same-origin here also
      // means CORS never enters the picture.
      //
      // ONE knob, and the path is part of it — whatever the backend is mounted
      // under belongs in the URL:
      //
      //   local `app.main` (API at /api/...):
      //     VITE_PRECAWG_API_UPSTREAM=http://localhost:8000
      //   deployed image (mounted under URL_PREFIX, API at /precawg/api/...):
      //     VITE_PRECAWG_API_UPSTREAM=https://data-viz-dev.motrpac-data.org/precawg
      //
      // This replaced a separate VITE_PRECAWG_API_KEEP_PREFIX boolean. Two
      // variables describing one fact could disagree, and did: overriding only the
      // upstream left the prefix flag from .env pointing at a local backend that
      // serves /api, which 404'd. http-proxy prepends the target's own path, so
      // the route prefix is now ALWAYS stripped and the URL carries the truth.
      '/precawg/api': {
        target: env.VITE_PRECAWG_API_UPSTREAM || 'http://localhost:8000',
        changeOrigin: true, // also sets Host, which the GKE Ingress routes on
        secure: true,
        rewrite: (urlPath) => urlPath.replace(/^\/precawg/, ''),
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
  };
});
