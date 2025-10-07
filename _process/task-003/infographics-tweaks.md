# Task: Fix Infographic Page Overflow in PDF Print

## Problem Statement

When exporting the comparison page to PDF, some infographics render taller than a single page (taller than ~247mm of printable area on A4 with 15mm margins). This causes the infographic to span across page breaks, resulting in:

- **Visual fragmentation**: Charts split awkwardly across two pages
- **Loss of context**: Titles/legends separated from chart body
- **Inconsistent spacing**: Page break creates unintended gaps
- **Poor user experience**: Charts become harder to read and interpret

### Affected Infographic Types

Based on codebase analysis, the following infographics can overflow:

| Infographic Type | Component | Root Cause | Overflow Risk |
|-----------------|-----------|------------|---------------|
| **Timeline** | [timelineInfographic.vue](../../components/timelineInfographic.vue) | Dynamic height based on event count + text wrapping (line 113-126) | **HIGH** - No height limit, grows with data |
| **Ranking** | [rankingInfographic.vue](../../components/rankingInfographic.vue) | Fixed 600px height on desktop (line 182) | **MEDIUM** - Could overflow on small paper sizes |
| **Choropleth** | choroplethInfographic.vue | SVG map with dynamic scaling | **MEDIUM** - Large maps can exceed page bounds |
| **Bar Chart** | [barInfographic.vue](../../components/barInfographic.vue) | `aspect-ratio: 16/6` (line 120) | **LOW** - Constrained aspect ratio |

### Current Print CSS Behavior

From [print.css:154-171](../../public/css/print.css#L154-171):

```css
.infographic-container {
  page-break-inside: avoid;  /* ⚠️ Prevents splitting but causes overflow */
  break-inside: avoid;
  max-width: 100%;
  overflow: hidden;
}

.infographic-container > div,
.bar-infographic__chart-wrapper,
.timeline-infographic__chart-wrapper,
.ranking-infographic__chart-wrapper,
#choropleth {
  max-width: 100%;
  transform-origin: top left;  /* ✅ Good for scaling */
  overflow: visible;
}
```

**The Issue**: `page-break-inside: avoid` tells the browser "never split this element", but if the element is taller than the page, the browser has two bad options:
1. Overflow the content off the page (content gets cut off)
2. Scale the entire page down (makes everything tiny)

---

## Proposed Solution: Dynamic Scaling for Oversized Infographics

### Approach

Apply CSS `transform: scale()` to infographics that exceed the maximum printable height (~700px safe limit for A4 with margins and surrounding content).

### Implementation Strategy

#### Option A: Pure CSS (Recommended)

Use `@container` queries or fixed max-height with scale transform:

```css
@media print {
  .infographic-container {
    max-height: 700px; /* Safe limit for A4 page */
    overflow: visible; /* Allow scaled content to be visible */
    page-break-inside: avoid;
  }

  /* Timeline - highest risk of overflow */
  .timeline-infographic__chart-wrapper {
    max-height: 600px;
    transform-origin: top center;
  }

  /* If content exceeds max-height, scale it down */
  @supports (container-type: size) {
    .infographic-container {
      container-type: size;
    }

    @container (height > 700px) {
      .infographic-container > * {
        transform: scale(calc(700 / 100cqh));
      }
    }
  }

  /* Fallback: Fixed scale for known problematic charts */
  .timeline-infographic__chart-wrapper:has(.timeline li:nth-child(8)) {
    /* If timeline has 8+ items, scale down */
    transform: scale(0.85);
  }
}
```

**Pros:**
- No JavaScript required
- Works during print preview
- Browser-native solution
- Maintains `page-break-inside: avoid`

**Cons:**
- Container queries have limited browser support in print mode
- May need fallback for older browsers
- Fixed thresholds might not be perfect for all data

#### Option B: JavaScript Pre-Print Scaling

Measure each infographic before printing and apply dynamic scale:

```javascript
// In pages/compare.vue or new composable
const scaleInfographicsForPrint = () => {
  const MAX_PRINT_HEIGHT = 700; // pixels
  const infographics = document.querySelectorAll('.infographic-container');

  infographics.forEach(container => {
    const actualHeight = container.scrollHeight;
    if (actualHeight > MAX_PRINT_HEIGHT) {
      const scale = MAX_PRINT_HEIGHT / actualHeight;
      const wrapper = container.querySelector('[class*="__chart-wrapper"]');
      if (wrapper) {
        wrapper.style.transform = `scale(${scale})`;
        wrapper.style.transformOrigin = 'top center';
        // Adjust container height to prevent extra space
        container.style.height = `${MAX_PRINT_HEIGHT}px`;
      }
    }
  });
};

const handleDownloadPDF = async () => {
  // Wait for charts to render (already implemented)
  await waitForAllChartsReady();

  // Scale oversized charts
  scaleInfographicsForPrint();

  // Small delay to let transforms apply
  await nextTick();

  window.print();
};
```

**Pros:**
- Precise measurements per infographic
- Works in all browsers
- Can log/debug which charts get scaled
- Easy to adjust thresholds

**Cons:**
- Requires JavaScript execution before print
- More complex implementation
- Needs testing across browsers

---

## Recommended Implementation: Hybrid Approach

Combine CSS and JavaScript for best results:

### Phase 1: CSS Safety Net (Immediate)

Add to [print.css](../../public/css/print.css):

```css
@media print {
  /* Ensure infographics never exceed page height */
  .infographic-container {
    max-height: 720px; /* Slightly larger than safe zone */
    overflow: visible;
    position: relative;
  }

  /* Timeline is the main culprit - constrain and center */
  .timeline-infographic__chart-wrapper {
    max-height: 600px !important;
    transform-origin: top center;
  }

  /* If timeline is too tall, scale it */
  .timeline-infographic__chart-wrapper .timeline {
    max-height: 560px; /* Account for padding */
  }

  /* Scale down if content would overflow */
  @supports (max-height: fit-content) {
    .infographic-container:has(.timeline) {
      /* Scale entire timeline container if needed */
      transform: scale(min(1, calc(600px / var(--actual-height, 600px))));
      transform-origin: top center;
    }
  }
}
```

### Phase 2: JavaScript Enhancement (Next)

Add smart scaling to existing chart-ready system in [barCompareBox.vue](../../components/barCompareBox.vue#L53-59):

```javascript
const handleChartReady = () => {
  chartsReady.value++
  if (chartsReady.value >= totalCharts.value) {
    emit('all-charts-ready')
    // NEW: Check and scale oversized charts
    nextTick(() => scaleOversizedInfographics())
  }
}

const scaleOversizedInfographics = () => {
  const MAX_HEIGHT = 700;
  document.querySelectorAll('.infographic-container').forEach(container => {
    const height = container.scrollHeight;
    if (height > MAX_HEIGHT) {
      const scale = (MAX_HEIGHT / height).toFixed(3);
      container.style.setProperty('--scale-factor', scale);
      const wrapper = container.querySelector('[class*="__chart-wrapper"]');
      if (wrapper) {
        wrapper.style.transform = `scale(${scale})`;
        wrapper.style.transformOrigin = 'top center';
      }
      console.log(`Scaled ${container.querySelector('h3')?.textContent}: ${height}px → ${MAX_HEIGHT}px (${scale}x)`);
    }
  });
}
```

### Phase 3: Visual Refinements

After scaling is working:

1. **Adjust container height** to prevent white space after scaled charts
2. **Add subtle scale indicator** (optional): "Chart scaled to fit page"
3. **Test with real data**: Use longest timeline/ranking to verify
4. **Cross-browser testing**: Chrome, Firefox, Safari, Edge

---

## Technical Specifications

### Constants

```javascript
const PRINT_CONSTRAINTS = {
  PAGE_HEIGHT_MM: 297,        // A4 height
  PAGE_MARGIN_MM: 15,         // From print.css @page
  USABLE_HEIGHT_MM: 267,      // 297 - (15 * 2)
  USABLE_HEIGHT_PX: 700,      // ~267mm at 96 DPI (rough estimate)
  SAFE_CHART_HEIGHT_PX: 600,  // Leave room for titles/margins
};
```

### Scaling Formula

```
scaleFactor = min(1.0, SAFE_CHART_HEIGHT_PX / actualChartHeight)
```

### Edge Cases to Handle

1. **Very short charts**: Never scale UP (max scale = 1.0)
2. **Multiple infographics per topic**: Each scales independently
3. **Charts with legends**: Include legend in height measurement
4. **Rotated text** (timeline years): Account for rotation in measurements
5. **Browser zoom**: Test at 100%, 125%, 150% zoom levels

---

## Testing Checklist

- [ ] Timeline with 3 events (fits page - no scaling)
- [ ] Timeline with 8+ events (likely needs scaling)
- [ ] Ranking with 12+ countries (600px fixed height)
- [ ] Choropleth map (large SVG)
- [ ] Bar chart (should never need scaling due to aspect ratio)
- [ ] Multiple infographics in same topic (all fit within page)
- [ ] Page breaks between topics still work correctly
- [ ] Scaled charts maintain readability (text not too small)
- [ ] Print preview matches final PDF
- [ ] Chrome, Firefox, Safari, Edge browsers

---

## Alternative Solutions Considered

### ❌ Option: Allow Page Breaks Inside Charts

```css
.infographic-container {
  page-break-inside: auto; /* Allow splitting */
}
```

**Rejected because**: Splitting a chart across pages is worse than scaling it down.

### ❌ Option: Rotate Large Charts Landscape

Use CSS to rotate oversized charts 90°:

```css
@media print {
  @page landscape-page { size: A4 landscape; }
  .oversized-chart {
    page: landscape-page;
    transform: rotate(90deg);
  }
}
```

**Rejected because**:
- Can't mix portrait/landscape pages in browser print
- Would require server-side PDF generation
- Overly complex for this use case

### ⚠️ Option: Pagination Within Charts

Split large timelines into multiple "pages" within the same chart.

**Rejected because**:
- Significant component refactoring required
- Loses visual continuity of timeline
- Current architecture not designed for this

---

## Success Criteria

1. ✅ **No infographic exceeds one printed page height**
2. ✅ **Scaling is imperceptible for charts under 600px**
3. ✅ **Scaled charts remain readable** (minimum text size ~8pt)
4. ✅ **Automatic scaling requires no user intervention**
5. ✅ **Solution works across all major browsers**
6. ✅ **Print time increases by < 200ms** for scaling calculations

---

## Files to Modify

1. [public/css/print.css](../../public/css/print.css) - Add CSS scaling rules
2. [components/barCompareBox.vue](../../components/barCompareBox.vue) - Add JS scaling function
3. _(Optional)_ Create new composable: `composables/usePrintScaling.js`

---

## Related Documentation

- Previous print bug: [_process/bug-002/print-infographics.md](../../_process/bug-002/print-infographics.md)
- Print CSS: [public/css/print.css](../../public/css/print.css)
- Chart ready system: [components/barCompareBox.vue:53-59](../../components/barCompareBox.vue#L53-59)

---

## Next Steps

1. **Validate approach** with team/stakeholder
2. **Implement Phase 1** (CSS safety net) - ~30 min
3. **Test with real data** - identify worst-case charts
4. **Implement Phase 2** (JS enhancement) if needed - ~1 hour
5. **Cross-browser testing** - ~1 hour
6. **Iterate on scale thresholds** based on visual quality

---

**Estimated Total Effort**: 2-3 hours
**Risk Level**: Low (CSS-only fallback ensures no breakage)
**Priority**: Medium (improves UX but not blocking)
