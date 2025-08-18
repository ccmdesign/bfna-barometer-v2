# Feature: Export Comparison to PDF

## 1. Objective

To allow users to generate a clean, readable, and well-formatted PDF document of the selected country and topic comparisons from the "Comparison Tool" page. This will provide an easy way for users to save, share, and print their findings.

## 2. Proposed Solution

We will leverage the browser's native "Print > Save as PDF" functionality, which can be triggered via JavaScript. This approach is lightweight, avoids complex server-side dependencies, and provides a familiar user experience.

The core of this feature will be a dedicated print-specific stylesheet that reformats the comparison content for a document-friendly layout (e.g., A4 page). The styles will be placed inside a `@media print` block within `pages/compare.vue`.

## 3. Implementation Plan

### Step 1: Implement the "Export PDF" Button and Functionality
- In `pages/compare.vue`, a new "Export PDF" button will be added next to the existing "CSV" export button.
- A corresponding `exportToPDF()` method will be created. This method will simply call `window.print()` to open the browser's print dialog.

### Step 2: Develop Comprehensive Print Styles
This is the core of the implementation. We will use `@media print` rules inside `pages/compare.vue` to transform the page into a clean, document-like format.

#### 2.1. Global Styles & Resets
- **Page Setup:** Define `@page` rules to control margins (e.g., `@page { margin: 1in; }`).
- **Background and Color:** Force a white background and black text for all elements to ensure high contrast and save ink (`background: #fff !important; color: #000 !important;`).
- **Typography:** Set a base font size (e.g., `12pt`) and a serif font family (e.g., `Georgia, "Times New Roman", serif`) for the `body` to improve readability on paper. All text shadows will be removed.

#### 2.2. Hiding Non-Content Elements
- We will use the existing `print:hidden` utility class and apply it to all non-essential components and containers. This includes:
  - The entire `<bar-hero>` section.
  - The `<bar-section>` that contains the export buttons.
  - The bottom `<bar-section>` with the "Back to Top" button.
  - Any other UI controls, navigation, or decorative elements that are not part of the core comparison data.

#### 2.3. Reformatting the Comparison Layout
- **Main Container:** The `<bar-compare-box>` component will be the primary content. We will ensure it has no unnecessary borders, shadows, or background colors in the print view.
- **Stack Country Panels:** The side-by-side `switcher` layout is unsuitable for portrait A4 pages. We will override its CSS to `display: block;`, forcing the country comparison panels to stack vertically, one after the other.
- **Topic Title:** The main topic title within `<bar-compare-box>` will be styled as a clear and prominent section header.
- **Country Section:** Each country's panel (`.section-panel`) will be styled with clear visual separation, perhaps with a top border to distinguish between different topics.

#### 2.4. Styling Content for Readability
- **Links:** All hyperlinks will be styled with an underline to be clearly identifiable. We will use a CSS `::after` pseudo-element to print the full URL in parentheses next to the link text (e.g., `Bertelsmann Foundation (https://www.bfna.org)`). This is critical for usability in a static document.
- **Infographics:**
  - **Initial Approach (Hide All):** To ensure a clean and predictable initial result, all infographic components (`bar-infographic`, `timeline-infographic`, etc.) within the comparison box will be hidden using `display: none;`. This prevents complex, interactive, or wide elements from breaking the print layout.
  - **Future Enhancement (Static Fallbacks):** If desired later, we could explore creating simplified, static image fallbacks for the charts to be displayed in the print version. For now, the focus is on the textual data.

#### 2.5. Page Flow and Control
- **Avoid Awkward Breaks:** We will apply `page-break-inside: avoid;` to the main `<bar-compare-box>` container for each topic. This crucial rule will prevent a single topic's comparison from being split illogically across two pages.
- **Heading Control:** We will apply `page-break-after: avoid;` to headings to ensure they don't get orphaned at the bottom of a page, separated from the content that follows them.

## 4. Files to be Modified
- **`_process/feature-pdf-export.md`**: (This file)
- **`pages/compare.vue`**: (Add button, trigger function, and all `@media print` styles)
- **`components/barCompareBox.vue`**: (Potentially add some print-specific classes to facilitate styling, though most will be handled from the parent page)
