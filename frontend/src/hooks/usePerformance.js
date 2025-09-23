// MESS WALLAH - Advanced Performance Optimization Hook
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Performance monitoring and optimization utilities
export const usePerformance = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    apiCalls: 0,
    cacheHits: 0
  });

  const startTime = useRef(Date.now());
  const renderCount = useRef(0);

  useEffect(() => {
    // Track initial load time
    const loadTime = Date.now() - startTime.current;
    setMetrics(prev => ({ ...prev, loadTime }));

    // Performance observer for Core Web Vitals
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'measure') {
            console.log(`Performance: ${entry.name} took ${entry.duration}ms`);
          }
        });
      });
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    }
  }, []);

  const trackRender = useCallback(() => {
    renderCount.current++;
    const renderTime = Date.now() - startTime.current;
    setMetrics(prev => ({ ...prev, renderTime, renders: renderCount.current }));
  }, []);

  const trackApiCall = useCallback(() => {
    setMetrics(prev => ({ ...prev, apiCalls: prev.apiCalls + 1 }));
  }, []);

  const trackCacheHit = useCallback(() => {
    setMetrics(prev => ({ ...prev, cacheHits: prev.cacheHits + 1 }));
  }, []);

  return { metrics, trackRender, trackApiCall, trackCacheHit };
};

// Optimized debounce hook
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook for performance
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now());

  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
      if (entry.isIntersecting && !hasBeenVisible) {
        setHasBeenVisible(true);
      }
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [hasBeenVisible, options]);

  return { elementRef, isVisible, hasBeenVisible };
};

// Memory optimization hook
export const useMemoryOptimization = () => {
  const cleanup = useCallback(() => {
    // Clear any intervals, timeouts, or subscriptions
    if (window.gc && typeof window.gc === 'function') {
      window.gc();
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return { cleanup };
};

// Virtual scrolling hook for large lists
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight
    }));
  }, [items, itemHeight, containerHeight, scrollTop]);

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return { visibleItems, totalHeight, handleScroll };
};

export default usePerformance;
