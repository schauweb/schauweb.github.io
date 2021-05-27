const CACHE_NAME = "pxsc-v4";

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll([
                '/pxsc/',
                '/pxsc/img/10-12.png',
                '/pxsc/img/1-9.png',
                '/pxsc/img/android-chrome-192x192.png',
                '/pxsc/img/android-chrome-512x512.png',
                '/pxsc/img/apple-touch-icon.png',
                '/pxsc/img/favicon-16x16.png',
                '/pxsc/img/favicon-32x32.png',
                '/pxsc/img/skip.png',
                '/pxsc/img/wild.png',
                '/pxsc/js/PageGame.js',
                '/pxsc/js/PagePlayers.js',
                '/pxsc/js/PageScore.js',
                '/pxsc/js/Player.js',
                '/pxsc/js/PlayerRepository.js',
                '/pxsc/js/pxsc.js',
                '/pxsc/js/Scl.js',
                '/pxsc/js/Storage.js',
                '/pxsc/index.html',
                '/pxsc/manifest.json',
                '/pxsc/css/pxsc.css',
                '/pxsc/css/scl.css'
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(function(response) {
        if (response) {
            return response;
        }

        return fetch(event.request).then(function (response) {
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }

            let responseClone = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
                cache.put(event.request, responseClone);
            });
            return response;
        });
    }));
});

self.addEventListener('activate', function(event) {
    var cacheWhitelist = [ CACHE_NAME ];
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
