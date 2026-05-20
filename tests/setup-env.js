// Vitest setup: ensure required env vars exist before any module loads.
// directus/common.js calls createDirectus(process.env.BASE_URL) at import time,
// which throws "Invalid URL" if BASE_URL is not a valid URL.
process.env.BASE_URL = process.env.BASE_URL || 'https://directus.example.test'
