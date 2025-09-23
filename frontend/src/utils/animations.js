// MESS WALLAH - Animation Utilities
// Optimized animations for desktop, tablet, and mobile
import React from 'react';

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Get device type for optimized animations
export const getDeviceType = () => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Optimized animation variants based on device
export const getAnimationVariants = (type = 'default') => {
  const deviceType = getDeviceType();
  const reducedMotion = prefersReducedMotion();

  // If user prefers reduced motion, return minimal animations
  if (reducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.1 } },
      exit: { opacity: 0, transition: { duration: 0.1 } }
    };
  }

  const variants = {
    // Card animations
    card: {
      mobile: {
        hidden: { opacity: 0, y: 10 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.2, ease: "easeOut" }
        },
        hover: { 
          y: -2,
          transition: { duration: 0.15, ease: "easeOut" }
        }
      },
      tablet: {
        hidden: { opacity: 0, y: 15 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.25, ease: "easeOut" }
        },
        hover: { 
          y: -3,
          transition: { duration: 0.2, ease: "easeOut" }
        }
      },
      desktop: {
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.3, ease: "easeOut" }
        },
        hover: { 
          y: -4,
          transition: { duration: 0.2, ease: "easeOut" }
        }
      }
    },

    // Modal animations
    modal: {
      mobile: {
        hidden: { opacity: 0, y: '100%' },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            type: "spring", 
            damping: 25, 
            stiffness: 300,
            duration: 0.3
          }
        },
        exit: { 
          opacity: 0, 
          y: '100%',
          transition: { duration: 0.25 }
        }
      },
      tablet: {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          transition: { 
            type: "spring", 
            damping: 25, 
            stiffness: 300,
            duration: 0.3
          }
        },
        exit: { 
          opacity: 0, 
          scale: 0.95, 
          y: 20,
          transition: { duration: 0.2 }
        }
      },
      desktop: {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          transition: { 
            type: "spring", 
            damping: 25, 
            stiffness: 300
          }
        },
        exit: { 
          opacity: 0, 
          scale: 0.95, 
          y: 20,
          transition: { duration: 0.2 }
        }
      }
    },

    // Button animations
    button: {
      mobile: {
        tap: { scale: 0.95 },
        hover: { scale: 1.02 }
      },
      tablet: {
        tap: { scale: 0.95 },
        hover: { scale: 1.02, y: -1 }
      },
      desktop: {
        tap: { scale: 0.95 },
        hover: { scale: 1.02, y: -2 }
      }
    },

    // List animations
    list: {
      mobile: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
          }
        }
      },
      tablet: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
          }
        }
      },
      desktop: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
          }
        }
      }
    },

    // Page transitions
    page: {
      mobile: {
        hidden: { opacity: 0, x: 10 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: { duration: 0.2, ease: "easeOut" }
        },
        exit: { 
          opacity: 0, 
          x: -10,
          transition: { duration: 0.15 }
        }
      },
      tablet: {
        hidden: { opacity: 0, x: 20 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: { duration: 0.25, ease: "easeOut" }
        },
        exit: { 
          opacity: 0, 
          x: -20,
          transition: { duration: 0.2 }
        }
      },
      desktop: {
        hidden: { opacity: 0, x: 30 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: { duration: 0.3, ease: "easeOut" }
        },
        exit: { 
          opacity: 0, 
          x: -30,
          transition: { duration: 0.25 }
        }
      }
    }
  };

  return variants[type]?.[deviceType] || variants.card[deviceType];
};

// Optimized spring configurations
export const springConfigs = {
  gentle: { type: "spring", damping: 20, stiffness: 300 },
  wobbly: { type: "spring", damping: 15, stiffness: 400 },
  stiff: { type: "spring", damping: 30, stiffness: 500 },
  slow: { type: "spring", damping: 25, stiffness: 200 }
};

// Easing functions
export const easings = {
  easeOut: [0.25, 0.46, 0.45, 0.94],
  easeIn: [0.55, 0.06, 0.68, 0.19],
  easeInOut: [0.42, 0, 0.58, 1],
  bounce: [0.68, -0.55, 0.265, 1.55]
};

// Performance optimized animation props
export const getOptimizedProps = () => ({
  // Enable hardware acceleration
  style: { transform: 'translateZ(0)' },
  // Optimize for animations
  whileHover: getDeviceType() === 'desktop' ? { scale: 1.02 } : undefined,
  whileTap: { scale: 0.95 },
  // Reduce animations on mobile for better performance
  transition: {
    duration: getDeviceType() === 'mobile' ? 0.2 : 0.3,
    ease: "easeOut"
  }
});

// Intersection Observer for scroll animations
export const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

// Debounced resize handler for responsive animations
export const useResponsiveAnimations = () => {
  const [deviceType, setDeviceType] = React.useState(getDeviceType());

  React.useEffect(() => {
    let timeoutId;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDeviceType(getDeviceType());
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return deviceType;
};
