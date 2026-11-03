const VERSION="e9e6efb16c1a6e34";
const PREFIX='team-guzzetta-mobile:'+self.registration.scope+':';
const CACHE=PREFIX+VERSION;
const SHELL=["./index.html", "./style.css", "./app.js", "./model.js", "./pwa.js", "./manifest.webmanifest", "./assets/icon-192.png", "./assets/icon-512.png"];
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(SHELL.map(path=>new Request(new URL(path,self.registration.scope),{cache:'reload'})));})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 if(event.request.mode==='navigate'){event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(new URL('./index.html',self.registration.scope))||fetch(event.request);})());return;}
 const paths=new Set(SHELL.map(path=>new URL(path,self.registration.scope).pathname));if(!paths.has(url.pathname))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);url.search='';return await cache.match(url.href)||fetch(event.request);})());
});
