import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal Component - Adds scroll-triggered animations to children
 * @param {string} animation - Animation type: 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom', 'flip', 'slide-up', 'bounce'
 * @param {number} delay - Animation delay in ms
 * @param {number} duration - Animation duration in ms
 * @param {number} threshold - Intersection threshold (0-1)
 * @param {boolean} once - Trigger animation only once
 */
const ScrollReveal = ({ 
  children, 
  animation = 'fade-up', 
  delay = 0, 
  duration = 600,
  threshold = 0.1,
  once = true,
  className = '',
  style = {}
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [threshold, once]);

  const getAnimationStyles = () => {
    const baseStyles = {
      transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      transitionDelay: `${delay}ms`,
    };

    const hiddenStyles = {
      'fade-up': { opacity: 0, transform: 'translateY(40px)' },
      'fade-down': { opacity: 0, transform: 'translateY(-40px)' },
      'fade-left': { opacity: 0, transform: 'translateX(-40px)' },
      'fade-right': { opacity: 0, transform: 'translateX(40px)' },
      'zoom': { opacity: 0, transform: 'scale(0.85)' },
      'zoom-in': { opacity: 0, transform: 'scale(0.5)' },
      'flip': { opacity: 0, transform: 'perspective(1000px) rotateX(-10deg)' },
      'slide-up': { opacity: 0, transform: 'translateY(60px)' },
      'bounce': { opacity: 0, transform: 'translateY(30px) scale(0.95)' },
      'rotate': { opacity: 0, transform: 'rotate(-5deg) scale(0.95)' },
      'blur': { opacity: 0, filter: 'blur(10px)', transform: 'translateY(20px)' },
    };

    const visibleStyles = {
      'fade-up': { opacity: 1, transform: 'translateY(0)' },
      'fade-down': { opacity: 1, transform: 'translateY(0)' },
      'fade-left': { opacity: 1, transform: 'translateX(0)' },
      'fade-right': { opacity: 1, transform: 'translateX(0)' },
      'zoom': { opacity: 1, transform: 'scale(1)' },
      'zoom-in': { opacity: 1, transform: 'scale(1)' },
      'flip': { opacity: 1, transform: 'perspective(1000px) rotateX(0)' },
      'slide-up': { opacity: 1, transform: 'translateY(0)' },
      'bounce': { opacity: 1, transform: 'translateY(0) scale(1)' },
      'rotate': { opacity: 1, transform: 'rotate(0) scale(1)' },
      'blur': { opacity: 1, filter: 'blur(0)', transform: 'translateY(0)' },
    };

    return {
      ...baseStyles,
      ...(isVisible ? visibleStyles[animation] : hiddenStyles[animation])
    };
  };

  return (
    <div 
      ref={ref} 
      style={{ ...getAnimationStyles(), ...style }}
      className={className}
    >
      {children}
    </div>
  );
};

/**
 * ScrollRevealGroup - Staggers animations for multiple children
 */
export const ScrollRevealGroup = ({ 
  children, 
  animation = 'fade-up',
  staggerDelay = 100,
  duration = 600,
  className = ''
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <ScrollReveal 
          animation={animation} 
          delay={index * staggerDelay}
          duration={duration}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
};

export default ScrollReveal;
