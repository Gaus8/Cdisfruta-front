import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
const googlePopupHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { headers: googlePopupHeaders },
  preview: { headers: googlePopupHeaders },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('@react-oauth')) return 'oauth-google';
          if (id.includes('react-dom') || id.includes('node_modules/react/') || id.includes('node_modules\\react\\')) {
            return 'react-vendor';
          }
          if (id.includes('axios')) return 'axios';
          return undefined;
        },
      },
    },
  },
})
