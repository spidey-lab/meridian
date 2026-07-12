/* MERIDIAN service worker — offline shell + data cache fallback */
const CACHE = 'meridian-v7.4';
const SHELL = ['./', './index.html', './manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    // App shell: network-first so a fresh deploy shows up on the very next
    // reload (cache-first previously meant a deploy needed two reloads —
    // one to silently update the SW, a second to actually see it). Falls
    // back to cache only when the network is unavailable (offline mode).
    e.respondWith(
      fetch(req).then(r => {
        if (r.ok) caches.open(CACHE).then(c => c.put(req, r.clone()));
        return r;
      }).catch(() => caches.match(req))
    );
  } else {
    // Data APIs (rss2json, Open-Meteo, USGS, Sheets…): network-first,
    // cached copy as offline fallback. Opaque responses (TV embeds) skipped.
    e.respondWith(
      fetch(req).then(r => {
        if (r.ok && r.type !== 'opaque') caches.open(CACHE).then(c => c.put(req, r.clone()));
        return r;
      }).catch(() => caches.match(req))
    );
  }
});
