import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
  react(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['logo.webp','smartbooks-logo-bg-1024x500.webp','pwa-192.webp','pwa-512.webp','robots.txt'],

    manifest: {
      name: 'SmartBooksFinance',
      short_name: 'SmartBooksFinance',

      description: 'Personal and small business finance management',

      theme_color: '#0d1b2a',
      background_color: '#ffffff',

      display: 'standalone',

      start_url: '/',

      icons: [
        {
          src: '/pwa-192.webp',
          sizes: '192x192',
          type: 'image/webp',
        },
        {
          src: '/pwa-512.webp',
          sizes: '512x512',
          type: 'image/webp',
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

    