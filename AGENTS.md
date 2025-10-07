# Repository Guidelines

## Project Structure & Module Organization
The Nuxt 3 app is driven from `app.vue` with route files in `pages/` and layout scaffolding in `layouts/`. Presentation components live in `components/` and follow the `bar-` prefix for Barometer UI pieces; place shared design tokens in `components/ds/`. Content sourced from Contentful is cached as JSON within `.data/` and Markdown in `content/`. Data fetchers and mappers sit in `contentful/` and are invoked by `contentImporter.js`. Use `composables/` for reusable Composition API helpers, `stores/` for Pinia state, and `utils/` for cross-cutting helpers. Static assets belong in `public/`, while API glue code and server middleware reside in `server/`.

## Build, Test, and Development Commands
Install dependencies once with `npm install`. Start local dev on `http://localhost:3000` via `npm run dev`. Synchronise Contentful data before reviews with `npm run pull`, or bundle it into a static build using `npm run generate`. Create a production build with `npm run build` and smoke-test it locally with `npm run preview`. Run `npm run postinstall` only when regenerating Nuxt build artifacts in CI or after dependency upgrades.

## Coding Style & Naming Conventions
Use script setup and the Composition API for Vue files. Maintain two-space indentation, trailing semicolons only where required, and prefer single quotes in JavaScript. Name Vue components in `kebab-case` filenames (`bar-hero.vue`) and export composables and stores in camelCase (`useDevice`). Run linting with `npx eslint "./**/*.{js,ts,vue}"` after `npm run dev` or `npm run postinstall` so the generated `.nuxt/eslint.config.mjs` stays in sync.

## Testing Guidelines
Adopt `@nuxt/test-utils` with Vitest for unit and component coverage; place specs under `tests/` mirroring the source structure (`tests/components/bar-map-section.spec.ts`). Focus on covering data transforms in `contentful/` and Pinia stores. Execute test suites in watch mode with `npx nuxt test --watch` during development and `npx nuxt test run` in CI. When adding new endpoints under `server/`, include at least one integration spec that mounts the route and asserts response shape.

## Commit & Pull Request Guidelines
Keep commits small, imperative, and under 72 characters (`Fix map tooltip offset`). Reference issues in the body when relevant and group Contentful data updates separately from code changes. PRs should describe the problem, solution, and validation steps; add screenshots or screen recordings for UI updates and list any data-import prerequisites. Request review from a teammate familiar with the affected area and wait for status checks to pass before merging.

## Content & Configuration Tips
Required environment keys (`CONTENTFUL_SPACE`, `CONTENTFUL_ACCESS_TOKEN`) belong in `.env` and must never be committed. Regenerate cached datasets with `npm run pull` whenever Contentful entries change and include the refreshed files in your PR. Ignore transient artifacts in `.nuxt/` and `.output/`; they are rebuilt automatically.
