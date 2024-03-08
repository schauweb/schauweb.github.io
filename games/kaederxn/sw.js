const cachedName = "kaederxn-1";

self.addEventListener("install", (e) => {
	console.log("Service Worker Installed");
});

self.addEventListener("activate", (e) => {
	console.log("Service Worker Activated");
	e.waitUntil(caches.keys().then((cacheNames) => {
		return Promise.all(
			cacheNames.map((cache) => {
				if (cache !== cachedName) {
					console.log("Cached Service worker is being cleared");
					return caches.delete(cache);
				}
			})
		);
	}));
});

self.addEventListener("fetch", (e) => {
	console.log("fetching service worker");
	e.respondWith(fetch(e.request)
		.then((res) => {
			const responseClone = res.clone();
			caches.open(cachedName).then((cache) => {
				cache.put(e.request, responseClone);
			});
			return res;
		})
		.catch((err) => {
			caches.match(e.request).then((res) => res);
		})
	);
});
