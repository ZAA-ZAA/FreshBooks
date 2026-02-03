import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  // In Docker, frontend proxies /api to backend; set VITE_PROXY_BACKEND=http://backend:5000
  const proxyTarget = env.VITE_PROXY_BACKEND || 'http://localhost:5000';
  return {
    server: {
      port: 3000,
      host: true,
      allowedHosts: true, // ✅ FIXED (Vite 5)
      // Only proxy /api/* (e.g. /api/init), not /api.ts (Vite module request)
      proxy: {
        '^/api/': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
