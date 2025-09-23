// MESS WALLAH - Rocket-Speed Performance Monitor
import React, { useState, useEffect, memo } from 'react';
import { usePerformance } from '../hooks/usePerformance';

const PerformanceMonitor = memo(() => {
  const { metrics } = usePerformance();
  const [isVisible, setIsVisible] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState('unknown');
  const [memoryUsage, setMemoryUsage] = useState(null);

  useEffect(() => {
    // Show only in development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }

    // Monitor network speed
    const measureNetworkSpeed = async () => {
      try {
        const startTime = Date.now();
        await fetch('/api/health', { method: 'HEAD' });
        const endTime = Date.now();
        const speed = endTime - startTime;
        
        if (speed < 100) setNetworkSpeed('🚀 Fast');
        else if (speed < 300) setNetworkSpeed('⚡ Good');
        else if (speed < 1000) setNetworkSpeed('🐌 Slow');
        else setNetworkSpeed('🔴 Very Slow');
      } catch (error) {
        setNetworkSpeed('❌ Offline');
      }
    };

    // Monitor memory usage
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memInfo = performance.memory;
        setMemoryUsage({
          used: Math.round(memInfo.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memInfo.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(memInfo.jsHeapSizeLimit / 1024 / 1024)
        });
      }
    };

    const interval = setInterval(() => {
      measureNetworkSpeed();
      monitorMemory();
    }, 5000);

    // Initial measurement
    measureNetworkSpeed();
    monitorMemory();

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="rocket-performance-monitor">
      <div className="text-xs space-y-1">
        <div className="font-bold text-green-400">🚀 MESS WALLAH Performance</div>
        <div>Load: {metrics.loadTime}ms</div>
        <div>API Calls: {metrics.apiCalls}</div>
        <div>Cache Hits: {metrics.cacheHits}</div>
        <div>Network: {networkSpeed}</div>
        {memoryUsage && (
          <div>Memory: {memoryUsage.used}MB/{memoryUsage.total}MB</div>
        )}
        <div className="text-xs text-gray-400 mt-2">
          Press Ctrl+Shift+P to toggle
        </div>
      </div>
    </div>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

export default PerformanceMonitor;
