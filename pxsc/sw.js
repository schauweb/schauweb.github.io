const addResourcesToCache = async (resources) => {
    const cache = await caches.open("v3");
    await cache.addAll(resources);
};

const putInCache = async (request, response) => {
    const cache = await caches.open("v3");
    await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise }) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }

    const preloadResponse = await preloadResponsePromise;
    if (preloadResponse) {
        console.info("using preload response", preloadResponse);
        putInCache(request, preloadResponse.clone());
        return preloadResponse;
    }

    try {
        const responseFromNetwork = await fetch(request);
        putInCache(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } catch (error) {
        return new Response("Network error happened", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
        });
    }
};

const enableNavigationPreload = async () => {
    if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
    }
};

self.addEventListener("activate", (event) => {
    event.waitUntil(enableNavigationPreload());
});

self.addEventListener("install", (event) => {
    event.waitUntil(
        addResourcesToCache([
            '/pxsc/',
            '/pxsc/css/pxsc.css',
            '/pxsc/css/scl.css',
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
            '/pxsc/index.html'
        ]),
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        cacheFirst({
            request: event.request,
            preloadResponsePromise: event.preloadResponse,
        }),
    );
});

