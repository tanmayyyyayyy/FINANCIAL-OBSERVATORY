const CACHE_NAME = "financial-observatory-shell-v1";
const APP_SHELL = ["/", "/manifest.webmanifest"];
const PUBLIC_ASSET_PATHS = ["/assets/", "/icons/"];
const PUBLIC_ROOT_ASSETS = new Set(["/favicon.svg", "/brand-mark.svg", "/manifest.webmanifest"]);

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("financial-observatory-shell-") && key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(async () => (await caches.match("/")) || Response.error()));
    return;
  }

  const isPublicAsset = PUBLIC_ASSET_PATHS.some((path) => url.pathname.startsWith(path)) || PUBLIC_ROOT_ASSETS.has(url.pathname);
  if (!isPublicAsset) return;

  event.respondWith(caches.match(request).then((cached) => {
    if (cached) return cached;
    return fetch(request).then((response) => {
      if (response.ok && response.type === "basic") {
        const copy = response.clone();
        void caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    });
  }));
});
