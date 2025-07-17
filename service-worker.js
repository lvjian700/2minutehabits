// Simplified service worker for 2-Minutes Habits (no offline caching)
const CACHE_NAME = "2-minutes-habits-cache-v6";

const scope = self.registration.scope;
const scopePath = new URL(scope).pathname;
const BASE_PATH = scopePath === "/" ? "" : scopePath.replace(/\/$/, "");

console.log("Service Worker scope:", scope);
console.log("Using BASE_PATH:", BASE_PATH);

function joinPaths(base, path) {
  if (!base) return path;
  if (base.endsWith("/")) base = base.slice(0, -1);
  if (path.startsWith("/")) path = path.substring(1);
  if (path === "/") path = "";
  return path ? `${base}/${path}` : `${base}/`;
}

self.addEventListener("install", (event) => {
  console.log("Service Worker installed.");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));

      const clients = await self.clients.matchAll({
        includeUncontrolled: true,
      });
      for (const client of clients) {
        client.postMessage({ type: "SW_UPDATED" });
      }
    })(),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Let the browser handle all requests normally (no caching)
});
