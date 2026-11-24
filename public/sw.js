const CACHE = 'polish-drills-v4';
const SCOPE = self.registration.scope;
const INDEX = new URL('index.html', SCOPE).href;
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const response = await fetch(INDEX);
    const html = await response.clone().text();
    const assets = [...html.matchAll(/(?:src|href)="([^" ]*\/assets\/[^" ]+)"/g)].map(match => new URL(match[1], SCOPE).href);
    await cache.put(INDEX, response);
    await cache.addAll([SCOPE, new URL('THIRD_PARTY_NOTICES.md', SCOPE).href, ...assets]);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith('polish-drills-') && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (event.request.mode === 'navigate') {
      try {
        const response = await fetch(event.request);
        if (response.ok) await cache.put(event.request, response.clone());
        return response;
      } catch {
        return await cache.match(event.request) || await cache.match(INDEX) || Response.error();
      }
    }
    const cached = await cache.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch {
      return Response.error();
    }
  })());
});
