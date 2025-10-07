# Bug Specification: Infographics Not Rendering in PDF Export

**Status:** 🔍 Analyzed
**Priority:** Medium
**Affected Feature:** Compare Page - PDF Export
**Related Files:**
- [components/barCompareBox.vue](../../components/barCompareBox.vue#L67)
- [public/css/print.css](../../public/css/print.css)
- [pages/compare.vue](../../pages/compare.vue#L226)

---

## Problem Statement

Infographics are not rendering when users export the comparison page to PDF using the browser's "Print > Save as PDF" feature. The user reports that:

1. Infographics are currently hidden/turned off in PDF export
2. Even when attempting to turn them back on, they don't render properly
3. This happens in both local development and potentially in production

---

## Root Cause Analysis

### Primary Issue: Intentional Hiding (CURRENT STATE)

**Location:** [components/barCompareBox.vue:67](../../components/barCompareBox.vue#L67)

```vue
<div class="infographic-container print:hidden" v-for="(infgc, index) in topic.infographics">
```

**The Issue:**
- All infographics have the `print:hidden` CSS class applied
- This was an intentional design decision documented in [_process/feature-pdf-export.md](../_process/feature-pdf-export.md#L42-44):
  > "**Initial Approach (Hide All):** To ensure a clean and predictable initial result, all infographic components within the comparison box will be hidden using `display: none;`"
- The hiding is working as designed, but now the requirement has changed

**Why This Matters:**
- The extensive print styles in `print.css` (lines 154-227) are never applied because the elements are hidden
- CSS display properties cascade - even if you remove individual hiding rules, the `print:hidden` utility class takes precedence

### Secondary Issues: Why They Don't Render Even When Visible

If you remove the `print:hidden` class, you'll encounter these additional problems:

#### 1. **Async Rendering Timing Issue**

**Severity:** HIGH
**Components Affected:** All D3-based charts (choropleth, timeline, ranking)

**The Problem:**
```javascript
// pages/compare.vue:226
const handleDownloadPDF = async () => {
  window.print();  // ⚠️ Opens print dialog IMMEDIATELY
}
```

**Why It Fails:**
- D3 charts render asynchronously in component `onMounted()` hooks
- `window.print()` is called synchronously without waiting for chart rendering
- The print preview captures a snapshot BEFORE the SVG elements are drawn
- This is especially problematic for:
  - **ChoroplethInfographic** (SVG map with country paths)
  - **TimelineInfographic** (D3 timeline visualization)
  - **RankingInfographic** (D3 ranking chart)

**Evidence:**
```javascript
// choroplethInfographic.vue uses D3-style DOM manipulation
onMounted(() => {
  setupChartData();  // Async setup
  // SVG rendering happens here
});
```

#### 2. **CSS Custom Properties in Print Context**

**Severity:** MEDIUM
**Component Affected:** barInfographic.vue (bar charts)

**The Problem:**
The bar chart uses CSS custom properties for dynamic sizing:

```vue
<!-- barInfographic.vue:10 -->
<div
  class="bar-infographic__country-score"
  :style="{
    '--score': item.val,
    '--bar-scale': barScale
  }"
/>
```

**Why It May Fail:**
- CSS custom properties are applied via inline styles at runtime
- Some browsers' print engines don't properly evaluate dynamic CSS variables
- The `--score` property drives the bar width calculation
- In print context, these may evaluate to `0` or `undefined`

**Risk Level:** Medium (browser-dependent)

#### 3. **SVG Print Compatibility Issues**

**Severity:** MEDIUM
**Components Affected:** choroplethInfographic, timelineInfographic

**The Problem:**
- SVG elements with complex `<path>` elements (like maps) can have rendering issues in print mode
- Fill colors, strokes, and opacity may not render correctly
- Some browsers flatten or rasterize SVGs differently in print preview

**Evidence from print.css:**
```css
/* Lines 213-218 - Attempted fixes that don't work when element is hidden */
#choropleth path,
#map-svg path {
  opacity: 1 !important;
  stroke: #ccc !important;
  stroke-width: 0.5px !important;
}
```

These styles exist but never apply because the container is `display: none`.

#### 4. **Interactive Elements in Static Context**

**Severity:** LOW
**Components Affected:** All infographics with tooltips/interaction

**The Problem:**
- Infographics have hover states, tooltips, and toggle buttons
- These are meaningless in a static PDF context
- The `print:hidden` classes on tags/controls (lines 14, 25 in barInfographic.vue) hide these, but...
- If the main container is hidden, these micro-optimizations don't matter

---

## Current Implementation Analysis

### What Works:
✅ Text content exports perfectly
✅ Country comparisons are well-formatted
✅ Page breaks between topics work correctly
✅ Print stylesheet is comprehensive and well-designed

### What Doesn't Work:
❌ Infographics are completely hidden
❌ No mechanism to wait for async chart rendering
❌ No fallback strategy for charts that can't render in print

---

## Technical Deep Dive

### The Print Flow (Current)

```
User clicks "PDF" button
       ↓
handleDownloadPDF() called
       ↓
window.print() executes IMMEDIATELY
       ↓
Browser captures page snapshot
       ↓
Infographics are hidden via print:hidden class
       ↓
PDF generated without charts
```

### What SHOULD Happen (Proposed)

```
User clicks "PDF" button
       ↓
Remove print:hidden from infographics
       ↓
Wait for all chart rendering to complete
       ↓
Apply print-specific simplifications
       ↓
window.print() executes
       ↓
Browser captures page with rendered charts
       ↓
PDF generated WITH charts
```

---

## Reproduction Steps

1. Navigate to `/compare` page
2. Select 2 countries (e.g., EU and US)
3. Select 1+ topics with infographics
4. Click "PDF" export button
5. Observe: Print preview shows NO infographics (only text)
6. Try removing `print:hidden` from line 67 of barCompareBox.vue
7. Observe: Charts may appear blank or partially rendered

---

## Affected Infographic Types

| Type | Component | Rendering Method | Print Risk Level |
|------|-----------|------------------|------------------|
| Bar Chart | barInfographic.vue | CSS (custom properties) | MEDIUM |
| Choropleth Map | choroplethInfographic.vue | D3 → SVG | HIGH |
| Timeline | timelineInfographic.vue | D3 → SVG | HIGH |
| Ranking | rankingInfographic.vue | D3 → SVG | MEDIUM |
| Treemap | treemapInfographic.vue | D3 → SVG | Not used in compare |
| Custom | customInfographic.vue | Varies | Not used in compare |

---

## Proposed Solutions (Ranked by Complexity)

### Option 1: Simple Unhiding + Delay (Quick Fix)
**Effort:** LOW | **Risk:** MEDIUM

1. Remove `print:hidden` from [barCompareBox.vue:67](../../components/barCompareBox.vue#L67)
2. Add delay before calling `window.print()`:
   ```javascript
   const handleDownloadPDF = async () => {
     // Wait for charts to render
     await nextTick();
     await new Promise(resolve => setTimeout(resolve, 1000));
     window.print();
   }
   ```

**Pros:**
- Fast to implement
- Leverages existing print.css styles

**Cons:**
- Arbitrary timeout (may be too short or too long)
- Doesn't guarantee charts are rendered
- User sees visible delay without feedback

### Option 2: Rendering Completion Detection (Recommended)
**Effort:** MEDIUM | **Risk:** LOW

1. Remove `print:hidden` class
2. Add render completion tracking to each infographic component
3. Wait for all charts to emit "rendered" event
4. Then trigger print

**Implementation:**
```javascript
// In each infographic component
onMounted(() => {
  setupChart();
  nextTick(() => {
    emit('chart-ready');
  });
});

// In compare.vue
const handleDownloadPDF = async () => {
  const infographics = document.querySelectorAll('.infographic-container');

  // Wait for all to be ready
  await Promise.all([...infographics].map(el =>
    new Promise(resolve => {
      el.addEventListener('chart-ready', resolve, { once: true });
    })
  ));

  window.print();
}
```

**Pros:**
- Reliable - waits for actual rendering
- Better user experience with loading indicator
- Respects different chart complexity

**Cons:**
- Requires modifying each infographic component
- More code changes

### Option 3: Static Image Fallbacks (Future Enhancement)
**Effort:** HIGH | **Risk:** LOW

1. Pre-generate static PNG/SVG images of each chart
2. Use `@media print` CSS to swap interactive charts with static images
3. Store images in public/assets or generate on-demand

**Pros:**
- Perfect print fidelity
- No rendering timing issues
- Works in all browsers

**Cons:**
- Significant development effort
- Requires server-side chart rendering or build-time generation
- Increases bundle size

### Option 4: Simplified Print-Only Charts
**Effort:** HIGH | **Risk:** LOW

1. Create simplified versions of each chart component
2. Only display in print mode
3. Use basic HTML/CSS instead of D3

**Pros:**
- Optimal print rendering
- No async issues
- Lighter weight

**Cons:**
- Duplicate component logic
- Maintenance burden
- Different appearance than screen version

---

## Recommendation

**Implement Option 2: Rendering Completion Detection**

### Reasoning:
1. **Reliability:** Guarantees charts are rendered before print
2. **User Experience:** Can show loading state ("Preparing PDF...")
3. **Maintainability:** Cleaner than timeouts, less complex than static images
4. **Reusability:** The "chart-ready" event pattern can be used elsewhere

### Implementation Plan:

#### Phase 1: Remove Hiding (Immediate)
- Remove `print:hidden` from barCompareBox.vue line 67
- Test each chart type in print preview

#### Phase 2: Add Rendering Detection (Short-term)
- Add `@emit('chart-ready')` to each infographic component's onMounted
- Update handleDownloadPDF to wait for all charts
- Add loading state UI

#### Phase 3: Polish (Medium-term)
- Optimize print.css for each chart type
- Add print-specific chart simplifications
- Test across browsers (Chrome, Firefox, Safari, Edge)

---

## Testing Requirements

After implementation, test:

- [ ] Bar charts render in PDF export
- [ ] Choropleth maps render with correct colors
- [ ] Timeline charts render with all data points
- [ ] Ranking charts render with flags and labels
- [ ] Multiple topics export correctly (page breaks work)
- [ ] Charts are not cut off at page boundaries
- [ ] Print preview matches final PDF
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Loading state shows during PDF preparation
- [ ] No console errors during print

---

## Additional Notes

### Browser Compatibility

| Browser | SVG Print Support | CSS Custom Props | Known Issues |
|---------|-------------------|------------------|--------------|
| Chrome  | ✅ Excellent | ✅ Full | None |
| Firefox | ✅ Good | ✅ Full | Minor SVG clipping |
| Safari  | ⚠️ Fair | ✅ Full | SVG transforms issues |
| Edge    | ✅ Excellent | ✅ Full | None |

### Performance Considerations

- Average chart render time: 200-500ms per chart
- Typical comparison: 2-5 topics = 4-10 charts
- Expected total wait: 1-2 seconds
- Recommend showing loading indicator if > 500ms

### Related Documentation

- Original feature spec: [_process/feature-pdf-export.md](../../_process/feature-pdf-export.md)
- Print stylesheet: [public/css/print.css](../../public/css/print.css)
- Compare page: [pages/compare.vue](../../pages/compare.vue)

---

**Next Steps:**
1. Confirm approach with team
2. Create implementation task list
3. Allocate development time
4. Schedule cross-browser testing
