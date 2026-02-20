self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open('offline-cache-v1').then((cache) => {
            return cache.addAll([
                '/',
                '/diagnosis',
                '/advisor',
                '/prices',
                '/journal',
                '/offline'
            ]);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Network-first with offline fallback
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    // Exclude API routes from cache fallback, unless it's handled specifically
    if (event.request.url.includes('/api/')) {
        return;
    }

    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request).then((response) => {
                if (response) {
                    return response;
                }
                // If it's a page navigation, return offline page or root depending on cache
                if (event.request.mode === 'navigate') {
                    return caches.match('/'); // Or a dedicated /offline page if one existed
                }
                return new Response('Network error happened', {
                    status: 408,
                    headers: { 'Content-Type': 'text/plain' },
                });
            });
        })
    );
});

// Background Sync
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-journal-entries') {
        console.log('[Service Worker] Syncing journal entries in background');
        // Implement actual sync logic here if a backend existed
    }
});

// Periodic Sync
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-market-prices') {
        console.log('[Service Worker] Periodically updating market prices');
        // Implement logic to prefetch market data
    }
});

// Push Notifications
self.addEventListener('push', (event) => {
    const payload = event.data ? event.data.text() : 'You have a new alert!';

    event.waitUntil(
        self.registration.showNotification('AgriSense AI', {
            body: payload,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            vibrate: [200, 100, 200],
            data: { url: '/' }
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
