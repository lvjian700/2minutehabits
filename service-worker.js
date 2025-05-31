// Simple service worker for PWA
const CACHE_NAME = 'ivotes-cache-v3';

// Determine the base path based on where the service worker is located
const scope = self.registration.scope;
const isGitHubPages = scope.includes('github.io');
const BASE_PATH = isGitHubPages ? '/ihahits' : '';

// For debugging
console.log('Service Worker scope:', scope);
console.log('Using BASE_PATH:', BASE_PATH);

const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icon-192.png`,
  `${BASE_PATH}/icon-512.png`,
  // Add more assets or routes as needed
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return fetch(event.request)
          .then(response => {
            // If we got a valid response, cache it
            if (response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // If network request fails, try to serve from cache
            return caches.match(event.request);
          });
      })
    );
  }
});
