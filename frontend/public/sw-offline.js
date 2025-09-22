// Enhanced Service Worker for MESS WALLAH Offline Experience
const CACHE_NAME = 'mess-wallah-offline-v1';
const API_CACHE_NAME = 'mess-wallah-api-v1';

// Static assets to cache
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/prevent-autofill.js'
];

// API endpoints to cache for offline access
const apiEndpointsToCache = [
  '/api/rooms',
  '/api/rooms/featured',
  '/api/rooms/stats',
  '/api/search',
  '/api/analytics/summary'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(urlsToCache);
      }),
      caches.open(API_CACHE_NAME).then((cache) => {
        console.log('[SW] Pre-caching API endpoints');
        return Promise.all(
          apiEndpointsToCache.map(url => {
            return fetch(url).then(response => {
              if (response.ok) {
                return cache.put(url, response.clone());
              }
            }).catch(() => {
              console.log('[SW] Failed to pre-cache:', url);
            });
          })
        );
      })
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - handle offline requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests with cache-first strategy for offline support
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) => {
        return fetch(request).then((response) => {
          // If online, update cache and return response
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        }).catch(() => {
          // If offline, serve from cache
          return cache.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[SW] Serving cached API response for:', url.pathname);
              return cachedResponse;
            }
            // Return offline response for uncached API requests
            return new Response(
              JSON.stringify({
                success: false,
                message: 'You are currently offline. Please check your connection.',
                offline: true,
                cached: false
              }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' }
              }
            );
          });
        });
      })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        console.log('[SW] Serving cached asset:', url.pathname);
        return response;
      }

      // Try to fetch from network
      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone and cache the response
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      }).catch(() => {
        // If offline and no cache, return offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/').then((cachedResponse) => {
            return cachedResponse || createOfflinePage();
          });
        }
      });
    })
  );
});

// Create offline page when no cached version is available
function createOfflinePage() {
  return new Response(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MESS WALLAH - You're Offline</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          text-align: center;
          max-width: 400px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .logo {
          width: 80px;
          height: 80px;
          background: linear-gradient(45deg, #ff6b6b, #ff8e53);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 24px;
          font-weight: bold;
        }
        h1 { font-size: 2.5em; margin-bottom: 10px; }
        h2 { font-size: 1.8em; margin-bottom: 20px; opacity: 0.9; }
        p { font-size: 1.1em; line-height: 1.6; margin-bottom: 30px; opacity: 0.8; }
        .btn {
          background: linear-gradient(45deg, #ff6b6b, #ff8e53);
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 1em;
          border-radius: 25px;
          cursor: pointer;
          transition: transform 0.2s;
          font-weight: 600;
        }
        .btn:hover { transform: translateY(-2px); }
        .features {
          margin-top: 30px;
          text-align: left;
        }
        .feature {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .feature-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 18px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">MW</div>
        <h1>MESS WALLAH</h1>
        <h2>You're Offline</h2>
        <p>It looks like you've lost your internet connection. Don't worry, you can still browse some cached content!</p>
        <button class="btn" onclick="window.location.reload()">Try Again</button>
        
        <div class="features">
          <div class="feature">
            <div class="feature-icon">🏠</div>
            <div>
              <strong>Browse cached rooms</strong><br>
              <small>View previously loaded room listings</small>
            </div>
          </div>
          <div class="feature">
            <div class="feature-icon">❤️</div>
            <div>
              <strong>Access favorites</strong><br>
              <small>Your saved rooms are still available</small>
            </div>
          </div>
          <div class="feature">
            <div class="feature-icon">📅</div>
            <div>
              <strong>View bookings</strong><br>
              <small>Check your booking information</small>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>`,
    {
      headers: { 'Content-Type': 'text/html' }
    }
  );
}

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync triggered');
    event.waitUntil(syncPendingData());
  }
});

// Sync pending data when connection is restored
async function syncPendingData() {
  try {
    const pendingData = JSON.parse(localStorage.getItem('pendingSync') || '[]');
    console.log('[SW] Syncing pending data:', pendingData.length, 'items');
    
    for (const item of pendingData) {
      try {
        await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: item.body
        });
        console.log('[SW] Synced:', item.url);
      } catch (error) {
        console.error('[SW] Sync failed for:', item.url, error);
      }
    }
    
    localStorage.removeItem('pendingSync');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}
