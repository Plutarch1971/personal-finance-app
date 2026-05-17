import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
  react(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico','robots.txt'],

    manifest: {
      name: 'SmartBooks',
      short_name: 'SmartBooks',

      description: 'Personal and small business finance management',

      theme_color: '#0d1b2a',
      background_color: '#ffffff',

      display: 'standalone',

      start_url: '/',

      icons: [
        {
          src: '/pwa-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    devOptions: { enabled: true }
  }),
],
  build: {
    chunkSizeWarningLimit: 600
  }
})

    