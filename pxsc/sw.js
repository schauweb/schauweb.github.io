const CACHE_NAME = "pxsc-v8";

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll([
                'img/10-12.png',
                'img/1-9.png',
                'img/android-chrome-192x192.png',
                'img/android-chrome-512x512.png',
                'img/apple-touch-icon.png',
                'img/favicon-16x16.png',
                'img/favicon-32x32.png',
                'img/skip.png',
                'img/wild.png',
                'js/PageGame.js',
                'js/PagePlayers.js',
                'js/PageScore.js',
                'js/Player.js',
                'js/PlayerRepository.js',
                'js/pxsc.js',
                'js/Scl.js',
                'js/Storage.js',
                'index.html',
                'manifest.json',
                'css/pxsc.css',
                'css/scl.css'
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
