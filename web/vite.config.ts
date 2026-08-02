import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'The Lost World',
        short_name: 'TLW',
        description: 'Discover, restore, and nurture a forgotten ecosystem.',
        theme_color: '#1A2E24',
        background_color: '#1A2E24',
        display: 'standalone',
        orientation: 'any',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
  server: {
    allowedHosts: ['iris.tail604626.ts.net', 'localhost'],
    port: 5199,
    strictPort: true,
  },
  preview: {
    allowedHosts: ['iris.tail604626.ts.net', 'localhost'],
    port: 5199,
    strictPort: true,
  },
});
