import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/Meteo/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/*.png"],
      workbox: {
        // Stratégie de cache pour le mode offline
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            // Cache des appels API Open-Meteo
            urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-weather",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 30 }, // 30 min
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Cache des appels API géocodage
            urlPattern: /^https:\/\/geocoding-api\.open-meteo\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "api-geocoding",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 }, // 7 jours
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Cache des tuiles de carte Leaflet
            urlPattern: /^https:\/\/.*tile.*\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "map-tiles",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 jours
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Cache des images radar
            urlPattern: /^https:\/\/tilecache\.rainviewer\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "rain-radar",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 10 }, // 10 min
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        name: "Météo Dashboard",
        short_name: "Météo",
        description: "Dashboard météo moderne et interactif avec prévisions, radar pluie et qualité de l'air",
        theme_color: "#0f1923",
        background_color: "#0f1923",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/Meteo/",
        start_url: "/Meteo/",
        categories: ["weather", "utilities"],
        icons: [
          {
            src: "favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
          {
            src: "icons/icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "icons/icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icons/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "icons/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
          },
        ],
        shortcuts: [
          {
            name: "Météo actuelle",
            short_name: "Actuelle",
            url: "/Meteo/",
            icons: [{ src: "icons/icon-96x96.png", sizes: "96x96" }],
          },
          {
            name: "Widget météo",
            short_name: "Widget",
            url: "/Meteo/widget.html",
            icons: [{ src: "icons/icon-96x96.png", sizes: "96x96" }],
          },
        ],
      },
    }),
  ],
});
