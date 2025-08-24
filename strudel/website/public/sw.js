// sw.js — rewrite Strudel sample fetches site-wide.
// Works on GitHub Pages and local dev. No changes to Strudel sources.

// Take control immediately
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });

const CACHE_NAME = 'cloud5-samples-v3';

// Return part after "/samples/"
const tailOf = (urlStr) => {
  const u = new URL(urlStr, self.registration.scope);
  return u.pathname.replace(/^.*\/samples\//, '');
};

const isSamplesURL = (urlStr) => {
  try {
    const u = new URL(urlStr);
    return /\/samples\//.test(u.pathname);
  } catch { return false; }
};

const mark = (urlStr, flag) => {
  const u = new URL(urlStr, self.registration.scope);
  u.searchParams.set(flag, '1');
  return u.toString();
};

// Try in order: repo ROOT ( ./<tail> ), repo /samples, then remote strudel.cc/samples
const candidatesFor = (origUrlStr) => {
  const tail = tailOf(origUrlStr);
  const root = new URL(`./${tail}`, self.registration.scope).toString();
  const local = new URL(`./samples/${tail}`, self.registration.scope).toString();
  const remote = `https://strudel.cc/samples/${tail}`;
  return [
    mark(root, 'cloud5_root'),
    mark(local, 'cloud5_local'),
    mark(remote, 'cloud5_remote'),
  ];
};

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle sample-kit traffic, and don’t loop on our own flagged URLs
  const url = new URL(request.url);
  const flagged = url.searchParams.has('cloud5_root')
               || url.searchParams.has('cloud5_local')
               || url.searchParams.has('cloud5_remote');

  if (!isSamplesURL(request.url) || flagged) return; // let the network handle it

  event.respondWith((async () => {
    // Don’t cache range requests (audio streaming)
    const isRange = request.headers.has('range');
    const tryOnce = async (uStr) => {
      if (isRange) return fetch(uStr, { headers: request.headers, method: request.method });
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(uStr);
      if (cached) return cached.clone();
      const res = await fetch(uStr, { headers: request.headers, method: request.method });
      if (res && res.ok) await cache.put(uStr, res.clone());
      return res;
    };

    for (const u of candidatesFor(request.url)) {
      try {
        const res = await tryOnce(u);
        if (res && res.ok) return res;
      } catch {}
    }
    // Fall through: original request (maybe it works in dev)
    return fetch(request);
  })());
});
