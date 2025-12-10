import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useRouter, useGtag } from '#imports'

export default defineNuxtPlugin(() => {
  if (!import.meta.client) {
    return
  }

  if (import.meta.env.DEV) {
    return
  }

  const hostname = window.location.hostname
  const isLocalhost = ['localhost', '127.0.0.1', '0.0.0.0'].includes(hostname) || hostname.endsWith('.localhost')
  if (isLocalhost) {
    return
  }

  const router = useRouter()
  const { gtag } = useGtag()
  if (typeof gtag !== 'function') {
    return
  }

  const track = (to: RouteLocationNormalizedLoaded | null) => {
    const path = to?.fullPath ?? `${window.location.pathname}${window.location.search}`
    const location = `${window.location.origin}${path}`
    gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title,
      page_location: location
    })
  }

  let trackedInitial = false

  router.afterEach((to) => {
    track(to)
    trackedInitial = true
  })

  router.isReady().then(() => {
    if (!trackedInitial) {
      track(router.currentRoute.value)
      trackedInitial = true
    }
  })
})
