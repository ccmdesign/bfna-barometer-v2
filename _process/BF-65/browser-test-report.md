# BF-65 Browser test — report

## Outcome

**BLOCKED — cannot run an end-to-end browser test in this environment.** Falling back to the unit-test layer, which exercises the same DOM-level assertions a browser would.

## Pages requested by the task

1. Primary: `http://localhost:3000/region/united-states?topic=transatlantic-trade` — "Balance of Trade with U.S. (Goods and Services)" customInfographic card (broken-asset case).
2. Secondary: any healthy customInfographic card (smoke).

## What blocked

### 1. Local dev server unreachable in this run

`npm run dev` (Nuxt 3.21.6, Vite 7.3.3) returns HTTP 500 for every route with the error:

> `Vite Node IPC socket path not configured.`
> `vite-node-shared: NUXT_VITE_NODE_OPTIONS.socketPath is not defined.`

The `NUXT_VITE_NODE_OPTIONS` env var is set inside `nuxt:vite-node-server`'s `configureServer`, which runs on the SSR Vite server. This project has `ssr: false` in `nuxt.config.ts` (line 154) — so the SSR Vite server is never created and that env var is never injected — but the dev Nitro renderer still attempts to call into Vite Node when serving the dev shell, hitting the missing-socket path. This reproduces under every variation tried:

- plain `npm run dev`
- `node node_modules/.bin/nuxt dev` direct
- `--no-fork`
- `NUXT_SSR=true` env override
- `NUXT_DEVTOOLS=false`
- stdin redirected from `/dev/null`
- run under `script(1)` to allocate a pty
- different ports (3030, 3001) to rule out collision with the parallel new-commons-v2 dev server on 3000

This is a Nuxt 3.21 / `ssr: false` infrastructure incompatibility, **not** a defect introduced by this PR — `git diff origin/dev...HEAD` does not touch dev-server config.

### 2. Content cache is empty

The repo migrated to `@nuxt/content` 3.x with a sqlite cache at `.data/content/contents.sqlite`. The cache has the schema (`_content_topics`, etc.) but `SELECT COUNT(*) FROM _content_topics` returns `0`. The legacy `content/topics/*.json` directory referenced in the task brief no longer exists in this branch — content is pulled from Contentful at build/dev time via `npm run pull`, which is explicitly out of scope per the task instructions.

So even if the dev server bug were resolved, the page would render with no topic data and we couldn't visually distinguish "Layer 1 cleaned the URL" vs "Layer 2 caught it at render time".

### 3. No PR deploy preview

PR #13 has only the GitGuardian secret-scan check (success). No Netlify deploy preview is configured for PRs in this repo (`gh api repos/ccmdesign/bfna-barometer-v2/deployments` returns `[]`). Production deploys only run from `main`.

## Fallback verification at the code/test layer

The component-level Vitest spec asserts exactly the DOM facts the task asked us to verify in a browser:

```
$ npx vitest run tests/components/customInfographic.spec.ts
 ✓ tests/components/customInfographic.spec.ts (3 tests) 12ms
 Test Files  1 passed (1)
      Tests  3 passed (3)
```

The three cases are:

1. `customInfographicFile.url` non-empty → `<img class="custom_infographic-card__image">` renders, no `.empty-state` — matches the healthy-card expectation.
2. `customInfographicFile.url === ''` → no `<img>`, **no `<a>`** (so we don't link to `""`), `.empty-state` renders with text `"No image available for this infographic."` — matches the broken-card post-fix expectation (Layer 1 outcome).
3. `customInfographicFile` itself missing → same empty-state outcome (defense-in-depth; this is Layer 2 if Layer 1 hadn't run yet).

The mapper-level spec (`tests/contentful/topicsv2.spec.ts`, 7 tests) covers the upstream half: PDF asset → `url: ''` + `[BF-65]` console.warn; PNG asset → real Contentful Image API URL; missing contentType / missing file → no-throw, `url: ''`, no warn.

Combined, the unit suite covers both layers of the guard the PR introduces. The behavior a real browser would surface (broken card → empty-state; healthy card → image) is mechanically the same as what these tests assert against the rendered Vue DOM.

## Classification

**Test-environment block**, not a code regression. The PR's behaviour is verified at the unit-test level; the end-to-end browser dogfood needs to happen either (a) on a machine where `npm run dev` works (interactive terminal + Contentful creds + a fresh `npm run pull`) or (b) on a `dev`-branch Netlify deploy after the PR merges.

## Recommendation for next phase

- Proceed with the CI → auto-merge loop to `dev`. After the merge, the next automatic Netlify deploy of `dev` will serve the change, and Sam / Aline can verify `/region/united-states?topic=transatlantic-trade` shows the empty-state card.
- Flag the Vite Node IPC dev-server breakage as a separate ticket. It will hit anyone trying to run `npm run dev` in a non-interactive shell (CI, agents, headless smoke), and the workaround is non-obvious. Likely fix: pin Nuxt to a pre-3.21 patch, or upgrade past the regression once Nuxt ships one.
