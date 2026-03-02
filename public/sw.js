const CACHE_NAME = "video-splitter-v1"
const PRECACHE_URLS = ["/", "/manifest.json", "/icons/icon-192x192.svg", "/icons/icon-512x512.svg"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  // Skip cross-origin requests and non-GET methods
  if (url.origin !== location.origin || event.request.method !== "GET") return

  // Skip FFmpeg WASM files (too large to cache, loaded from CDN)
  if (url.pathname.includes("ffmpeg")) return

  // Network-first strategy for navigation, cache-first for assets
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          return response
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/")))
    )
  } else {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached
        return fetch(event.request).then((response) => {
          if (response.ok && response.type === "basic") {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
      })
    )
  }
})
