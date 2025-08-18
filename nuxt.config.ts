// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@pinia/nuxt', '@nuxtjs/sitemap'],
  runtimeConfig: {
    public: {
      contentfulSpace: process.env.CONTENTFUL_SPACE_ID || '',
      contentfulToken: process.env.CONTENTFUL_ACCESS_TOKEN || ''
    }
  },
  sitemap: {
    hostname: 'https://transatlanticbarometer.org',
    gzip: true,
    routes: [
      '/',
      '/compare',
      '/dev'
    ]
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
        { property: "og:image", content: "/assets/abstract.webp" },
        { property: "og:url", content: "https://transatlanticbarometer.org" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Transatlantic Barometer - Interactive Policy Platform" },
        { name: "twitter:description", content: "An interactive digital platform providing up-to-date information on pressing issues shaping the transatlantic relationship." },
        { name: "twitter:image", content: "/assets/abstract.webp" }
      ],
      link: [
        // DNS prefetch for external resources
        { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
        { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
        { rel: "dns-prefetch", href: "https://use.typekit.net" },
        { rel: "dns-prefetch", href: "https://p.typekit.net" },
        { rel: "dns-prefetch", href: "https://flagcdn.com" },
        { rel: "dns-prefetch", href: "https://www.youtube.com" },
        { rel: "dns-prefetch", href: "https://i.ytimg.com" },
        // google fonts - optimized loading
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: true },
        // adobe typekit fonts - optimized loading  
        { rel: "preconnect", href: "https://use.typekit.net", crossorigin: true },
        { rel: "preconnect", href: "https://p.typekit.net", crossorigin: true },
        { rel: "preload", href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap", as: "style", onload: "this.onload=null;this.rel='stylesheet'" },
        { rel: "noscript", innerHTML: "<link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap'>" },
        { rel: "preload", href: "/assets/barometer-logo.svg", as: "image", type: "image/svg+xml" },
        { rel: "preload", href: "/assets/abstract.webp", as: "image", type: "image/webp" },
        { rel: "preload", href: "/assets/barometer-footer.svg", as: "image", type: "image/svg+xml" },
        // Mobile favicon and app icons
        { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon.ico" },
        { rel: "manifest", href: "/site.webmanifest" },
        // RSS feed
        { rel: "alternate", type: "application/rss+xml", title: "Transatlantic Barometer RSS", href: "/api/rss.xml" },
      ],
      script: [],
    }
  },
  css: [
    '~/public/css/styles.css'
  ],
  build: {
    transpile: ['vue-carousel'],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: {
          name: 'default',
          chunks: 'async',
          priority: -20,
          reuseExistingChunk: true
        },
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          test: /node_modules/,
          priority: -10,
          reuseExistingChunk: true
        }
      }
    }
  },
  vite: {
    css: {
      devSourcemap: false
    },
    build: {
      cssCodeSplit: true,
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
            d3: ['d3'],
            contentful: ['contentful'],
            utils: ['lodash', 'papaparse'],
            carousel: ['vue-carousel'],
            media: ['@vimeo/player', 'vue3-youtube']
          }
        },
        external: (id) => {
          // Don't bundle large third-party libraries that aren't used everywhere
          if (id.includes('vue2-perfect-scrollbar') && !id.includes('node_modules')) {
            return true;
          }
          return false;
        }
      },
      target: 'esnext',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.warn']
        }
      }
    }
  },
  plugins: [
    '~/plugins/performance.client.js'
  ],
  ssr: false,
  experimental: {
    clientFallback: true
  },
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.google.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://use.typekit.net https://p.typekit.net; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com https://use.typekit.net; connect-src 'self' https:; frame-src 'self' https://www.youtube.com; object-src 'none'; base-uri 'self'; form-action 'self';",
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