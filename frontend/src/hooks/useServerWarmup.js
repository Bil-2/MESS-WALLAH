import { useEffect, useRef } from 'react';
import api from '../utils/api';

/**
 * Enhanced Server Warmup Hook — 100% Cold Start Prevention
 *
 * Strategy:
 * 1. Immediately ping on first render
 * 2. Retry every 2 seconds until server responds (handles 15-30s cold start)
 * 3. After success, re-ping every 4 minutes to keep server awake
 * 4. Uses localStorage so duplicated across tabs doesn't waste calls
 */
const useServerWarmup = () => {
  const hasWarmedUp = useRef(false);
  const retryTimer = useRef(null);
  const keepAliveTimer = useRef(null);

  useEffect(() => {
    const RETRY_INTERVAL = 2500;      // retry every 2.5s during cold start
    const KEEPALIVE_INTERVAL = 4 * 60 * 1000; // ping every 4 min to stay warm
    const COOLDOWN = 2 * 60 * 1000;  // skip if warmed within 2 minutes

    const pingServer = async () => {
      try {
        const res = await api.get('/warmup', { timeout: 30000 });

        if (res.data?.status === 'warmed' || res.data?.status === 'partial') {
          console.log('[Warmup] ✅ Server is warm:', res.data.metrics?.totalResponseTime);
          hasWarmedUp.current = true;
          localStorage.setItem('lastServerWarmup', Date.now().toString());

          // Clear retry loop
          if (retryTimer.current) clearInterval(retryTimer.current);

          // Schedule keep-alive pings to prevent future cold starts
          keepAliveTimer.current = setInterval(() => {
            api.get('/warmup', { timeout: 10000 }).catch(() => { });
          }, KEEPALIVE_INTERVAL);
        }
      } catch (err) {
        // Server is still sleeping — retry loop will fire again
        console.log('[Warmup] Server sleeping, retrying in 2.5s...', err.code);
      }
    };

    const startWarmup = () => {
      // Skip if recently warmed
      const lastWarmup = localStorage.getItem('lastServerWarmup');
      if (lastWarmup && Date.now() - parseInt(lastWarmup) < COOLDOWN) {
        console.log('[Warmup] Server recently warm, skipping initial ping.');
        hasWarmedUp.current = true;
        // Still set up keep-alive
        keepAliveTimer.current = setInterval(() => {
          api.get('/warmup', { timeout: 10000 }).catch(() => { });
        }, KEEPALIVE_INTERVAL);
        return;
      }

      // Immediate first ping
      pingServer();

      // Retry loop in case of cold start
      retryTimer.current = setInterval(() => {
        if (!hasWarmedUp.current) {
          pingServer();
        } else {
          clearInterval(retryTimer.current);
        }
      }, RETRY_INTERVAL);
    };

    // Start warmup after a tiny delay so it doesn't block initial render
    const initTimer = setTimeout(startWarmup, 200);

    return () => {
      clearTimeout(initTimer);
      if (retryTimer.current) clearInterval(retryTimer.current);
      if (keepAliveTimer.current) clearInterval(keepAliveTimer.current);
    };
  }, []);

  return null;
};

export default useServerWarmup;
