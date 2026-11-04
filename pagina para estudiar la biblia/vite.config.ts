import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

/**
 * Decisión: Vite + React.
 * - SPA pura: File System Access API e IndexedDB requieren contexto de navegador.
 * - Sin SSR: evita divergencias de hidratación al leer handles persistidos.
 * - Bundle dividido por ruta para que Swagger UI no pese en la carga inicial.
 */
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon.svg'],
      manifest: {
        name: "Santi's Versicles",
        short_name: 'SV',
        description:
          'Estudio bíblico personal con Reina-Valera 1960, NTV y NLT. Rachas, notas y lectura profunda.',
        lang: 'es',
        dir: 'ltr',
        theme_color: '#0A1A2F',
        background_color: '#0A1A2F',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        categories: ['books', 'education', 'lifestyle'],
        icons: [
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/icon-maskable.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // Caché de capítulos: la app funciona offline una vez leído el capítulo.
            urlPattern: /^https:\/\/bolls\.life\/get-chapter\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'bolls-chapters',
              expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      '@model': fileURLToPath(new URL('./src/model', import.meta.url)),
      '@controller': fileURLToPath(new URL('./src/controller', import.meta.url)),
      '@seguimiento': fileURLToPath(new URL('./src/seguimiento', import.meta.url)),
      '@rsc': fileURLToPath(new URL('./src/rsc', import.meta.url)),
      '@ui': fileURLToPath(new URL('./src/ui', import.meta.url)),
      '@i18n': fileURLToPath(new URL('./src/i18n', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Swagger UI es pesado y solo se usa en /api: se aísla del bundle principal.
          swagger: ['swagger-ui-react'],
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: { port: 5173, open: false },
});
