// Service Worker - DISABLED FOR DEVELOPMENT
// This service worker immediately unregisters itself

self.addEventListener('install', (event) => {
  // Skip waiting and activate immediately
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Clear all caches
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      )
    }).then(() => {
      // Unregister this service worker
      return self.registration.unregister()
    }).then(() => {
      // Reload all clients
      return self.clients.matchAll().then((clients) => {
        clients.forEach(client => client.navigate(client.url))
      })
    })
  )
})

// Don't handle any fetch events
self.addEventListener('fetch', (event) => {
  // Let all requests pass through without interception
  return
})
