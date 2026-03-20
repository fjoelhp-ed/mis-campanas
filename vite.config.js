import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/mis-campanas/', // CRUCIAL PARA GITHUB PAGES
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.png'], // <-- Le decimos que incluya tu logo
      manifest: {
        name: 'MisCampañas - Gestor',
        short_name: 'MisCampañas',
        description: 'Gestor profesional de estrategias y redes sociales',
        theme_color: '#10b981',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icon.png', // <-- Apunta a tu archivo en la carpeta public
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})