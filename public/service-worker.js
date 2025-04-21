// Service Worker for Danish Learning App

const CACHE_NAME = "danish-learner-cache-v1"
const OFFLINE_URL = "/offline.html"

// Resources to precache
const PRECACHE_RESOURCES = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/aprender",
  "/ejercicios",
  "/perfil",
  "/review",
  "/grammar",
  "/app/globals.css",
  "/logo.svg",
  // Add more resources as needed
]

// Install event - precache resources
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Install")

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Caching resources")
        return cache.addAll(PRECACHE_RESOURCES)
      })
      .then(() => {
        console.log("[Service Worker] Successfully installed")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error("[Service Worker] Precaching error:", error)
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activate")

  event.waitUntil(
    caches
      .keys()
      .then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key !== CACHE_NAME) {
              console.log("[Service Worker] Removing old cache", key)
              return caches.delete(key)
            }
          }),
        )
      })
      .then(() => {
        console.log("[Service Worker] Claiming clients")
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return
  }

  // For HTML pages, use network-first strategy
  if (event.request.headers.get("accept").includes("text/html")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the response
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
          return response
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            // If not in cache, serve offline page
            return caches.match(OFFLINE_URL)
          })
        }),
    )
    return
  }

  // For other resources, use cache-first strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      // If not in cache, fetch from network
      return fetch(event.request)
        .then((response) => {
          // Cache the response
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
          return response
        })
        .catch((error) => {
          console.error("[Service Worker] Fetch error:", error)

          // For API requests, return empty JSON
          if (event.request.url.includes("/api/")) {
            return new Response(JSON.stringify({ error: "You are offline" }), {
              headers: { "Content-Type": "application/json" },
            })
          }

          // For image requests, return placeholder
          if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
            return new Response("", {
              status: 404,
              statusText: "Not found",
            })
          }
        })
    }),
  )
})

// Handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
