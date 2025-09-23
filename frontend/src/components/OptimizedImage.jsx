// MESS WALLAH - Rocket-Fast Optimized Image Component
import React, { useState, useCallback, memo } from 'react';
import { useIntersectionObserver } from '../hooks/usePerformance';

const OptimizedImage = memo(({
  src,
  alt,
  className = '',
  placeholder = 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Loading...',
  blurDataURL,
  priority = false,
  sizes = '100vw',
  quality = 75,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : placeholder);
  
  const { elementRef, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  // Generate optimized image URLs for different screen sizes
  const generateSrcSet = useCallback((originalSrc) => {
    if (!originalSrc || originalSrc.includes('placeholder')) return '';
    
    const baseUrl = originalSrc.split('?')[0];
    const params = new URLSearchParams(originalSrc.split('?')[1] || '');
    
    // Add quality parameter if not present
    if (!params.has('q')) {
      params.set('q', quality.toString());
    }
    
    // Generate different sizes for responsive images
    const sizes = [400, 800, 1200, 1600];
    return sizes.map(size => {
      const newParams = new URLSearchParams(params);
      newParams.set('w', size.toString());
      return `${baseUrl}?${newParams.toString()} ${size}w`;
    }).join(', ');
  }, [quality]);

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  // Handle image error
  const handleError = useCallback(() => {
    setHasError(true);
    setCurrentSrc('https://via.placeholder.com/400x300/ef4444/ffffff?text=Error+Loading+Image');
  }, []);

  // Load actual image when in viewport
  React.useEffect(() => {
    if ((hasBeenVisible || priority) && currentSrc === placeholder && src) {
      setCurrentSrc(src);
    }
  }, [hasBeenVisible, priority, currentSrc, placeholder, src]);

  return (
    <div 
      ref={elementRef}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      <img
        src={currentSrc}
        alt={alt}
        srcSet={generateSrcSet(currentSrc)}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`
          w-full h-full object-cover transition-all duration-500 ease-out
          ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
          ${hasError ? 'filter grayscale' : ''}
        `}
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: '400px 300px'
        }}
      />
      
      {/* Loading indicator */}
      {!isLoaded && !hasError && currentSrc !== placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      )}
      
      {/* Error indicator */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20">
          <div className="text-center text-red-500 dark:text-red-400">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-xs">Failed to load</p>
          </div>
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
