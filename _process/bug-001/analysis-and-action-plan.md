# Bug Analysis and Action Plan: "View Archived Topics" Filter Issues

**Last Updated:** 2025-10-07
**Codebase Commit:** `7b175c0 Video on mobile fix`
**Status:** ✅ Re-validated with latest code

## Analysis Summary

After thorough codebase analysis, I've identified the root causes and validated/updated the initial hypothesis. The analysis has been re-run on the latest codebase and all findings remain valid.

## Key Findings

### 1. SSR Disabled + Client-Side Data Loading Issues

**Critical Discovery:** The application has `ssr: false` in [nuxt.config.ts:144](../../nuxt.config.ts#L144), meaning this is a **client-only (SPA) application**.

**Implications:**
- All `useAsyncData` calls happen only on the client side
- First render is happening without hydrated data
- Race conditions occur between component mounting and data fetching
- The `watch` option on `useAsyncData` may not trigger properly on first client-side render

### 2. Root Cause Analysis by Issue

#### Issue 1: Home Page - Initial Click Failure
**Location:** [pages/index.vue:80-99](../../pages/index.vue#L80-99)

**Root Cause:**
1. The `filters` ref starts as an empty object `{}`
2. When `barTopicsSection` emits the filter event, it updates `filters.value`
3. However, the `useAsyncData` hook with `watch: [filters]` may not trigger properly because:
   - The initial query runs with `filters.value.archived = undefined`
   - The `archived` variable defaults to `false` via `typeof filters.value.archived === 'boolean' ? filters.value.archived : false`
   - When clicking "View Archived Topics", `filters.value.archived` changes from `undefined` → `true`, but the watcher might not detect this as a meaningful change on first mount
   - **The real issue:** The watcher is watching the `filters` ref itself, not its deep properties

**Evidence:**
```javascript
// pages/index.vue:77-78
const filters = ref({})

// The watch in useAsyncData
{ watch: [filters] }

// Should be watching the deep value:
{ watch: [filters], deep: true }
// OR watching specific filter properties
```

#### Issue 2: Home Page - Navigation State Bug
**Location:** [pages/index.vue](../../pages/index.vue) + [components/ds/ccmTabs.vue](../../components/ds/ccmTabs.vue)

**Root Cause:**
1. The `ccmTabs` component manages active tab state via query parameters at [ccmTabs.vue:81-97](../../components/ds/ccmTabs.vue#L81-97)
2. When navigating from Topics tab → Countries tab → clicking a country:
   - The tab state is stored in `route.query.activeTab`
   - Navigation to a country page (`/region/[slug]`) doesn't clear this query parameter
   - When returning or if the page attempts to restore state, the query parameter causes layout issues
3. **The real issue:** The `activeTab` query parameter persists across page navigation and may conflict with other page layouts

**Evidence:**
```javascript
// ccmTabs.vue:105-109
const setActiveTab = (index) => {
  if (index === activeTab.value || isLinkTab(props.tabs[index])) return
  activeTab.value = index;
  router.replace({ query: { ...route.query, activeTab: String(index) } })
}
```

The `activeTab` gets added to query params but isn't cleaned up on navigation away from the home page.

#### Issue 3: Country Page - Archived Topics Filter Unreliable
**Location:** [pages/region/[slug].vue:17-27](../../pages/region/[slug].vue#L17-27)

**Root Cause:**
1. The `showArchivedTopics` ref is initialized from query params at line 10: `const showArchivedTopics = ref(archived)`
2. The `useAsyncData` is called immediately with `watch: [showArchivedTopics]`
3. **The problem:** On first mount in SPA mode:
   - The initial `useAsyncData` query runs with the initial value
   - The watcher is set up, but may not be reactive on the very first toggle
   - Since this is SPA mode, the component mounts → data fetches → user clicks before data is ready
   - The first click toggles the ref, but the query may still be in flight from the initial load
4. **Additional issue:** The `handleActiveTopic()` is called in `onMounted` at line 123, but `topics.value` might still be loading, causing the function to work with undefined/incomplete data

**Evidence:**
```javascript
// pages/region/[slug].vue:8-27
const route = useRoute()
const archived = route.query?.archived === 'true'
const showArchivedTopics = ref(archived)

// useAsyncData runs immediately on mount
const { data: topics } = await useAsyncData('topics', () => {
  // query builder
}, { watch: [showArchivedTopics] })

// Later in onMounted
onMounted(() => {
  // This might run before topics.value is populated
  handleActiveTopic();
})
```

### 3. Updated Hypothesis

**Original Hypothesis:**
> The `useAsyncData` composable with `watch` option may have race conditions or timing issues during initial page load/hydration

**Updated & Validated Hypothesis:**
> The bugs are caused by multiple interconnected issues in a client-only (SPA) application:
>
> 1. **Shallow reactivity watching:** `useAsyncData` watchers are not configured for deep watching of object properties
> 2. **SPA race conditions:** Components mount and users interact before async data fetches complete
> 3. **Query parameter pollution:** Tab state persists in URL query params across navigation
> 4. **Initialization timing:** Functions depending on async data (`handleActiveTopic`) run before data is available

## Action Plan

### Phase 1: Fix Issue 1 (Home Page - Initial Click)

**File:** [pages/index.vue](../../pages/index.vue)

**Changes:**
1. Watch filter properties individually instead of the whole object
2. Add proper initialization for filters
3. Ensure the watcher triggers on first change

**Implementation:**
```javascript
// Option A: Watch individual filter properties
const filters = reactive({
  archived: false,
  tag: null,
  sort: 'DESC'
})

const { data: topics } = await useAsyncData('topics', () => {
  // query logic
}, {
  watch: [
    () => filters.archived,
    () => filters.tag,
    () => filters.sort
  ]
})

// Option B: Use immediate watch with refresh
const filters = ref({})
const { data: topics, refresh } = await useAsyncData('topics', () => {
  // query logic
})

const handleFilters = async (payload) => {
  filters.value = { ...filters.value, ...payload }
  await refresh()
}
```

### Phase 2: Fix Issue 3 (Country Page - Archived Filter)

**File:** [pages/region/[slug].vue](../../pages/region/[slug].vue)

**Changes:**
1. Ensure topics data is loaded before calling `handleActiveTopic()`
2. Use `refreshNuxtData` or explicit refresh when toggling archived
3. Add loading states to prevent interaction during data fetch

**Implementation:**
```javascript
// Use refresh pattern
const { data: topics, refresh: refreshTopics, pending } = await useAsyncData('topics', () => {
  // query logic
}, { watch: [showArchivedTopics] })

const handleArchivedTopics = async () => {
  showArchivedTopics.value = !showArchivedTopics.value;
  await refreshTopics()
}

onMounted(() => {
  // Ensure topics are loaded first
  if (topics.value && topics.value.length > 0) {
    const selected = topics.value.find(topic => topic.slug === route.query.topic)
    if (selected) {
      handleSelectedTopic(selected.topicId)
    }
    handleActiveTopic();
  }
})

// Also watch for topics to load
watch(topics, (newTopics) => {
  if (newTopics && newTopics.length > 0 && !activeTopic.value) {
    handleActiveTopic();
  }
}, { immediate: true })
```

### Phase 3: Fix Issue 2 (Navigation State Pollution)

**File:** [components/ds/ccmTabs.vue](../../components/ds/ccmTabs.vue)

**Changes:**
1. Clean up `activeTab` query param when navigating away from the page
2. Use page-specific query param names to avoid conflicts

**Implementation:**
```javascript
// Option A: Clear query param on unmount
onUnmounted(() => {
  const { activeTab, ...rest } = route.query
  if (activeTab !== undefined) {
    router.replace({ query: rest })
  }
})

// Option B: Use namespaced query params
const setActiveTab = (index) => {
  if (index === activeTab.value || isLinkTab(props.tabs[index])) return
  activeTab.value = index;
  // Use a namespaced param
  router.replace({ query: { ...route.query, homeActiveTab: String(index) } })
}
```

### Phase 4: Add Loading States (UX Improvement)

**Files:**
- [components/barTopicsSection.vue](../../components/barTopicsSection.vue)
- [pages/region/[slug].vue](../../pages/region/[slug].vue)

**Changes:**
1. Disable filter buttons while data is loading
2. Show visual feedback during data fetch

**Implementation:**
```javascript
// Expose pending state from useAsyncData
const { data: topics, pending } = await useAsyncData(...)

// In template
<bar-button
  :disabled="pending"
  @click="handleArchivedTopics"
>
  View Archived Topics
</bar-button>
```

## Priority Order

1. **High Priority:** Fix Issue 3 (Country Page) - Most reliable to fix, clearest UX impact
2. **High Priority:** Fix Issue 1 (Home Page Initial Click) - Core functionality
3. **Medium Priority:** Fix Issue 2 (Navigation State) - Less frequent but confusing when it happens
4. **Low Priority:** Add loading states - UX polish

## Testing Checklist

After implementation, test:

- [ ] Home page: Click "View Archived Topics" immediately on page load
- [ ] Home page: Toggle archived filter multiple times rapidly
- [ ] Home page: Navigate Topics → Countries → click country → check layout
- [ ] Home page: Navigate Topics → Countries → back to Topics → check filters still work
- [ ] Country page: Direct navigation to country page → click "View Archived Topics"
- [ ] Country page: Toggle archived filter multiple times
- [ ] Country page: Check if topics change when toggling archived
- [ ] All pages: Test with browser back/forward buttons
- [ ] All pages: Test with page refresh (Ctrl+R)

## Additional Recommendations

1. **Consider enabling SSR:** The `ssr: false` setting causes many of these issues. If possible, enable SSR for better initial load performance and data availability.

2. **Add error handling:** Currently no error states are shown if data fetching fails.

3. **Debounce filter changes:** If users toggle filters rapidly, debounce the API calls to prevent race conditions.

4. **Use Pinia stores for shared state:** The topics data is fetched multiple times across different pages. Consider using a Pinia store to cache and share this data.
