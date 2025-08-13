export default defineNuxtPlugin(() => {
  // Only run in production and if performance API is available
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && 'performance' in window) {
    // Track First Contentful Paint
    if ('getEntriesByType' in performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const paintEntries = performance.getEntriesByType('paint');
          const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
          
          if (fcpEntry) {
            console.log('First Contentful Paint:', fcpEntry.startTime);
          }
          
          // Track Largest Contentful Paint
          if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((entryList) => {
              const entries = entryList.getEntries();
              const lastEntry = entries[entries.length - 1];
              console.log('Largest Contentful Paint:', lastEntry.startTime);
            });
            
            try {
              observer.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
              // LCP not supported
            }
          }
        }, 0);
      });
    }
    
    // Preload resources on hover for better UX
    document.addEventListener('mouseover', (event) => {
      const link = event.target.closest('a[href]');
      if (link && link.hostname === window.location.hostname) {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('mailto:')) {
          // Preload the page
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'prefetch';
          preloadLink.href = href;
          document.head.appendChild(preloadLink);
        }
      }
    }, { once: true, passive: true });
  }
});
