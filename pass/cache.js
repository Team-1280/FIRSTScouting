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
  './resources/css/water.css',
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
  './2024/CU_config.js',
  './2024/CU_Pit_config.js',
  './android-chrome-192x192.png',
  './android-chrome-512x512.png',
  './favicon-32x32.png',
  './favicon-16x16.png',
  './offline/index.html',
  './offline/index.js',
  './offline/html5-qrcode.min.js',
  '/'
]

// cache responses of provided URLs
cacheAssets(assets)
  .then(() => {
    console.log('Cache sync complete')
  })


if ('serviceWorker' in navigator && 'PushManager' in window) {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();

    const deferredPrompt = e;

    const installButton = document.createElement('button');
    installButton.textContent = 'Install App';
    installButton.style.position = 'fixed';
    installButton.style.top = '10px';
    installButton.style.left = '50%';
    installButton.style.transform = 'translateX(-50%)';
    installButton.style.zIndex = '9999';
    installButton.style.padding = '10px 20px';
    installButton.classList.add('btn-grad');
    installButton.style.color = 'white';
    installButton.style.border = 'none';
    installButton.style.borderRadius = '5px';
    installButton.style.cursor = 'pointer';

    installButton.addEventListener('click', () => {

      deferredPrompt.prompt();

      deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('App installed');
        } else {
          console.log('App installation declined');
        }

        installButton.style.display = 'none';
      });
    });

    document.body.appendChild(installButton);
  });
}