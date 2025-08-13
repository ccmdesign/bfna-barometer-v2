This document summarizes the PageSpeed Insights reports for the development site `https://barometer-v2.netlify.app/`, based on an analysis conducted on August 13, 2025.

---

### **Mobile Analysis**

#### **Overall Scores (Mobile)**
* [cite_start]**Performance**: 42 [cite: 1882]
* [cite_start]**Accessibility**: 91 [cite: 1883]
* [cite_start]**Best Practices**: 75 [cite: 1884]
* [cite_start]**SEO**: 75 [cite: 1885]

#### **Performance Details (Mobile Score: 42)**
[cite_start]The mobile performance is poor, with very high loading times and a large page size. [cite: 1890]
* [cite_start]**First Contentful Paint**: 6.2 s [cite: 1910]
* [cite_start]**Largest Contentful Paint**: 13.9 s [cite: 1918]
* [cite_start]**Speed Index**: 9.2 s [cite: 1914]
* [cite_start]**Total Blocking Time**: 410 ms [cite: 1912]
* [cite_start]**Cumulative Layout Shift**: 0.127 [cite: 1919]

**Key Improvement Areas:**
* [cite_start]**Enormous Network Payloads**: The total page size was 3,644 KiB, which is excessively large for mobile users. [cite: 2108]
* [cite_start]**Render-blocking Resources**: The report estimates that addressing render-blocking requests could save 3,910 ms. [cite: 1933]
* [cite_start]**Unused JavaScript**: There is an opportunity to save an estimated 761 KiB by reducing unused JavaScript. [cite: 2078]
* [cite_start]**Unused CSS**: An estimated 278 KiB could be saved by reducing unused CSS. [cite: 2061]

#### **Accessibility Details (Mobile Score: 91)**
The site has a high accessibility score but is failing on fundamental items. [cite_start]The scan passed 18 audits. [cite: 2224]
* [cite_start]**Missing Page Title**: The document does not have a `<title>` element. [cite: 2165]
* [cite_start]**Missing Language Attribute**: The `<html>` element does not have a `[lang]` attribute, which can cause screen readers to announce the text incorrectly. [cite: 2173]

#### **Best Practices (Mobile Score: 75)**
The Best Practices score is impacted by several issues, including browser errors and high-severity security vulnerabilities.
* [cite_start]**Browser Errors**: Errors were logged to the browser console. [cite: 2294]
* **Security Vulnerabilities**:
    * [cite_start]No Content Security Policy (CSP) was found, posing a high-severity risk for cross-site scripting (XSS) attacks. [cite: 2344, 2345]
    * [cite_start]The site is missing a Cross-Origin-Opener-Policy (COOP) header, which is a high-severity issue. [cite: 2352, 2353]
    * [cite_start]No frame control policy (XFO or CSP) was found to mitigate clickjacking, also a high-severity risk. [cite: 2359]
* [cite_start]**Missing Source Maps**: A large first-party JavaScript file is missing a source map, which hinders debugging. [cite: 2317]

#### **SEO (Mobile Score: 75)**
The SEO score is impacted by missing metadata.
* [cite_start]The document is missing a `<title>` element. [cite: 2381]
* [cite_start]The page does not have a meta description. [cite: 2382]

---

### **Desktop Analysis**

#### **Overall Scores (Desktop)**
* [cite_start]**Performance**: 50 [cite: 490]
* [cite_start]**Accessibility**: 91 [cite: 491]
* [cite_start]**Best Practices**: 74 [cite: 492]
* [cite_start]**SEO**: 75 [cite: 493]

#### **Performance Details (Desktop Score: 50)**
[cite_start]The desktop performance score is in the "needs improvement" range, primarily due to high processing times and a large page size. [cite: 498, 500]
* [cite_start]**First Contentful Paint**: 1.4 s [cite: 521, 522]
* [cite_start]**Largest Contentful Paint**: 2.5 s [cite: 531]
* [cite_start]**Speed Index**: 2.9 s [cite: 525, 526]
* [cite_start]**Total Blocking Time**: 620 ms [cite: 523, 524]
* [cite_start]**Cumulative Layout Shift**: 0.083 [cite: 532]

**Key Improvement Areas:**
* [cite_start]**Enormous Network Payloads**: The total network payload was 3,437 KiB. [cite: 732]
* [cite_start]**Long Main-Thread Tasks**: The scan identified 11 long tasks on the main thread, indicating significant script processing time. [cite: 757]
* [cite_start]**Lazy Load Third-Party Resources**: The embedded YouTube video can be lazy-loaded with a facade to improve performance. [cite: 645]
* [cite_start]**Unused JavaScript**: An estimated 589 KiB could be saved by reducing unused JavaScript. [cite: 686]
* [cite_start]**Unused CSS**: An estimated 252 KiB could be saved by reducing unused CSS. [cite: 681, 682]

#### **Accessibility Details (Desktop Score: 91)**
The accessibility issues on desktop are identical to those on mobile. [cite_start]The scan passed 18 audits. [cite: 854]
* [cite_start]**Missing Page Title**: The document lacks a `<title>` element. [cite: 960]
* [cite_start]**Missing Language Attribute**: The `<html>` element is missing a `[lang]` attribute. [cite: 799]

#### **Best Practices (Desktop Score: 74)**
The Best Practices score is failing due to the same security and console error issues found in the mobile scan.
* [cite_start]**Security Vulnerabilities**: High-severity risks were identified due to a lack of Content Security Policy (CSP) [cite: 924][cite_start], Cross-Origin-Opener-Policy (COOP) [cite: 932][cite_start], and a frame control policy (XFO or CSP)[cite: 939].
* [cite_start]**Browser Errors**: Errors were logged to the browser console. [cite: 875]
* [cite_start]**Missing Source Maps**: A large JavaScript file is missing its source map. [cite: 899, 913]

#### **SEO (Desktop Score: 75)**
The desktop SEO score is impacted by missing metadata and uncrawlable links.
* [cite_start]The document does not have a `<title>` element. [cite: 960]
* [cite_start]The page is missing a meta description. [cite: 972]
* [cite_start]**Uncrawlable Links**: Links on the page are not crawlable by search engines because they lack a valid `href` attribute. [cite: 976, 977]