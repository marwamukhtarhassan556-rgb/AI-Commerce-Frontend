import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api-ai': {
        target: 'https://aicommerce-ai-service-production.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-ai/, ''),
      },
    },
  },
});