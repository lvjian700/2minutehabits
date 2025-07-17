// Simple service worker for PWA
const CACHE_NAME = "2-minutes-habits-cache-v5";

// Determine the base path from the service worker scope so it works on both
// GitHub Pages and the custom domain. If the scope path is just '/', use an
// empty string to avoid double slashes.
const scope = self.registration.scope;
const scopePath = new URL(scope).pathname;
const BASE_PATH = scopePath === "/" ? "" : scopePath.replace(/\/$/, "");

// For debugging
console.log("Service Worker scope:", scope);
console.log("Using BASE_PATH:", BASE_PATH);

// Helper function to join paths without double slashes
function joinPaths(base, path) {
  if (!base) return path;

  // Normalize paths
  if (base.endsWith("/")) base = base.slice(0, -1);
  if (path.startsWith("/")) path = path.substring(1);

  // Special case for root path
  if (path === "/") path = "";

  return path ? `${base}/${path}` : `${base}/`;
}

const urlsToCache = [
  joinPaths(BASE_PATH, "/"),
  joinPaths(BASE_PATH, "/index.html"),
  joinPaths(BASE_PATH, "/manifest.json"),
  joinPaths(BASE_PATH, "/icon-192.png"),
  joinPaths(BASE_PATH, "/icon-512.png"),
  // Add more assets or routes as needed
];

self.addEventListener("install", (event) => {
  console.log("Service Worker installing, caching URLs:", urlsToCache);
  event.waitUntil(precacheAssets());
  self.skipWaiting();
});

async function precacheAssets() {
  const cache = await caches.open(CACHE_NAME);
  try {
    await cache.addAll(urlsToCache);

    // Fetch index.html to extract hashed asset names for precaching
    const indexRes = await fetch(joinPaths(BASE_PATH, "/index.html"));
    if (indexRes.ok) {
      const html = await indexRes.text();
      const assetRegex = /["']([^"']*?assets\/[^"']+)["']/g;
      const assets = new Set();
      let match;
      while ((match = assetRegex.exec(html))) {
        assets.add(joinPaths(BASE_PATH, match[1]));
      }
      await cache.addAll([...assets]);
      await cache.put(
        joinPaths(BASE_PATH, "/index.html"),
        new Response(html, { headers: { "Content-Type": "text/html" } }),
      );
    }
    console.log("All resources cached successfully");
  } catch (error) {
    console.error("Failed to cache resources:", error);
  }
}

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
      const clients = self.clients.matchAll({ includeUncontrolled: true });
      for (const client of clients) {
        client.postMessage({ type: "SW_UPDATED" });
      }
    }),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests and non-GET requests
  if (
    event.request.url.startsWith(self.location.origin) &&
    event.request.method === "GET"
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            // If we got a valid response, cache it
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // If network request fails, try to serve from cache
            return caches.match(event.request);
          });
      }),
    );
  }
});
