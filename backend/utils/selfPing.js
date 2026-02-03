const http = require('http');
const https = require('https');

/**
 * Self-Ping Keep-Alive Service
 * Prevents backend from spinning down due to inactivity
 * Pings the /health endpoint at regular intervals
 */

let intervalId = null;
let isRunning = false;

const selfPing = () => {
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5001}`;
  const healthUrl = `${baseUrl}/health`;

  console.log(`[SELF-PING] Pinging ${healthUrl}...`);

  const protocol = baseUrl.startsWith('https') ? https : http;
  const urlObj = new URL(healthUrl);

  const options = {
    hostname: urlObj.hostname,
    port: urlObj.port || (protocol === https ? 443 : 80),
    path: urlObj.pathname,
    method: 'GET',
    timeout: 10000,
    headers: {
      'User-Agent': 'MESS-WALLAH-Self-Ping/1.0',
      'X-Self-Ping': 'true'
    }
  };

  const req = protocol.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log(`[SELF-PING] ✓ Success (${res.statusCode}) - Server is warm`);
        try {
          const parsed = JSON.parse(data);
          if (parsed.uptime) {
            console.log(`[SELF-PING] Server uptime: ${parsed.uptime}s`);
          }
        } catch (e) {
          // Ignore JSON parse errors
        }
      } else {
        console.warn(`[SELF-PING] ⚠ Unexpected status: ${res.statusCode}`);
      }
    });
  });

  req.on('error', (error) => {
    console.error(`[SELF-PING] ✗ Error:`, error.message);
  });

  req.on('timeout', () => {
    console.error(`[SELF-PING] ✗ Timeout after 10s`);
    req.destroy();
  });

  req.end();
};

const startSelfPing = () => {
  if (isRunning) {
    console.log('[SELF-PING] Already running');
    return;
  }

  const interval = parseInt(process.env.SELF_PING_INTERVAL) || 600000; // Default 10 minutes
  const intervalMinutes = Math.floor(interval / 60000);

  console.log(`[SELF-PING] Starting keep-alive service`);
  console.log(`[SELF-PING] Ping interval: ${intervalMinutes} minute${intervalMinutes !== 1 ? 's' : ''}`);

  // Perform initial ping after 1 minute (allow server to fully initialize)
  setTimeout(() => {
    selfPing();
  }, 60000);

  // Set up recurring pings
  intervalId = setInterval(selfPing, interval);
  isRunning = true;

  console.log('[SELF-PING] Keep-alive service initialized');
};

const stopSelfPing = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    isRunning = false;
    console.log('[SELF-PING] Keep-alive service stopped');
  }
};

const getStatus = () => {
  return {
    running: isRunning,
    interval: process.env.SELF_PING_INTERVAL || 600000,
    baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 5001}`
  };
};

module.exports = {
  startSelfPing,
  stopSelfPing,
  getStatus,
  selfPing
};
