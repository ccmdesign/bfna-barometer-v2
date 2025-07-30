export default defineNuxtPlugin(nuxtApp => {
  const route = useRoute()
  
  nuxtApp.hook('page:finish', () => {
    // Check if we have a scrollTo parameter
    if (route.query.scrollTo) {
      // Wait for the DOM to be fully loaded and ready
      setTimeout(() => {
        const element = document.getElementById(route.query.scrollTo)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100) // Small delay to ensure the DOM is ready
    }
  })
})