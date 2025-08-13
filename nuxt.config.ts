// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@pinia/nuxt'],
  runtimeConfig: {
    public: {
      contentfulSpace: process.env.CONTENTFUL_SPACE_ID || '',
      contentfulToken: process.env.CONTENTFUL_ACCESS_TOKEN || ''
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Transatlantic Barometer - Interactive Policy Platform',
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "An interactive digital platform providing up-to-date information on pressing issues shaping the transatlantic relationship between the US, Canada, UK, and EU." },
        { name: "keywords", content: "transatlantic, policy, EU, United States, Canada, United Kingdom, politics, international relations" },
        { property: "og:title", content: "Transatlantic Barometer - Interactive Policy Platform" },
        { property: "og:description", content: "An interactive digital platform providing up-to-date information on pressing issues shaping the transatlantic relationship." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Transatlantic Barometer - Interactive Policy Platform" },
        { name: "twitter:description", content: "An interactive digital platform providing up-to-date information on pressing issues shaping the transatlantic relationship." }
      ],
      link: [
        // google icons - async loading for performance
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: true },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap" },
        { rel: "preload", href: "/assets/barometer-logo.svg", as: "image", type: "image/svg+xml" },
      ],
      script: [],
    }
  },
  css: [
    'public/css/styles.css'
  ],
  build: {
    transpile: ['vue-carousel'],
  },
  vite: {
    css: {
      devSourcemap: false
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
          }
        }
      }
    }
  },
  plugins: [
    
  ],
  ssr: false,
  experimental: {
    clientFallback: true
  },
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.google.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:; frame-src 'self' https://www.youtube.com; object-src 'none'; base-uri 'self'; form-action 'self';",
          'Cross-Origin-Opener-Policy': 'same-origin',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
      }
    }
  },
  components: [
    { path: '~/components', pathPrefix: false }
  ],
})