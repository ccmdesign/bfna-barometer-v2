# Dedupe title + description markup across v-if/v-else in customInfographic.vue

- **Severity:** P2 (should fix)
- **File:** `components/customInfographic.vue:8-29`

## Problem

The v-if and v-else branches duplicate the `<h3>{{ data.title }}</h3>` and
`<p>{{ data.infographicDescription }}</p>` markup, plus the `cluster` wrapper
and the `custom_infographic-card` shell. The only real difference between the
two branches is:

- v-if branch: wrapped in `<NuxtLink>` + has `<img>` + has `<bar-button>`
  Download
- v-else branch: no link, no img, replaces the download button with the
  empty-state `<div>`

If `data.title` styling, the `cluster` modifier, the `split-right` attribute,
or the inner-content class string ever changes, both branches have to be
updated in lockstep, and skew between them is invisible until someone opens the
broken-state card.

## Suggested fix

Render the card shell + title + description once, and only switch the
download-vs-empty-state slot via v-if. For example:

```html
<div class="custom_infographic-card__wrapper">
  <component
    :is="data.customInfographicFile?.url ? NuxtLinkComponent : 'div'"
    :to="data.customInfographicFile?.url || undefined"
    target="_blank">
    <div class="custom_infographic-card">
      <img
        v-if="data.customInfographicFile?.url"
        :src="data.customInfographicFile.url"
        :alt="data.title"
        class="custom_infographic-card__image"
        loading="lazy">
      <div class="custom_infographic-card__content | cluster">
        <div class="custom_infographic-card__content-inner | text-align:left" split-right>
          <h3>{{ data.title }}</h3>
          <p>{{ data.infographicDescription }}</p>
        </div>
        <bar-button
          v-if="data.customInfographicFile?.url"
          visual="primary" size="s" color="accent"
          :to="data.customInfographicFile.url" target="_blank">Download</bar-button>
        <div v-else class="empty-state">
          <p>No image available for this infographic.</p>
        </div>
      </div>
    </div>
  </component>
</div>
```

(Or alternatively keep the v-if/v-else but factor the inner-content block into
a sub-template / extract a tiny `<CustomInfographicHeader>` component.)

Either way: one source of truth for the title/description block. Re-run the
existing component spec — both assertions should still pass.

## Why it matters

Removes a quiet drift surface. Future copy or layout changes to the title block
won't silently miss the empty-state branch. Both component specs already cover
the v-if and v-else branches, so the refactor is safe.
