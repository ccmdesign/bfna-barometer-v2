# Declare `@vitejs/plugin-vue` as an explicit devDependency

- **Severity:** P2 (should fix)
- **Files:**
  - `vitest.config.ts:2` — `import vue from '@vitejs/plugin-vue'`
  - `package.json` (devDependencies block)

## Problem

`vitest.config.ts` imports `@vitejs/plugin-vue`, but the package is not listed
in `package.json`. Right now `npm ls @vitejs/plugin-vue` shows it is provided
transitively by `@nuxt/vite-builder@3.21.6`:

```
nuxt-app@
`-- @nuxt/vite-builder@3.21.6
  `-- @vitejs/plugin-vue@6.0.7
```

Relying on a hoisted transitive dep is fragile:

- If Nuxt bumps `@nuxt/vite-builder` and pins or removes that dep, `npm install`
  will still succeed and the app will still build — but `npm test` will fail with
  `Cannot find module '@vitejs/plugin-vue'`, which is a confusing failure mode
  (test infra breaks because of an unrelated Nuxt upgrade).
- pnpm with `strict-peer-dependencies` / hoist-off, or yarn PnP, would not
  resolve the transitive at all.

This is exactly the kind of thing that should be declared explicitly when we
own the consumer (the test config).

## Suggested fix

```bash
npm install --save-dev @vitejs/plugin-vue
```

Pin to a version that matches the currently-resolved one (`^6.0.7` is fine).
Re-run `npm test` to confirm it still passes.

## Why it matters

Defends `npm test` against unrelated Nuxt version churn. Costs one line in
`package.json` + one line in `package-lock.json`.
