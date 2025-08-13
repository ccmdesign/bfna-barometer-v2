export const useDevice = () => {
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)

  const updateDeviceType = () => {
    if (process.client) {
      const width = window.innerWidth
      isMobile.value = width < 768
      isTablet.value = width >= 768 && width < 1024
      isDesktop.value = width >= 1024
    }
  }

  const checkUserAgent = () => {
    if (process.client) {
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'opera mini']
      return mobileKeywords.some(keyword => userAgent.includes(keyword))
    }
    return false
  }

  onMounted(() => {
    updateDeviceType()
    window.addEventListener('resize', updateDeviceType)
  })

  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('resize', updateDeviceType)
    }
  })

  // Initial detection on server-side using headers if available
  const detectFromHeaders = () => {
    if (process.server) {
      // This would need to be set up with server middleware if needed
      return false
    }
    return checkUserAgent()
  }

  return {
    isMobile: readonly(isMobile),
    isTablet: readonly(isTablet), 
    isDesktop: readonly(isDesktop),
    detectFromHeaders
  }
}
