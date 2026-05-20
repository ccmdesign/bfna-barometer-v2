import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// Lightweight setup — we do NOT boot a full Nuxt runtime for these tests.
// Component specs use `@vue/test-utils` directly with stubs for Nuxt-injected
// components, and the contentful mapper spec runs in Node with require-cache
// stubs.  Per-file `// @vitest-environment` headers pick happy-dom where the
// spec touches the DOM.
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'node',
    include: ['tests/**/*.spec.ts']
  }
})
