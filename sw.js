/* WeAte service worker — shell offline, APIs stay online */
const CACHE = 'weate-shell-v92';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './style.css?v=92',
  './premium.css?v=92',
  './depth.css?v=92',
  './type.css?v=92',
  './app.css?v=92',
  './depth.js?v=92',
  './products.js?v=92',
  './recipes.js?v=92',
  './app.js?v=92',
  './weekplan.js?v=92',
  './suggest.js?v=92',
  './folder.js?v=92',
  './ai.js?v=92',
  './brands.js?v=92',
  './listfix.js?v=92',
  './actie.js?v=92',
  './nearby.js?v=92',
  './listview.js?v=92',
  './avond.js?v=92',
  './boardfix.js?v=92',
  './assist.js?v=92',
  './abpopup.js?v=92',
  './firebase-config.js?v=92',
  './sync.js?v=92',
  './pwa.js?v=92',
  './planlook.js?v=92',
  './swipe.js?v=92',
  './logo.png?v=92',
  './logo-192.png?v=92',
  './favicon.png?v=92',
  './favicon.ico?v=92',
  './apple-touch-icon.png?v=92',
  './icon-192.png',
  './icon-512.png',
  './icon-192-maskable.png',
  './icon-512-maskable.png'
];

function isShellAsset(url) {
  const u = new URL(url);
  if (u.origin !== self.location.origin) return false;
  const path = u.pathname;
  // Folder/bonus JSON + Firebase must stay network
  if (/\.json$/i.test(path)) return false;
  if (/firebase/i.test(path) || /firestore/i.test(path)) return false;
  // Versioned static or known shell paths
  if (u.searchParams.has('v')) return true;
  if (/\/(index\.html)?$/.test(path)) return true;
  if (/manifest\.webmanifest$/i.test(path)) return true;
  if (/\/(icon-|logo|favicon|apple-touch)/i.test(path)) return true;
  if (/\.(css|js|png|ico|webp|svg)$/i.test(path)) return true;
  return false;
}

function isHtmlNav(request, url) {
  if (request.mode === 'navigate') return true;
  if (url.origin === self.location.origin && /\/(index\.html)?$/.test(url.pathname)) return true;
  const accept = request.headers.get('accept') || '';
  return accept.includes('text/html');
}

function shouldBypass(url) {
  // External + Firebase CDN + Google fonts + Firestore — always network
  if (url.origin !== self.location.origin) return true;
  if (/\.json$/i.test(url.pathname)) return true;
  if (/firebase/i.test(url.hostname) || /googleapis\.com$/i.test(url.hostname)) return true;
  if (/gstatic\.com$/i.test(url.hostname)) return true;
  return false;
}

self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' }))).catch((err) => {
        console.warn('[WeAte SW] shell precache partial', err);
        return Promise.all(
          SHELL.map((u) => cache.add(new Request(u, { cache: 'reload' })).catch(() => null))
        );
      })
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (shouldBypass(url)) return; // network default — don't intercept

  // Network-first for HTML / navigations
  if (isHtmlNav(request, url)) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put('./index.html', copy)).catch(() => {});
          }
          return res;
        })
        .catch(() =>
          caches.match('./index.html').then((cached) =>
            cached || caches.match(request) || new Response('WeAte is offline. Even zonder net even kijken wat er nog in de cache zit.', {
              status: 503,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            })
          )
        )
    );
    return;
  }

  // Network-first for shell assets (JS/CSS/images); cache only as offline fallback
  if (isShellAsset(url.href)) {
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(request).then((c) => c || caches.match(request, { ignoreSearch: true })))
    );
  }
});
