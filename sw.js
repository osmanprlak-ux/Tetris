const CACHE = 'tetris-v4';

self.addEventListener('install', e => {
  // HTML cache'leme - sadece manifest
  e.waitUntil(caches.open(CACHE).then(c => c.add('./manifest.json')));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // HTML için asla cache kullanma, her zaman ağdan al
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request.url, { cache: 'no-store' })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
