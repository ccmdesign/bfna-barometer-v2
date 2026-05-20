---
title: 'fix: BF-63 null-guard Directus getImage and skip custom infographics with missing files'
type: fix
status: active
created: 2026-05-19
ticket: BF-63
base_branch: dev
branch: feature/BF-63-fix-custom-infographic-broken-img
depth: standard
---

# fix: BF-63 — Null-guard Directus getImage; skip custom infographics with missing files

## Summary

After the Directus migration (merge commit `ead7f43`), the Barometer site renders custom infographic cards with three broken affordances — `<img>`, card link, and Download button — whenever a Directus webhook triggers a Netlify build before an infographic's `file` field is populated. Root cause: `directus/common.js#getImage(id)` returns `${BASE_URL}/assets/${id}` with no guard, so `file=undefined` produces `…/assets/undefined`, a hard 404 that the consuming component `components/customInfographic.vue` reuses verbatim for all three URLs.

This plan delivers a defense-in-depth fix at three layers:

1. **Helper layer** — `getImage` returns `null` for falsy/empty/non-UUID ids so consumers can branch on absence rather than receiving a poisoned string.
2. **Data-build layer** — `directus/topics.js` builds `customInfographicFile` as `null` (not `{ url: '', title: '' }`) when no file is attached, so the consumer has a single, unambiguous absence signal.
3. **Component layer** — `components/customInfographic.vue` renders an "incomplete" state (no `<img>`, no link wrap, no Download button) when the data signals absence.

Tests are added at the helper layer (the layer with the most pure unit-testable shape and the highest leverage). This work also bootstraps the Vitest test infrastructure that `AGENTS.md` mandates but is not yet wired in the repo.

## Problem Frame

**Trigger:** Directus webhook fires a Netlify build on every save in the Directus admin UI. When an editor creates a `barometer_custom_infographics` row, fills the title/description, and saves *before* attaching the asset file (or saves with file detached), the webhook fires immediately. The build pulls the row mid-edit; `infographic.file` is `undefined`.

**Confirmed L3 evidence (from triage):**
- `directus/common.js#getImage`: returns string-interpolated URL with no guard.
- `directus/topics.js` line 162: passes `infographic.file` directly into `getImage` — `undefined` → `"https://.../assets/undefined"`.
- `components/customInfographic.vue`: binds the same poisoned URL to `<img :src>`, `<NuxtLink :to>`, and the Download button's `:to`. All three 404.
- Contentful path (legacy) has a different (CDN URL-transform) fix in commit `55f1f1c` — confirmed not a true null-guard; the migration did not need to "port" anything because the same bug class was latent under Contentful too, just masked by an empty-string fallback.

**Scope of this PR:**
- Layered fix as described in Summary.
- New test scaffolding for `getImage` behavior (Vitest under `tests/`, mirroring `directus/common.js`).

**Out of scope (do not touch):**
- The Directus → Netlify webhook debounce (separate ticket).
- Any Contentful-path code (the legacy build path continues to work; do not break it).
- UI redesign of the infographic card beyond the absent/error state.
- Schema changes in Directus.
- Other `directus/*.js` files that do not call `getImage`.

---

## Assumptions

These bets were made without synchronous user confirmation. Flag any to revisit before implementation.

- **The plan applies on top of the migration merge.** The current branch `feature/BF-63-fix-custom-infographic-broken-img` was cut from `dev` *before* `ead7f43 Merge branch 'migration'` landed, so `directus/` does not yet exist on this branch. The implementer must either merge `dev` (or `origin/migration`) into this branch first, or rebase onto a point that includes the Directus files. Implementation cannot proceed against files that aren't on the branch.
- **`null` is preferable to `''` as the absence sentinel.** The migration code already uses an empty-string default (`{ url: '', title: '' }`) but the brief explicitly asks `getImage` to return `null`. `null` lets `v-if="data.customInfographicFile"` and `v-if="data.customInfographicFile?.url"` both work, and it's a stronger signal than truthy-but-empty `''`. The component renders nothing when either the wrapper object or its `url` is falsy — both checks survive.
- **The "skip card entirely" vs. "render incomplete state" choice resolves to "render nothing visible."** The brief says "don't render a broken card." The plan interprets this as: when `customInfographicFile` is null, the component returns nothing (empty template fragment / `v-if` on root) rather than rendering a title-only stub. Rationale: the parent topic page iterates infographics and is comfortable with absent entries; an empty card slot is less confusing than a title-with-no-image.
- **UUID-shape check is light.** "Non-UUID-shaped" is interpreted as: trim → reject if empty, reject if not roughly UUID-shaped (`/^[a-f0-9-]{8,}$/i` is sufficient — not strict RFC 4122). Goal is to catch `undefined`, `null`, `''`, `'null'`, `'undefined'` strings. Strict UUID validation is out of scope.
- **Vitest scaffolding is in scope** because `tests/` doesn't exist yet and `@nuxt/test-utils` is present but no `vitest` dep is declared. The plan adds the minimum: `vitest` devDep, a `vitest.config.ts`, an `npm test` script, and one spec file. AGENTS.md explicitly says specs go under `tests/` mirroring source — this aligns.

---

## Requirements

| ID | Requirement | Verified by |
|----|-------------|-------------|
| R1 | `getImage(id)` returns `null` when `id` is `undefined`, `null`, `''`, whitespace, or string `'undefined'`/`'null'`. | U1 + tests |
| R2 | `getImage(id)` returns `null` when `id` is non-UUID-shaped (does not match `/^[a-f0-9-]{8,}$/i` after trim). | U1 + tests |
| R3 | `getImage(id)` returns the assembled URL `${BASE_URL}/assets/${id}` for plausible UUIDs. | U1 + tests |
| R4 | `directus/topics.js` sets `customInfographicFile = null` when the source row has no usable `file` id. | U2 |
| R5 | `components/customInfographic.vue` renders nothing (no `<img>`, no link, no Download button) when `data.customInfographicFile` is null or its `url` is falsy. | U3 |
| R6 | Existing well-formed custom infographics continue to render with image + link + Download button unchanged. | U2, U3 (manual smoke) |
| R7 | The Contentful build path (`contentImporter.js` → `contentful/*.js`) continues to build without error. | U2 (no contentful file touched) |
| R8 | Vitest is wired so `npm test` (or equivalent) runs unit specs under `tests/`. | U4 |

---

## High-Level Technical Design

*This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

```
┌─────────────────────────────────────────────────────────────┐
│ Directus row (build-time pull)                              │
│   barometer_custom_infographics_id { title, description,    │
│                                       file: <uuid|null> }   │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
        ┌──────────────────────────┐
        │ directus/topics.js       │
        │ processInfographic(...)  │
        │  if customInfographic:   │
        │    url = getImage(file)  │  ← U1: returns null if bad
        │    if url == null:       │
        │      customInfographic-  │  ← U2: pass null through
        │       File = null        │
        │    else:                 │
        │      customInfographic-  │
        │       File = { url, ... }│
        └──────────┬───────────────┘
                   ↓
        ┌──────────────────────────┐
        │ topic JSON (.data/...)   │
        │ infographic.customInfo-  │
        │  graphicFile : null|obj  │
        └──────────┬───────────────┘
                   ↓
        ┌──────────────────────────┐
        │ customInfographic.vue    │
        │  v-if="data.customInfo-  │  ← U3: render nothing
        │   graphicFile?.url"      │     if absent
        │  → <img>, <NuxtLink>,    │
        │    <Download>            │
        └──────────────────────────┘
```

**Decision matrix — sentinel choice at each layer:**

| Layer | Absence sentinel | Why |
|---|---|---|
| `getImage()` | `null` | Pure helper; `null` is a clean "no result" signal distinguishable from `''`. |
| `customInfographicFile` field | `null` (whole object) | One check `v-if="data.customInfographicFile"` covers wrapper absence and field absence. |
| Component root | `v-if` on full card wrapper | Renders zero DOM; no half-card stub. |

---

## Key Technical Decisions

- **Null at every layer, not empty string.** Empty strings have caused bugs in JS templates before (`<img src="">` re-requests the current page in some browsers). `null` is unambiguous and `v-if` / `?.url` handle it cleanly.
- **Validation is light, not strict.** Goal is to catch the observed failure mode (`undefined`, empty, `'undefined'` strings). A strict RFC 4122 UUID regex would be over-engineering and could reject legitimate Directus ids if the format ever changes.
- **Skip the card entirely vs. show a title-only stub.** Chose "skip entirely" — see Assumptions. Editors save mid-edit knowingly; a missing card is the correct "not yet published" affordance and the build will run again on the next save.
- **Vitest scaffolding lives in this PR.** Splitting test infrastructure into a separate PR would leave R8 unverified and block adding tests for the actual fix. Keep it minimal: one config file, one devDep, one spec, one script.
- **Do not touch the Contentful build path.** R7 is a guardrail — the legacy fix already handles the empty case via `item.fields.file && item.fields.file.fields.file.url`, so no parallel change is needed.

---

## Implementation Units

### U1. Null-guard `getImage` in `directus/common.js`

**Goal:** Make `getImage` return `null` for any falsy/empty/non-UUID-shaped id so all consumers receive a clean absence signal.

**Requirements:** R1, R2, R3

**Dependencies:** None (this is the foundation).

**Files:**
- `directus/common.js` (modify `getImage`)

**Approach:**
- Trim input. Reject if empty, the literal strings `'undefined'` or `'null'`, or if it doesn't match a permissive UUID-ish regex (`/^[a-f0-9-]{8,}$/i`).
- On rejection: return `null`.
- On success: return the existing `${process.env.BASE_URL}/assets/${id}` string unchanged.
- Keep the function single-line-after-guard so the diff is small and the existing single call site at `directus/topics.js:162` does not need restructuring beyond the null-branch.

**Patterns to follow:** Other helpers in this file (e.g., `formatDate`) already pattern-match `if (!date) return '';` early-return guards. Mirror that style but return `null` per the decision above.

**Execution note:** Test-first. The function is pure; add the spec under `tests/directus/common.spec.js` before changing the source.

**Test scenarios** (file: `tests/directus/common.spec.js`, see U4 for scaffolding):
- Covers R1. `getImage(undefined)` returns `null`.
- Covers R1. `getImage(null)` returns `null`.
- Covers R1. `getImage('')` returns `null`.
- Covers R1. `getImage('   ')` returns `null` (whitespace-only).
- Covers R1. `getImage('undefined')` returns `null` (string form, the literal Netlify-build symptom).
- Covers R1. `getImage('null')` returns `null` (string form).
- Covers R2. `getImage('not a uuid')` returns `null` (contains space).
- Covers R2. `getImage('xyz')` returns `null` (too short).
- Covers R3. `getImage('a1b2c3d4-e5f6-7890-abcd-ef1234567890')` returns `${BASE_URL}/assets/a1b2c3d4-e5f6-7890-abcd-ef1234567890`. Stub `process.env.BASE_URL` via `vi.stubEnv` or direct assignment in `beforeEach`.
- Covers R3. `getImage` does not mutate the input id (e.g., does not lowercase or trim into the URL).

**Verification:** `npx vitest run tests/directus/common.spec.js` passes all scenarios. Manual: grep for `getImage(` in the repo — should still be one call site in `directus/topics.js`.

---

### U2. Skip null-file infographics in `directus/topics.js`

**Goal:** Stop emitting poisoned URLs into the topic JSON. When `getImage(file)` returns `null`, set `customInfographicFile = null` on the infographic object.

**Requirements:** R4, R6, R7

**Dependencies:** U1 (relies on the new null-return contract).

**Files:**
- `directus/topics.js` (modify the `processInfographic` function around lines 155-167, where `customInfographicFile` is initialized then conditionally populated)

**Approach:**
- Change the default initializer on the base `infographicObj` from `customInfographicFile: { url: '', title: '' }` to `customInfographicFile: null`. (The empty-string default was only ever consumed by the custom-infographic branch; other infographic types ignore it.)
- In the `if (type === 'customInfographic')` block, call `common.getImage(infographic.file)` once and capture the result. If `null`, leave `customInfographicFile` as `null`. If a string, build `{ url, title, description }` as today.
- Do **not** filter the infographic out of the topic's `infographics` array — leave it in place so the topic page can render its title-area context for other types if applicable. The component decides whether to render. (Cleaner separation of concerns; matches the brief's "let the component handle it" option.)

**Patterns to follow:** The existing branch already follows a "set defaults on base object, override in type-specific block" pattern (see how `scaleLimit` and `infographicValuesAsPercentage` are added in the `barChart` / `choroplethChart` blocks). Mirror it.

**Test scenarios:** None — this is glue between U1 and U3. The behavioral surface is exercised by U1 (helper-level) and U3 (presentational). Adding a `topics.js` integration spec would require mocking the Directus SDK and the `fs` writes for marginal value. **Test expectation: integration manual smoke — run `node ./contentImporter.js` (or the Directus equivalent build step) against a Directus instance with at least one custom infographic missing a file and confirm the generated JSON has `customInfographicFile: null` for that entry and `customInfographicFile: { url: "...", title: "..." }` for a well-formed one.**

**Verification:**
- `npx eslint "./**/*.{js,ts,vue}"` clean for `directus/topics.js`.
- The Contentful path build (`node ./contentImporter.js`) still completes without error — R7 guardrail. (Confirm by reading the file: no import or reference into the Contentful tree was added.)

---

### U3. Render nothing when `customInfographicFile` is absent in `components/customInfographic.vue`

**Goal:** Stop binding the poisoned URL to `<img>`, `<NuxtLink>`, and the Download button. Render zero DOM when `data.customInfographicFile` is null or its `url` is falsy.

**Requirements:** R5, R6

**Dependencies:** U2 (relies on the upstream `null` sentinel; defensive `?.url` check also catches legacy `{ url: '', title: '' }` shape if any pre-existing JSON survives).

**Files:**
- `components/customInfographic.vue` (modify the template; no script-block changes needed)

**Approach:**
- Wrap the root `<div class="subgrid">` (or add an inner `v-if`) with `v-if="data?.customInfographicFile?.url"`. This single check handles: wrapper missing, wrapper present but `url` falsy (`null`/`''`/`undefined`), and `data` itself missing.
- Defensive: also short-circuit reads (`data.customInfographicFile?.url` on the bindings) so a future regression in upstream data doesn't reintroduce the broken-image symptom.
- Keep the existing markup, scoped styles, and Composition API `<script setup>` shape unchanged.
- Do not add a "no image" placeholder, error state, or skeleton — the brief explicitly says "don't render a broken card," and Assumptions resolves to "render nothing visible."

**Patterns to follow:** Other infographic components in `components/` (e.g., `barInfographic.vue`, `treemapInfographic.vue`) use `v-if` on root-level conditions cleanly. Mirror that style.

**Test scenarios:** None automated in this PR. Component-level testing in this repo would require setting up `@vue/test-utils` + jsdom and is out of scope (Vitest scaffolding in U4 covers pure Node-side specs only). **Test expectation: manual smoke** — load a Netlify preview against a topic with (a) a well-formed custom infographic and (b) one with `customInfographicFile: null`. Confirm (a) renders image + link + Download; (b) renders nothing in that card slot, no console errors, no network 404 for `…/assets/undefined`.

**Verification:**
- `npx eslint "./**/*.{js,ts,vue}"` clean for `components/customInfographic.vue`.
- DevTools Network tab shows zero `…/assets/undefined` requests on the affected topic page.
- Light/dark modes both render correctly (per repo CLAUDE.md guidance — visual theme check after any UI touch).

---

### U4. Wire Vitest under `tests/` and add the helper spec

**Goal:** Stand up the minimum test scaffolding so the U1 spec runs locally and in CI. AGENTS.md mandates `Vitest under tests/` but the toolchain isn't installed yet.

**Requirements:** R8

**Dependencies:** None (can land in parallel with U1; the U1 spec lives under this scaffolding).

**Files:**
- `package.json` (add `vitest` devDep; add `"test": "vitest run"` and `"test:watch": "vitest"` scripts)
- `vitest.config.ts` (new — minimal config, node environment)
- `tests/directus/common.spec.js` (new — the U1 spec; lives here even though listed in U1's Files for clarity)
- `.gitignore` (verify `node_modules/.vitest` and coverage artifacts are ignored; usually already covered)

**Approach:**
- Install `vitest` as a devDependency at a version compatible with the repo's Node + `@nuxt/test-utils ^3.17.2` (Vitest ^1.x or ^2.x — let the implementer pick the latest compatible at install time).
- `vitest.config.ts` configures `environment: 'node'` (the U1 spec is pure helper code; no DOM needed), `include: ['tests/**/*.spec.{js,ts}']`, and `globals: false` (keep imports explicit per repo style — single quotes, two-space indent, no implicit globals).
- AGENTS.md cites `npx nuxt test` but Nuxt's test bridge requires more setup; the simpler `vitest run` path satisfies R8 without forcing a Nuxt test-context build for what is a pure helper. Note this trade-off in the PR description.

**Patterns to follow:** AGENTS.md says "specs under `tests/` mirroring the source structure (`tests/components/bar-map-section.spec.ts`)." So `directus/common.js` → `tests/directus/common.spec.js` (JS to match source).

**Execution note:** Land U4 before or alongside U1 so the U1 spec is immediately runnable. Do not commit U1's source change before the test infrastructure exists, or the spec won't execute in CI.

**Test scenarios** (this unit's own meta-test — confirms scaffolding works):
- Running `npm test` from a clean checkout (after `npm install`) executes `tests/directus/common.spec.js` and reports pass/fail. (No assertion to write — this is verified by U1's tests running and passing.)

**Verification:**
- `npm install` completes without error.
- `npm test` runs and reports passing specs (driven by U1).
- `npx eslint "./**/*.{js,ts,vue}"` does not regress (the new spec file lives under `tests/`; confirm eslint config doesn't reject the spec — adjust `eslint.config.mjs` if needed, though the default Nuxt eslint config tolerates `tests/` paths).

---

## Scope Boundaries

### In scope
- Null-guard `getImage`, null-default `customInfographicFile`, defensive rendering in `customInfographic.vue`, Vitest scaffolding + helper spec.

### Out of scope (per brief)
- Directus → Netlify webhook debounce.
- Contentful-path code (legacy; do not touch).
- UI redesign of the infographic card beyond absent/error state.
- Schema changes in Directus.

### Deferred to Follow-Up Work
- **Component-level Vitest specs for `customInfographic.vue`.** Would require `@vue/test-utils` + `@nuxt/test-utils` Nuxt bridge + jsdom. Worth doing in a future hardening pass once Vitest infrastructure is proven by U4.
- **Other potential `getImage` consumers.** Today there is one call site, but if future code grows additional consumers, they all benefit from the null-return contract. No proactive refactor needed now.
- **Linter/type rules to forbid `''` as an absence sentinel.** Cultural fix, not a single PR.

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Branch lacks the `directus/` files (was cut pre-migration). | High — confirmed by `git ls-tree HEAD directus/` returning empty. | Implementer merges `dev` (or rebases) before starting U1/U2. Document this in PR description. |
| `vitest` install pulls in a dep tree that conflicts with `@nuxt/test-utils`. | Low | Pin to the version range used by other Nuxt 3 projects on the team if conflicts arise; fall back to Nuxt's bundled Vitest if needed. |
| A topic page elsewhere assumes `customInfographicFile` is always an object (truthy default `{ url: '', title: '' }`). | Low — single component consumer confirmed by grep. | `v-if` on the component handles both legacy and new shapes. Add a grep in PR review: `customInfographicFile` references across the repo. |
| The "skip the card" UX is wrong and Sam/Courtney want a placeholder. | Low — brief explicitly says "don't render a broken card." | Easy follow-up if pushback: change `v-if` to render a `<div>` with title-only stub. |
| ESLint rejects new `tests/` paths or `vitest.config.ts`. | Low | Update `eslint.config.mjs` `ignores` if needed; `tests/` is conventional. |

---

## System-Wide Impact

- **Build pipeline:** No change to the Netlify build steps or `contentImporter.js`. The Directus build pulls Directus, processes, writes JSON — exactly as today, but with one extra `null` short-circuit.
- **Generated JSON shape:** `customInfographicFile` is now `null | { url, title, description }` instead of always-`{...}`. Any downstream consumer relying on `infographic.customInfographicFile.url` (vs `?.url`) would error. **Audit step in PR review:** grep `customInfographicFile` across the repo — confirmed today as a single consumer (`customInfographic.vue`).
- **Test infrastructure:** First Vitest spec in the repo. Establishes a pattern for future specs and unblocks AGENTS.md compliance. CI will need a `test` step added — call this out in PR description so Netlify or whichever CI runs `npm test`.
- **Contentful path:** Untouched. R7 guardrail.

---

## Open Questions / Decisions for the Implementer

1. **Should U2 also filter the infographic out of the `infographics[]` array?** The plan says "leave it in place; component renders nothing." Alternative: drop the entry entirely in `topics.js` so the topic page's `v-for` skips it. Either works; chose the current approach for cleaner separation. Implementer may flip this if a topic-level layout reason emerges (e.g., index/count bugs).
2. **UUID regex strictness.** Plan uses `/^[a-f0-9-]{8,}$/i`. If Directus ids ever include uppercase or other characters, adjust. Implementer should check one real Directus id at implementation time.
3. **CI wiring.** This plan adds the `npm test` script but does not modify the Netlify build / GitHub Action. If the team wants tests to run on PR (recommended), add `npm test` to the build command or a separate GH Action — call out in PR.
4. **Vitest version pinning.** Defer to the implementer at install time. Latest compatible with Node + `@nuxt/test-utils ^3.17.2` is fine.
5. **Spec file extension** — `.js` (matches source) or `.ts` (AGENTS.md example uses `.ts`). Either acceptable; plan uses `.js` to mirror the JS source file. Implementer may flip to `.ts` if other test files are added in TS soon.
