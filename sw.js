const CACHE_NAME = 'gymplified-shell-v32';
// K4: the Supabase SDK is self-hosted (pinned, from the npm package), so the app loads no third-party script.
const SUPABASE_SDK = './sdk/supabase-2.57.4.js';
const APP_SHELL = [
  './',
  './index.html',
  './app.css',
  './lib.js',
  './app.js',
  './plus.js',
  SUPABASE_SDK,
  './analytics.js',
  './manifest.webmanifest',
  './gymplified-app-icon.jpg',
  './gymplified-brand.jpg',
  './apple-touch-icon.png',
  './privacy.html',
  './terms.html',
  './assets/muscle-map-template.svg'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    // K7: the first install takes over at once. An update waits until the user taps Refresh (see the message handler).
    if (!self.registration.active) await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('gymplified-shell-') && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    const path = url.pathname.replace(/\/+$/, '');
    const appEntry = path === '' || path.endsWith('/index.html');
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response && response.ok && response.type !== 'opaque') {
          await cache.put(request, response.clone());
          if (appEntry) await cache.put('./index.html', response.clone());
        }
        return response;
      } catch (_) {
        const exact = await cache.match(request, {ignoreSearch:true});
        if (exact) return exact;
        if (appEntry) return (await cache.match('./index.html')) || (await cache.match('./'));
        if (path.endsWith('/privacy.html')) return (await cache.match('./privacy.html')) || Response.error();
        if (path.endsWith('/terms.html')) return (await cache.match('./terms.html')) || Response.error();
        return Response.error();
      }
    })());
    return;
  }

  // The app code and styles change with every release, so they follow index.html: network first, cache as the offline fallback.
  if (/\/(app|lib|plus)\.(js|css)$/.test(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response && response.ok && response.type === 'basic') await cache.put(request, response.clone());
        return response;
      } catch (_) {
        return (await cache.match(request, {ignoreSearch:true})) || Response.error();
      }
    })());
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response && response.ok && response.type === 'basic') {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    }))
  );
});

// Rest-timer notifications: bring the app back to the foreground when tapped.
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) { if ('focus' in client) return client.focus(); }
    if (self.clients.openWindow) return self.clients.openWindow('./');
  })());
});

// K7: the page asks a waiting update to take over when the user taps "Refresh now".
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
