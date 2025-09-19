import React, { memo, useMemo, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Higher-order component for performance optimization
export const withPerformanceOptimization = (Component) => {
  return memo((props) => {
    const shouldReduceMotion = useReducedMotion();
    
    const optimizedProps = useMemo(() => ({
      ...props,
      // Disable animations for users who prefer reduced motion
      animate: shouldReduceMotion ? false : props.animate,
      transition: shouldReduceMotion ? { duration: 0 } : props.transition
    }), [props, shouldReduceMotion]);

    return <Component {...optimizedProps} />;
  });
};

// Optimized motion component
export const OptimizedMotion = memo(({ children, ...props }) => {
  const shouldReduceMotion = useReducedMotion();
  
  const motionProps = useMemo(() => ({
    ...props,
    animate: shouldReduceMotion ? false : props.animate,
    transition: shouldReduceMotion ? { duration: 0 } : {
      duration: 0.3,
      ease: 'easeOut',
      ...props.transition
    }
  }), [props, shouldReduceMotion]);

  return (
    <motion.div {...motionProps}>
      {children}
    </motion.div>
  );
});

// Virtualized list component for large datasets
export const VirtualizedList = memo(({ 
  items, 
  renderItem, 
  itemHeight = 100, 
  containerHeight = 400,
  overscan = 5 
}) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      ...item,
      index: startIndex + index
    }));
  }, [items, scrollTop, itemHeight, containerHeight, overscan]);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return (
    <div 
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item) => (
          <div
            key={item.id || item.index}
            style={{
              position: 'absolute',
              top: item.index * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            {renderItem(item, item.index)}
          </div>
        ))}
      </div>
    </div>
  );
});

// Debounced input component
export const DebouncedInput = memo(({ 
  value, 
  onChange, 
  delay = 300, 
  ...props 
}) => {
  const [localValue, setLocalValue] = React.useState(value);
  const timeoutRef = React.useRef();

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, delay);
  }, [onChange, delay]);

  return (
    <input
      {...props}
      value={localValue}
      onChange={handleChange}
    />
  );
});

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasIntersected, setHasIntersected] = React.useState(false);
  const elementRef = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasIntersected, options]);

  return [elementRef, isIntersecting, hasIntersected];
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = React.useState({});

  React.useEffect(() => {
    // Monitor Core Web Vitals
    if ('web-vitals' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(setMetrics);
        getFID(setMetrics);
        getFCP(setMetrics);
        getLCP(setMetrics);
        getTTFB(setMetrics);
      });
    }

    // Monitor memory usage
    if ('memory' in performance) {
      const memoryInfo = performance.memory;
      setMetrics(prev => ({
        ...prev,
        memory: {
          used: memoryInfo.usedJSHeapSize,
          total: memoryInfo.totalJSHeapSize,
          limit: memoryInfo.jsHeapSizeLimit
        }
      }));
    }
  }, []);

  return metrics;
};

// Optimized card component
export const OptimizedCard = memo(({ 
  children, 
  className = '', 
  hover = true,
  ...props 
}) => {
  const shouldReduceMotion = useReducedMotion();
  
  const hoverProps = useMemo(() => {
    if (!hover || shouldReduceMotion) return {};
    
    return {
      whileHover: { 
        y: -4, 
        scale: 1.02,
        transition: { duration: 0.2 }
      },
      whileTap: { 
        scale: 0.98,
        transition: { duration: 0.1 }
      }
    };
  }, [hover, shouldReduceMotion]);

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...hoverProps}
      {...props}
    >
      {children}
    </motion.div>
  );
});

OptimizedMotion.displayName = 'OptimizedMotion';
VirtualizedList.displayName = 'VirtualizedList';
DebouncedInput.displayName = 'DebouncedInput';
OptimizedCard.displayName = 'OptimizedCard';
