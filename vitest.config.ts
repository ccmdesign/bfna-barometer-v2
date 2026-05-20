import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['tests/**/*.spec.{js,ts}'],
    setupFiles: ['tests/setup-env.js'],
    env: {
      BASE_URL: 'https://directus.example.test'
    }
  }
})
