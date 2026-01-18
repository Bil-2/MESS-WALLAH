const https = require('https');
const http = require('http');

/**
 * Keep-Alive Service
 * Prevents server from spinning down on free-tier platforms
 * Pings the server every 12 minutes (aligned with GitHub Actions)
 * This provides redundancy if GitHub Actions fails
 */

const PING_INTERVAL = 12 * 60 * 1000; // 12 minutes in milliseconds
const BACKEND_URL = process.env.BASE_URL || process.env.BACKEND_URL || 'http://localhost:5001';

function pingServer() {
  const url = `${BACKEND_URL}/api/warmup`;
  const protocol = url.startsWith('https') ? https : http;

  const startTime = Date.now();

  protocol.get(url, (res) => {
    const duration = Date.now() - startTime;

    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log(`[KEEP-ALIVE] Warmup successful - ${res.statusCode} - ${duration}ms`);
        if (data.metrics) {
          console.log(`[KEEP-ALIVE] Metrics: DB ${data.metrics.databaseConnected ? 'Connected' : 'Disconnected'}, ` +
            `Rooms: ${data.metrics.roomsInDatabase || 0}, ` +
            `DB Query: ${data.metrics.databaseQueryTime}`);
        }
      } catch (error) {
        console.log(`[KEEP-ALIVE] Response received - ${res.statusCode} - ${duration}ms`);
      }
    });

    // Log if response is slow (> 3 seconds)
    if (duration > 3000) {
      console.warn(`[KEEP-ALIVE] ⚠️  Slow response detected: ${duration}ms`);
    }
  }).on('error', (err) => {
    console.error(`[KEEP-ALIVE] ❌ Ping failed:`, err.message);
  });
}

function startKeepAlive() {
  // Only run in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('[KEEP-ALIVE] Disabled in development mode');
    return null;
  }

  console.log(`[KEEP-ALIVE] Started - Pinging ${BACKEND_URL}/api/warmup every 12 minutes`);
  console.log('[KEEP-ALIVE] This provides redundancy to GitHub Actions workflow');

  // Ping immediately on startup
  setTimeout(pingServer, 5000); // Wait 5 seconds after server start

  // Then ping every 12 minutes
  return setInterval(pingServer, PING_INTERVAL);
}

module.exports = { startKeepAlive, pingServer };
