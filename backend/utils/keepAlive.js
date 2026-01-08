const https = require('https');
const http = require('http');

/**
 * Keep-Alive Service
 * Prevents server from spinning down on free-tier platforms
 * Pings the server every 14 minutes (Render free tier spins down after 15 min of inactivity)
 */

const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds
const BACKEND_URL = process.env.BASE_URL || process.env.BACKEND_URL || 'http://localhost:5001';

function pingServer() {
  const url = `${BACKEND_URL}/health`;
  const protocol = url.startsWith('https') ? https : http;

  const startTime = Date.now();

  protocol.get(url, (res) => {
    const duration = Date.now() - startTime;
    console.log(`[KEEP-ALIVE] Ping successful - ${res.statusCode} - ${duration}ms`);

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

  console.log(`[KEEP-ALIVE] Started - Pinging ${BACKEND_URL}/health every 14 minutes`);

  // Ping immediately on startup
  setTimeout(pingServer, 5000); // Wait 5 seconds after server start

  // Then ping every 14 minutes
  return setInterval(pingServer, PING_INTERVAL);
}

module.exports = { startKeepAlive, pingServer };
