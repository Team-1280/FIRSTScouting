// all URLs will be added to cache
const cacheAssets = (assets) => {
    return new Promise((res, reject) => {
        // open cache
        caches
            .open('assets')
            .then((cache) => {
                // use cache API
                cache
                    .addAll(assets)
                    .then(() => {
                        console.log(
                            'All assets added to cache! Now ready for offline use.'
                        )
                        res()
                    })
                    .catch((err) => {
                        console.log(
                            'Error while syncing assets. Offline use may not work as expected.',
                            err
                        )
                        reject()
                    })
            })
            .catch((err) => {
                console.log('Cache error try reloading to reopen cache.', err)
                reject()
            })
    })
}

// list of URLs to be cached
var assets = [
    './C-Biscuit.png',
    './water.css',
    './cache.js',
    './index.html',
    './index.js',
    './site.webmanifest',
    './sw.js',
    './html5-qrcode.min.js',
    '/'
]

// cache responses of provided URLs
cacheAssets(assets).then(() => {
    console.log('Cache sync complete')
})

let deferredPrompt

window.addEventListener('beforeinstallprompt', function (event) {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault()
    // Stash the event so it can be triggered later.
    deferredPrompt = e
})

const btnAdd = document.createElement('button')
btnAdd.textContent = 'Install App'
btnAdd.style.position = 'fixed'
btnAdd.style.top = '10px'
btnAdd.style.left = '50%'
btnAdd.style.transform = 'translateX(-50%)'
btnAdd.style.zIndex = '9999'
btnAdd.style.padding = '10px 20px'
btnAdd.classList.add('btn-grad')
btnAdd.style.color = 'white'
btnAdd.style.border = 'none'
btnAdd.style.borderRadius = '5px'
btnAdd.style.cursor = 'pointer'

// Installation must be done by a user gesture! Here, the button click
btnAdd.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    btnAdd.style.display = 'none'
    // Show the prompt
    deferredPrompt.prompt()
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt')
        } else {
            console.log('User dismissed the A2HS prompt')
        }
        deferredPrompt = null
    })
})

document.body.appendChild(btnAdd)
