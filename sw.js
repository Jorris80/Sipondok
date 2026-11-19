/* SIPONDOK Service Worker — cache shell, CDN, ubin peta (terbatas); API tidak pernah di-cache. */
const VER = 'sipondok-1.0.0-e82c5a2061';
const SHELL = ['./', './index.html', './offline.html', './manifest.webmanifest'];
const CDN = /^https:\/\/(cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//;
const TILES = /^https:\/\/([abc]\.)?(tile\.openstreetmap\.org|server\.arcgisonline\.com|tile\.opentopomap\.org)\//;
const TILE_MAX = 600; // batasi ubin tersimpan (patuh kebijakan penggunaan ubin)

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VER).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VER && k !== 'sipondok-tiles').map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
async function trimTiles() {
  const c = await caches.open('sipondok-tiles'), ks = await c.keys();
  for (let i = 0; i < ks.length - TILE_MAX; i++) await c.delete(ks[i]);
}
self.addEventListener('fetch', e => {
  const r = e.request, url = r.url;
  if (r.method !== 'GET') return;                                   // POST API → selalu ke jaringan
  if (/script\.google(usercontent)?\.com/.test(url)) return;         // API Apps Script tidak di-cache
  if (r.mode === 'navigate') {                                       // network-first untuk halaman
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(VER).then(c => c.put('./index.html', cp)); return res; })
      .catch(() => caches.match('./index.html').then(m => m || caches.match('./offline.html'))));
    return;
  }
  if (TILES.test(url)) {                                             // ubin: cache-first, terbatas
    e.respondWith(caches.open('sipondok-tiles').then(c => c.match(r).then(m => m || fetch(r).then(res => { if (res.ok || res.type === 'opaque') { c.put(r, res.clone()); trimTiles(); } return res; }).catch(() => new Response('', { status: 504 })))));
    return;
  }
  if (CDN.test(url) || url.startsWith(self.location.origin)) {       // stale-while-revalidate
    e.respondWith(caches.open(VER).then(c => c.match(r).then(m => {
      const net = fetch(r).then(res => { if (res.ok || res.type === 'opaque') c.put(r, res.clone()); return res; }).catch(() => m || caches.match('./offline.html'));
      return m || net;
    })));
  }
});
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });
