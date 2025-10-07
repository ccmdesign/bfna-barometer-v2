# Bug Report: "View Archived Topics" Filter Issues

## Issue 1: Home Page - Initial Click Failure

**Location:** [pages/index.vue](../pages/index.vue)

- **Symptom:** When clicking "View Archived Topics" immediately after opening the site, the filter often doesn't work on the first click
- **Expected:** Filter should toggle archived topics immediately on first click
- **Actual:** Requires page reload to work properly
- **Technical Detail:** The `barTopicsSection` component at [components/barTopicsSection.vue:38-43](../components/barTopicsSection.vue#L38-43) emits a filter event, but the parent's `useAsyncData` hook at [pages/index.vue:80-99](../pages/index.vue#L80-99) may not be properly initialized on first render

## Issue 2: Home Page - Navigation State Bug

**Location:** [pages/index.vue](../pages/index.vue)

- **Symptom:** After navigating from Topics tab → Countries tab → clicking a country, the page displays incorrectly
- **Expected:** Country page should display normally
- **Actual:** Page layout is broken (requires page reload to fix)
- **Technical Detail:** Likely related to tab navigation state management in the ccm-tabs component at [pages/index.vue:7-17](../pages/index.vue#L7-17) not properly resetting when navigating away

## Issue 3: Country Page - Archived Topics Filter Unreliable

**Location:** [pages/region/[slug].vue](../pages/region/[slug].vue)

- **Symptom:** When entering a country page directly and clicking "View Archived Topics" at [pages/region/[slug].vue:150](../pages/region/[slug].vue#L150), the filter doesn't always work until page reload
- **Expected:** Filter should toggle archived/active topics immediately
- **Actual:** Filter is unreliable on first click, works after reload
- **Technical Details:**
  - The `showArchivedTopics` ref is initialized from query params at [pages/region/[slug].vue:8-10](../pages/region/[slug].vue#L8-10)
  - The `useAsyncData` hook at [pages/region/[slug].vue:17-27](../pages/region/[slug].vue#L17-27) watches `showArchivedTopics`
  - The toggle handler at [pages/region/[slug].vue:98-100](../pages/region/[slug].vue#L98-100) just flips the boolean
  - The watcher may not be triggering the query refetch properly on first mount

## Root Cause Hypothesis

The `useAsyncData` composable with `watch` option may have race conditions or timing issues during initial page load/hydration, causing the reactive updates to fail until a full page reload re-initializes the state properly.

## Video Reference

https://www.loom.com/share/18aa2c05fd324d4b980c401243a0f81f
