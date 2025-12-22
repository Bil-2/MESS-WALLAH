import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

/**
 * ScrollAnimation Component
 * Wraps children with scroll-triggered animations
 */
const ScrollAnimation = ({ 
  children, 
  animation = 'fade-in', 
  delay = 0,
  className = '',
  threshold = 0.1,
  triggerOnce = true 
}) => {
  const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce });

  const animationClasses = {
    'fade-in': 'scroll-fade-in',
    'fade-left': 'scroll-fade-left',
    'fade-right': 'scroll-fade-right',
    'scale': 'scroll-scale',
    'rotate': 'scroll-rotate',
    'slide-up': 'scroll-slide-up',
    'bounce': 'scroll-bounce'
  };

  const delayClasses = {
    0: '',
    1: 'scroll-stagger-1',
    2: 'scroll-stagger-2',
    3: 'scroll-stagger-3',
    4: 'scroll-stagger-4',
    5: 'scroll-stagger-5',
    6: 'scroll-stagger-6'
  };

  return (
    <div
      ref={ref}
      className={`${animationClasses[animation] || 'scroll-fade-in'} ${
        isVisible ? 'visible' : ''
      } ${delayClasses[delay] || ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation;
