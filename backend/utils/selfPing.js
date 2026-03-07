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

  const pingUrl = (path) => {
    const fullUrl = `${baseUrl}${path}`;
    const protocol = fullUrl.startsWith('https') ? https : http;
    const urlObj = new URL(fullUrl);

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (protocol === https ? 443 : 80),
      path: urlObj.pathname,
      method: 'GET',
      timeout: 10000,
      headers: { 'User-Agent': 'MESS-WALLAH-Self-Ping/1.0', 'X-Self-Ping': 'true' }
    };

    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', c => { data += c; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`[SELF-PING] OK ${path} — OK (${res.statusCode})`);
        } else {
          console.warn(`[SELF-PING] WARN ${path} — status ${res.statusCode}`);
        }
      });
    });
    req.on('error', e => console.error(`[SELF-PING] FAIL ${path} error:`, e.message));
    req.on('timeout', () => { console.error(`[SELF-PING] FAIL ${path} timeout`); req.destroy(); });
    req.end();
  };

  // Ping health AND warmup — keeps HTTP + DB pool alive
  pingUrl('/health');
  pingUrl('/api/warmup');
};

const startSelfPing = () => {
  if (isRunning) {
    console.log('[SELF-PING] Already running');
    return;
  }

  // 5 minutes — Render free tier spins down after 15 min of inactivity
  const interval = parseInt(process.env.SELF_PING_INTERVAL) || 300000;
  const intervalMinutes = Math.round(interval / 60000);

  console.log(`[SELF-PING] Starting keep-alive service`);
  console.log(`[SELF-PING] Ping interval: ${intervalMinutes} minutes`);
  console.log(`[SELF-PING] Pinging: ${process.env.BASE_URL || 'localhost'}`);

  // First ping after 15 seconds (server is ready)
  setTimeout(selfPing, 15000);

  // Recurring pings
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
