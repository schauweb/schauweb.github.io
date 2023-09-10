const CACHE_NAME = "e2d-v1";

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll([
                'css/e2d.css',
                'css/scl.css',
                'img/android-chrome-192x192.png',
                'img/android-chrome-512x512.png',
                'img/apple-touch-icon.png',
                'img/favicon-16x16.png',
                'img/favicon-32x32.png',
                'js/PageCalculate.js',
                'js/PageCurrency.js',
                'js/Scl.js',
                'js/Storage.js',
                'js/e2d.js',
                'index.html',
                'manifest.json',
                'Ubuntu-Regular.ttf'
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
