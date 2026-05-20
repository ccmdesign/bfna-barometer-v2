# BF-63 review residuals

Residual non-auto findings emitted by `/ce:review mode:autofix` against PR #10.
Plan: `docs/plans/2026-05-19-001-fix-bf63-null-guard-directus-getimage-plan.md`.

All findings are P3 / advisory. No P0, P1, or P2 findings. No `safe_auto` fixes
were applied in-place — the diff is small, well-shaped, and matches the plan's
R1-R8 and U1-U4 exactly.

## Resolution summary (2026-05-19)

All findings triaged. No code changes required — `tests/setup-env.js` already
carries the explanatory header comment that the orchestrator suggested adding,
and the remaining residuals are intentional/advisory per the plan.

| Finding | Status   | Reason |
|---------|----------|--------|
| R-1     | resolved (ack, no code change) | Theoretical only; Directus never emits whitespace-padded ids. Changing to `trimmed` would silently alter behavior for any padded-id caller and would break the existing "does not mutate the id" passthrough test. Revisit only if a real regression surfaces. |
| R-2     | resolved (ack, no code change) | Defense-in-depth against the legacy `{url:'',title:''}` shape still emitted by the Contentful path. Plan U3 mandates the optional chaining; cost is zero. Drop only after Contentful path is retired. |
| R-3     | resolved (ack, no code change) | Contentful builders still emit the legacy `{url:'',title:''}` shape, but the new component v-if treats empty `url` as falsy and renders nothing. Out of scope per plan R7; track separately when Contentful path is decommissioned. |
| R-4 / F-4 | deferred (follow-up) | Component-level Vitest spec for `customInfographic.vue` needs `@vue/test-utils` + jsdom + Nuxt test bridge setup. Plan explicitly defers this. Create a follow-up ticket when test bridge is stood up. |

Verification: `npm test` → still 12/12 passing on this branch (no code touched).

## R-1: trim-vs-raw inconsistency in `directus/common.js#getImage`

- **Status:** resolved — acknowledged, no code change (2026-05-19)
- **Severity:** P3
- **Class:** advisory (theoretical, no observed call site triggers it)
- **File:** `directus/common.js:31-35`
- **Symptom:** validation runs on `trimmed` but the URL is built from the raw
  `imageId`. A whitespace-padded but otherwise valid UUID (e.g. `" a1b2c3d4-…"`)
  would pass the regex (which only sees `trimmed`) and produce
  `${BASE_URL}/assets/ a1b2c3d4-…` with leading whitespace in the URL.
- **Why it's not a blocker:** Directus does not return ids with whitespace; the
  single call site (`directus/topics.js:162`) passes `infographic.file` straight
  from the API payload. The existing test in `tests/directus/common.spec.js`
  ("does not mutate the id (no lowercase, no trim into the URL)") asserts the
  raw-id passthrough behavior is intentional. Switching to `trimmed` would
  silently change the URL for any caller that ever passed a padded id; that's a
  behavior change, not an obvious-correct fix. Leave as-is unless a future
  failure mode appears.
- **If revisited:** either (a) interpolate `trimmed` and update the no-mutation
  test, or (b) add an explicit assertion that `imageId === trimmed` after
  validation and reject otherwise. Pick (a) only if a real Directus regression
  shows up.

## R-2: redundant optional chaining on bindings inside the v-if

- **Status:** resolved — acknowledged, no code change (2026-05-19)
- **Severity:** P3
- **Class:** advisory (style / defense-in-depth tradeoff)
- **File:** `components/customInfographic.vue:5, 8, 14`
- **Symptom:** the root `<div>` is gated by `v-if="data?.customInfographicFile?.url"`,
  so inside the conditional `data.customInfographicFile.url` is always a
  non-empty string. The bindings still use `data.customInfographicFile?.url`
  for `<NuxtLink :to>`, `<img :src>`, and `<bar-button :to>`.
- **Why it's not a blocker:** Plan U3 (line 213) explicitly mandates the
  defensive chaining as belt-and-braces against legacy `{url:'',title:''}`
  shapes that the Contentful path (`contentful/topics.js:139`,
  `contentful/topicsv2.js:178`) still emits. The Contentful path is not
  exercised on the Directus-driven build but the safety margin costs nothing.
- **If revisited:** drop the `?.` from lines 5, 8, 14 only once the Contentful
  build path is fully retired and `customInfographicFile` is guaranteed to be
  either `null` or `{ url: <string>, … }`.

## R-3: Contentful build path still writes legacy `{url:'',title:''}` shape

- **Status:** resolved — acknowledged, no code change (2026-05-19; out of scope per plan R7)
- **Note on `tests/setup-env.js` nit:** Orchestrator flagged a possible missing
  header comment explaining why `BASE_URL` is stubbed. Verified the file
  already contains a 3-line header comment (lines 1–3) explaining that
  `directus/common.js` calls `createDirectus(process.env.BASE_URL)` at import
  time and would throw "Invalid URL" without the stub. No code change needed.
- **Severity:** P3
- **Class:** advisory (out of scope per R7 guardrail)
- **Files:** `contentful/topics.js:139-142`, `contentful/topicsv2.js:178-181`
- **Symptom:** Both Contentful builders still emit
  `customInfographicFile: { url: '', title: '' }` when the asset is missing.
  The new component v-if handles empty-string `url` correctly (falsy → renders
  nothing), so this is not a live bug.
- **Why it's not a blocker:** Plan R7 forbids touching the Contentful path in
  this PR; production is driven by the Directus path post-migration. The
  defensive optional chaining (R-2 above) exists to absorb this shape.
- **If revisited:** when the Contentful path is officially decommissioned,
  align both builders to emit `null` and drop the optional chaining in the
  component. Track separately from BF-63.

## R-4: deferred — component-level Vitest spec for `customInfographic.vue`

- **Status:** deferred — follow-up ticket required (2026-05-19)
- **Severity:** P3
- **Class:** testing-gap (acknowledged in plan)
- **Plan section:** "Deferred to Follow-Up Work" line 273.
- **Symptom:** U3 (component render-nothing behavior) is only verified by
  manual smoke; no automated regression covers it.
- **Why it's not a blocker:** plan explicitly defers this — requires
  `@vue/test-utils` + jsdom + Nuxt test bridge.
- **If revisited:** stand up `@vue/test-utils` and write
  `tests/components/customInfographic.spec.js` covering: null
  `customInfographicFile`, empty-string `url`, and well-formed payload.

## Context — not in scope here

- **ESLint baseline broken on `main`.** `eslint.config.mjs` imports from
  `.nuxt/eslint.config.mjs`, which is only generated when `@nuxt/eslint` is
  registered in `nuxt.config.ts`. It isn't, so `npm run lint` errors on `main`
  too. Out of scope per task instructions; mentioned for orchestrator context
  only.

## Verification recap

- `npm test` → 12/12 passing on the branch.
- `.gitignore` unchanged vs base `ead7f43` (scope discipline preserved).
- `docs/` is gitignored; the plan file was force-added per repo convention.
- `todos/` is **not** gitignored; this file is committable without `-f`.
- All `customInfographicFile` reads outside the touched files use optional
  chaining or are write-only Contentful emit sites — no broken consumer.
