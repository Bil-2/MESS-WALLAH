import { useEffect, useRef } from 'react';
import api from '../utils/api';

/**
 * Server Warmup Hook
 * Prevents cold starts by pre-warming the backend server when users visit the app
 * Uses localStorage to avoid redundant warmup calls
 */
const useServerWarmup = () => {
  const hasWarmedUp = useRef(false);

  useEffect(() => {
    const warmupServer = async () => {
      // Check if we've already warmed up in this session
      if (hasWarmedUp.current) {
        return;
      }

      // Check localStorage to avoid warming up too frequently
      const lastWarmup = localStorage.getItem('lastServerWarmup');
      const now = Date.now();
      const WARMUP_COOLDOWN = 5 * 60 * 1000; // 5 minutes

      if (lastWarmup && (now - parseInt(lastWarmup)) < WARMUP_COOLDOWN) {
        console.log('[Warmup] Server recently warmed, skipping...');
        hasWarmedUp.current = true;
        return;
      }

      try {
        console.log('[Warmup] Pre-warming server...');
        const startTime = Date.now();

        const response = await api.get('/warmup', {
          timeout: 15000, // 15 second timeout
        });

        const duration = Date.now() - startTime;

        if (response.data?.status === 'warmed') {
          console.log(`[Warmup] ✅ Server warmed successfully in ${duration}ms`);
          console.log('[Warmup] Metrics:', response.data.metrics);
        } else {
          console.log(`[Warmup] ⚠️ Partial warmup in ${duration}ms`, response.data);
        }

        // Update localStorage with successful warmup
        localStorage.setItem('lastServerWarmup', now.toString());
        hasWarmedUp.current = true;

      } catch (error) {
        console.log('[Warmup] Server warmup failed (non-critical):', error.message);
        // Don't block app loading if warmup fails
        // Server will warm up on first actual API call
      }
    };

    // Run warmup in background after a short delay
    // This ensures it doesn't block initial app rendering
    const timeoutId = setTimeout(warmupServer, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return null;
};

export default useServerWarmup;
