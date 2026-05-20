# BF-65 — customInfographic mimetype guard

## Problem

On `/region/united-states?topic=transatlantic-trade`, the "Balance of Trade with U.S. (Goods and Services)" customInfographic card renders a broken `<img>` because a PDF (`content-type: application/pdf`) was uploaded into Contentful's `file` field on a `customInfographic` entry. Browsers cannot render PDFs through `<img src>`, so the card shows a broken-image icon.

The content fix (Zac/Courtney swap the PDF for a PNG/JPG) is **out of scope**. This plan adds a code-side, defense-in-depth guard so a non-image file in this slot can never again produce a broken `<img>`.

## Investigation summary

- **CMS is Contentful, not Directus.** The ticket calls the asset host (`cms.bfna.org`) "Directus", but the import pipeline in this repo reads exclusively from Contentful via the `contentful` SDK (`contentful/main.js:5`). There is no Directus client, no `cms.bfna.org` reference, and the Contentful Image API query string (`?w=2000&fm=webp&q=80&fit=fill`) is appended to every asset URL in `contentful/main.js:372-377` (`getImageAssetUrl`). The `cms.bfna.org` host in the bug ticket is unrelated to how content actually reaches this app — the ground truth is whatever Contentful returns. If a PDF asset is also reachable as a Contentful asset, the broken card means Contentful itself is serving that asset.
- **The data path** for a customInfographic image is:
  1. Build-time pull: `npm run pull` runs `contentImporter.js`, which calls `contentful/topicsv2.js` (the active mapper — `topics.js` is the older variant not wired into `contentImporter.js`).
  2. `getTopics()` in `contentful/topicsv2.js` maps each topic's `fields.infographics`. For a `customInfographic` linked entry, the relevant write is at `contentful/topicsv2.js:176-179`:
     ```js
     customInfographicFile: {
       url: item.fields && item.fields.file && item.fields.file ? main.getImageAssetUrl(item.fields.file.fields.file.url) : '',
       title: item.fields && item.fields.file && item.fields.file.fields ? item.fields.file.fields.title : ''
     }
     ```
  3. The mapped topic is serialized to `content/topics/<slug>.json` by `main.writeContent` and read by `@nuxt/content` (`content.config.ts`) into the page (`pages/region/[slug].vue:84-117`), passed to `<custom-infographic :data="infgc" />` (line 229).
  4. `components/customInfographic.vue:8` renders `<img :src="data.customInfographicFile.url" ...>`.
- **Mimetype is available at import time.** Contentful's Asset shape includes `item.fields.file.fields.file.contentType` (e.g. `image/png`, `application/pdf`) alongside `url`. The current mapper drops it.
- **No existing placeholder/empty-state component** dedicated to customInfographic. There is a small precedent pattern in `components/barCompareBox.vue:97-101`:
  ```html
  <div class="empty-state"><p>No data available for this country.</p></div>
  ```
  We will reuse that simple inline pattern — no new shared component.
- **Render site of broken image is the only render site.** `customInfographic` is rendered only from `pages/region/[slug].vue:229`. The component itself is the only place the `url` becomes an `<img src>`. Other consumers of `infographicType === 'customInfographic'` (`barCompareBox.vue:40, 107`, `utils/csv.js:122`, `pages/region/[slug].vue:85`) skip it explicitly — they never render the image.
- **No `tests/` directory exists yet.** AGENTS.md prescribes `@nuxt/test-utils` + Vitest. `@nuxt/test-utils` is already in `package.json`. We will create the `tests/` directory with two specs and a `vitest` invocation note in the plan; we will not add a CI step in this change.

## Design

A two-layer guard, kept small:

### Layer 1 (primary): reject non-image files at import time

In `contentful/topicsv2.js`, when mapping `customInfographicFile`, inspect `item.fields.file.fields.file.contentType` and reject anything that is not an image.

- **Allowlist of image content-types** (explicit, not a `startsWith('image/')` regex — we want to be deliberate about what we accept and ignore exotic types):
  - `image/png`
  - `image/jpeg`
  - `image/webp`
  - `image/gif`
  - `image/svg+xml`
- If `contentType` is missing or not in the allowlist, emit:
  ```js
  customInfographicFile: { url: '', title: '<original title or ''>' }
  ```
  (an empty `url` is exactly the same shape the mapper already emits when `item.fields.file` is missing, so downstream components already handle it as "no asset").
- Add a single `console.warn` on rejection that includes `infographicId`, the topic id, and the rejected content-type, so future bad uploads surface in the `npm run pull` log.
- Do **not** swap the URL or generate any placeholder URL; the empty string is the signal.

Why import-time, not render-time: the page is pre-rendered via `nuxt generate` from cached JSON in `content/topics/*.json`. Sniffing at render time would require a runtime HEAD request per card, which is wasteful when we already have the authoritative `contentType` at pull time. Render-time is also the wrong layer because the bug is "bad data made it into the cache," and the cache is what we own.

### Layer 2 (defensive): fall back in the component if `url` is empty

In `components/customInfographic.vue`, guard the `<img>` with a check on `data.customInfographicFile?.url`. If empty:
- Render the existing empty-state pattern (`<div class="empty-state"><p>No image available for this infographic.</p></div>`).
- The wrapping `<NuxtLink :to="...">` and the Download button are also gated, so we don't render a link pointing to `""`.

This second layer is cheap (a single `v-if`) and protects against:
- Pre-existing `content/topics/*.json` files (from older pulls) that have a PDF URL already baked in but the cache hasn't been re-pulled yet.
- Any future code path that bypasses the mapper.

### What "non-image asset" means in code

Allowlist of Contentful asset `contentType` strings (see Layer 1 above). Not a URL-extension check — extensions on Contentful URLs are not always present and not authoritative. Not a runtime HEAD request — needless network at SSR/SSG time. Not a generic `startsWith('image/')` — explicit allowlist is easier to reason about and excludes oddities like `image/x-icon` we don't need.

### Fallback rendering

Reuse the inline `.empty-state` pattern from `barCompareBox.vue` (lines 98-100). No new component, no new SCSS file. Add a short scoped `.empty-state` style in `customInfographic.vue` matching the existing visual treatment (muted text, padding) — or just rely on global typography. The message: "No image available for this infographic." (UX copy is intentionally bland — this is a defense-in-depth state that should rarely fire in production.)

## Implementation steps

1. **`contentful/topicsv2.js`** — at the top, add a small constant and helper:
   ```js
   const ALLOWED_IMAGE_CONTENT_TYPES = new Set([
     'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'
   ]);
   const isAllowedImageAsset = (file) => {
     const ct = file && file.fields && file.fields.file && file.fields.file.contentType;
     return typeof ct === 'string' && ALLOWED_IMAGE_CONTENT_TYPES.has(ct.toLowerCase());
   };
   ```
   Then change the `customInfographicFile` block (around line 176) to:
   ```js
   customInfographicFile: (() => {
     const file = item.fields && item.fields.file;
     if (file && isAllowedImageAsset(file)) {
       return {
         url: main.getImageAssetUrl(file.fields.file.url),
         title: file.fields.title || ''
       };
     }
     if (file) {
       console.warn(
         `[BF-65] Rejecting non-image customInfographic asset for infographic ${item.sys.id}: contentType=${file.fields && file.fields.file && file.fields.file.contentType}`
       );
     }
     return { url: '', title: (file && file.fields && file.fields.title) || '' };
   })()
   ```
2. **`components/customInfographic.vue`** — wrap the existing markup:
   ```html
   <template>
     <div class="subgrid">
       <div class="custom_infographic-card__wrapper">
         <template v-if="data.customInfographicFile?.url">
           <!-- existing NuxtLink + img + content block, unchanged -->
         </template>
         <template v-else>
           <div class="custom_infographic-card">
             <div class="custom_infographic-card__content | cluster">
               <div class="custom_infographic-card__content-inner | text-align:left" split-right>
                 <h3>{{ data.title }}</h3>
                 <p>{{ data.infographicDescription }}</p>
               </div>
               <div class="empty-state"><p>No image available for this infographic.</p></div>
             </div>
           </div>
         </template>
       </div>
     </div>
   </template>
   ```
   Keep the existing `<style scoped>` block; optionally add `.empty-state { color: var(--base-color-50-tint); padding: var(--space-m); }` if not inherited.
3. **`tests/contentful/topicsv2.spec.ts`** — unit test the helper. Two cases minimum:
   - Given a mocked `item` with `file.fields.file.contentType = 'application/pdf'`, the mapper output sets `customInfographicFile.url === ''`.
   - Given the same shape with `contentType = 'image/png'`, the output sets `url` to the transformed URL (with the Contentful Image API query string).
   Extract `isAllowedImageAsset` to be exportable so it can be tested in isolation, or test through the mapper if extraction is too invasive.
4. **`tests/components/customInfographic.spec.ts`** — component test using `@nuxt/test-utils` + `mountSuspended`:
   - When `data.customInfographicFile.url` is non-empty, assert an `<img>` is rendered.
   - When `data.customInfographicFile.url === ''`, assert no `<img>`, no `<a>`/`<NuxtLink>`, and the empty-state message is visible.
5. **No data re-pull required in the same PR.** The cached `content/topics/*.json` will get re-cleaned the next time `npm run pull` is run. Layer 2 protects the user in the meantime. Mention this explicitly in the PR description so the reviewer doesn't expect a content delta in the diff.

## Out of scope (do not touch)

- The broken Contentful/Directus asset itself. Content team owns the swap.
- The legacy mapper `contentful/topics.js` (not wired into `contentImporter.js`).
- Image-source handling for any other component (`barHero`, `barTopicCard`, choropleth/treemap/timeline/ranking infographics, etc.). No generalized image guard.
- The `getImageAssetUrl` URL transform in `contentful/main.js`. It already correctly no-ops for SVG (the Contentful Image API ignores `fm=webp` for SVG and serves the original), but if SVG turns out to be problematic we revisit in a follow-up — not here.
- BF-63 / PR #10. Per user's global CLAUDE.md, untouched.

## Open questions for the implementer

1. **SVG inclusion in the allowlist** — Contentful Image API serves SVGs as PNG/WebP when `?fm=webp` is in the URL, but the original SVG can be rendered as `<img>` directly. Including `image/svg+xml` is the safe default; if there's an internal stance against rendering raw SVGs from CMS uploads (XSS concern), drop it from the allowlist. Default: include it.
2. **Console-warn vs silent in production builds** — `console.warn` runs at build time during `npm run pull`. That's almost certainly what we want (visible in CI logs). If the team wants it suppressed in `nuxt generate` runs that don't re-pull, we can gate it on `process.env.NODE_ENV !== 'production'`, but I'd default to leaving it loud. Default: leave it.

## Critical files

- `contentful/topicsv2.js` (primary guard)
- `components/customInfographic.vue` (fallback render)
- `contentful/main.js` (reference: `getImageAssetUrl`)
- `components/barCompareBox.vue` (reference: `.empty-state` pattern)
- `content.config.ts` (schema for cached JSON)
