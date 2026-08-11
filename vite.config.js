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
      // أضف هذا الجزء لتوجيه طلبات الـ api عبر البروكسي وتخطي الـ CORS
      '/api': {
        target: 'https://aisales123.runasp.net',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});