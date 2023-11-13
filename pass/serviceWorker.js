// this is a service worker that intercepts all HTTP requests
self.addEventListener('fetch', getter = (e) => {
  const request = e.request
  e.respondWith(
    caches.match(e.request).then(res => {
      // return from cache, otherwise fetch from network
      return res || fetch(request)
    })
  )
  // otherwise: ignore event
})
