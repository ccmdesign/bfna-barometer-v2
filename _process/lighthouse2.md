This document summarizes the PageSpeed Insights reports for the development site `https://barometer-v2.netlify.app/`, based on an analysis conducted on August 13, 2025.

---

### **Mobile Analysis**

#### **Overall Scores (Mobile)**
* **Performance**: 49
* **Accessibility**: 100
* **Best Practices**: 93
* **SEO**: 92

#### **Performance Details (Mobile Score: 49)**
The mobile performance of the site falls into the "poor" category, with slow initial paint and high layout shift.
* [cite_start]**First Contentful Paint**: 5.1 s [cite: 1253]
* [cite_start]**Largest Contentful Paint**: 12.5 s [cite: 1261]
* [cite_start]**Speed Index**: 6.0 s [cite: 1257]
* [cite_start]**Cumulative Layout Shift**: 0.229 [cite: 1262]
* [cite_start]**Total Blocking Time**: 50 ms [cite: 1255]

**Key Improvement Areas:**
* [cite_start]**Render-blocking requests**: The report estimates a potential saving of 2,410 ms by addressing these. [cite: 1279]
* [cite_start]**Reduce unused JavaScript**: An estimated 32 KiB could be saved. [cite: 1286]
* [cite_start]**Long main-thread tasks**: The scan identified 6 long tasks that contribute to input delay. [cite: 1288]

#### **Accessibility (Mobile Score: 100)**
[cite_start]The site received a perfect score in accessibility, passing all 20 audits. [cite: 1230, 1334]

#### **Best Practices (Mobile Score: 93)**
The Best Practices score is strong but flagged a few issues.
* [cite_start]**Browser errors** were logged to the console. [cite: 1348]
* [cite_start]**Issues were logged** in the Chrome DevTools Issues panel. [cite: 1349]
* [cite_start]**Missing source maps** for a large first-party JavaScript file were noted. [cite: 1351]

#### **SEO (Mobile Score: 92)**
The site scored well in SEO, with one notable issue.
* [cite_start]**Uncrawlable Links**: Some links on the site are not crawlable by search engines. [cite: 1374]

---

### **Desktop Analysis**

#### **Overall Scores (Desktop)**
* **Performance**: 65
* **Accessibility**: 100
* **Best Practices**: 93
* **SEO**: 92

#### **Performance Details (Desktop Score: 65)**
The desktop performance is in the "needs improvement" range.
* [cite_start]**First Contentful Paint**: 1.1 s [cite: 42]
* [cite_start]**Largest Contentful Paint**: 2.2 s [cite: 52]
* [cite_start]**Speed Index**: 3.8 s [cite: 46]
* [cite_start]**Total Blocking Time**: 290 ms [cite: 44]
* [cite_start]**Cumulative Layout Shift**: 0.068 [cite: 53]

**Key Improvement Areas:**
* [cite_start]**Defer offscreen images**: An estimated 61 KiB could be saved by lazy-loading images. [cite: 84, 85]
* [cite_start]**Reduce unused JavaScript**: An estimated 32 KiB could be saved. [cite: 86, 87]
* [cite_start]**Long main-thread tasks**: The scan identified 6 long tasks. [cite: 89]

#### **Accessibility (Desktop Score: 100)**
[cite_start]The site achieved a perfect score in accessibility on desktop, passing all 20 audits. [cite: 13, 135]

#### **Best Practices (Desktop Score: 93)**
The issues identified in the Best Practices audit are consistent with the mobile report.
* [cite_start]**Browser errors** were logged to the console. [cite: 149]
* [cite_start]**Issues were logged** in the Chrome DevTools Issues panel. [cite: 150]
* [cite_start]**Missing source maps** for a large first-party JavaScript file were identified. [cite: 152]

#### **SEO (Desktop Score: 92)**
The SEO audit identified the same issue as the mobile scan.
* [cite_start]**Uncrawlable Links**: Links on the site are not crawlable. [cite: 176]