'use strict';
const VERSION = '__SHELL_VERSION__';
const ASSETS = /*__SHELL_ASSETS__*/[];
const BASE = new URL('./',self.location.href);
const PREFIX = 'verse-shell:' + BASE.pathname + ':';
const CACHE = PREFIX + VERSION;
const shellURLs = new Set(ASSETS.map(asset=>new URL(asset.name,BASE).href));

async function completeShell() {
  if (!(await caches.has(CACHE))) return false;
  const cache = await caches.open(CACHE);
  return (await Promise.all(ASSETS.map(asset=>cache.match(new URL(asset.name,BASE).href)))).every(Boolean);
}

self.addEventListener('install',event=>event.waitUntil((async()=>{
  if (await completeShell()) return;
  // Fetch and verify everything BEFORE writing. A login page, deployment race or
  // interrupted transfer must never become a supposedly usable app release.
  try {
    const entries = await Promise.all(ASSETS.map(async asset=>{
      const url = new URL(asset.name,BASE).href;
      const response = await fetch(url,{cache:'no-store',redirect:'error',credentials:'same-origin'});
      if (response.status !== 200 || response.redirected || response.type === 'opaque') throw new Error('Invalid shell response');
      const bytes = await response.clone().arrayBuffer();
      const digest = await crypto.subtle.digest('SHA-256',bytes);
      const hash = Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');
      if (hash !== asset.sha256) throw new Error('Incomplete or mismatched app release');
      return [url,response];
    }));
    const cache = await caches.open(CACHE);
    for (const [url,response] of entries) await cache.put(url,response);
  } catch (error) {
    await caches.delete(CACHE);
    throw error;
  }
  // Deliberately no skipWaiting: current pages, saves and recordings keep their version.
})()));

self.addEventListener('activate',event=>event.waitUntil((async()=>{
  if (!(await completeShell())) throw new Error('Offline shell incomplete');
  for (const key of await caches.keys()) if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
  await self.clients.claim();
})()));

self.addEventListener('fetch',event=>{
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== BASE.origin || url.search) return;
  const entry = url.href === BASE.href ? new URL('index.html',BASE).href : url.href;
  if (!shellURLs.has(entry)) return;
  event.respondWith((async()=>{
    const cache = await caches.open(CACHE);
    const response = await cache.match(entry);
    // Eviction is possible. Do not cache arbitrary fallback network responses.
    return response || fetch(request);
  })());
});

self.addEventListener('message',event=>{
  if (event.data?.type !== 'VERSE_OFFLINE_STATUS' || !event.ports[0]) return;
  event.waitUntil(completeShell().then(ready=>event.ports[0].postMessage({ready})).catch(()=>event.ports[0].postMessage({ready:false})));
});
