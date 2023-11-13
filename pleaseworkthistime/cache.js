// all URLs will be added to cache
const cacheAssets = assets => {
  return new Promise((res, reject) => {
    // open cache
    caches.open('assets')
      .then(cache => {
        // use cache API
        cache.addAll(assets)
          .then(() => {
            console.log('All assets added to cache! Now ready for offline use.')
            res()
          })
          .catch(err => {
            console.log('Error while syncing assets. Offline use may not work as expected.', err)
            reject()
          })
      }).catch(err => {
        console.log('Cache error try reloading to reopen cache.', err)
        reject()
      })
  })
}

// list of URLs to be cached
var assets = [
  './index.html',
  './pit.html',
  './favicon.ico',
  './resources/css/normalize.css',
  './resources/css/scoutingPASS.css',
  './resources/images/field_location_key.png',
  './resources/js/easy.qrcode.min.js',
  './resources/js/googleSheets.js',
  './resources/js/scoutingPASS.js',
  './resources/js/TBAInterface.js',
  './serviceWorker.js',
  './site.webmanifest',
  './cache.js',
  './process/index.css',
  './process/index.html',
  './process/index.js',
  './2023/CU_config.js',
  './2023/CU_Pit_config.js',
  './2023/field_image.png',
  './2023/grid_image_alt.png',
  './2023/grid_image.png',
  './android-chrome-192x192.png',
  './android-chrome-512x512.png',
  './favicon-32x32.png',
  './favicon-16x16.png'
]

// cache responses of provided URLs
cacheAssets(assets)
  .then(() => {
    console.log('Cache sync complete')
  })
