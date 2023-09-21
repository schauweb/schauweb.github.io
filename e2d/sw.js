const cacheName = "v2";

const addResourcesToCache = async (resources) => {
    const cache = await caches.open(cacheName);
    await cache.addAll(resources);
};

const putInCache = async (request, response) => {
    const cache = await caches.open(cacheName);
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
            '/e2d',
            '/e2d/css/e2d.css',
            '/e2d/css/scl.css',
            '/e2d/img/android-chrome-192x192.png',
            '/e2d/img/android-chrome-512x512.png',
            '/e2d/img/apple-touch-icon.png',
            '/e2d/img/favicon-16x16.png',
            '/e2d/img/favicon-32x32.png',
            '/e2d/js/PageCalculate.js',
            '/e2d/js/PageCurrency.js',
            '/e2d/js/PageFetching.js',
            '/e2d/js/Scl.js',
            '/e2d/js/Storage.js',
            '/e2d/js/e2d.js',
            '/e2d/index.html',
            '/e2d/manifest.json'
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

