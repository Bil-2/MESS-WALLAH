import React, { useState, useEffect, memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Device detection hook
export const useDeviceDetection = () => {
  const [device, setDevice] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isTouch: false,
    screenSize: 'desktop'
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      
      let screenSize = 'desktop';
      if (isMobile) screenSize = 'mobile';
      else if (isTablet) screenSize = 'tablet';
      
      setDevice({
        isMobile,
        isTablet,
        isDesktop,
        isTouch: isTouchDevice,
        screenSize,
        width,
        height,
        orientation: width > height ? 'landscape' : 'portrait'
      });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return device;
};

// Responsive container component
export const ResponsiveContainer = memo(({ 
  children, 
  className = '',
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = '',
  ...props 
}) => {
  const device = useDeviceDetection();
  
  const responsiveClassName = React.useMemo(() => {
    let classes = className;
    
    if (device.isMobile && mobileClassName) {
      classes += ` ${mobileClassName}`;
    } else if (device.isTablet && tabletClassName) {
      classes += ` ${tabletClassName}`;
    } else if (device.isDesktop && desktopClassName) {
      classes += ` ${desktopClassName}`;
    }
    
    return classes;
  }, [className, mobileClassName, tabletClassName, desktopClassName, device]);

  return (
    <div className={responsiveClassName} {...props}>
      {children}
    </div>
  );
});

// Responsive grid component
export const ResponsiveGrid = memo(({ 
  children, 
  className = '',
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = { mobile: 4, tablet: 6, desktop: 8 },
  ...props 
}) => {
  const device = useDeviceDetection();
  
  const gridClassName = React.useMemo(() => {
    const currentCols = cols[device.screenSize] || cols.desktop;
    const currentGap = gap[device.screenSize] || gap.desktop;
    
    return `grid grid-cols-${currentCols} gap-${currentGap} ${className}`;
  }, [cols, gap, device.screenSize, className]);

  return (
    <div className={gridClassName} {...props}>
      {children}
    </div>
  );
});

// Touch-optimized button component
export const TouchOptimizedButton = memo(({ 
  children, 
  className = '',
  size = 'medium',
  variant = 'primary',
  disabled = false,
  loading = false,
  onClick,
  ...props 
}) => {
  const device = useDeviceDetection();
  const shouldReduceMotion = useReducedMotion();
  
  const sizeClasses = React.useMemo(() => {
    const sizes = {
      small: device.isMobile ? 'px-4 py-3 text-sm' : 'px-3 py-2 text-sm',
      medium: device.isMobile ? 'px-6 py-4 text-base' : 'px-4 py-2 text-base',
      large: device.isMobile ? 'px-8 py-5 text-lg' : 'px-6 py-3 text-lg'
    };
    return sizes[size] || sizes.medium;
  }, [size, device.isMobile]);
  
  const variantClasses = React.useMemo(() => {
    const variants = {
      primary: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600',
      secondary: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
      outline: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
    };
    return variants[variant] || variants.primary;
  }, [variant]);

  const motionProps = React.useMemo(() => {
    if (shouldReduceMotion) return {};
    
    return {
      whileTap: { scale: 0.95 },
      whileHover: device.isTouch ? {} : { scale: 1.02 },
      transition: { duration: 0.1 }
    };
  }, [shouldReduceMotion, device.isTouch]);

  return (
    <motion.button
      className={`
        ${sizeClasses} 
        ${variantClasses} 
        ${className}
        rounded-xl font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${device.isMobile ? 'min-h-[44px]' : 'min-h-[36px]'}
        ${device.isTouch ? 'active:scale-95' : ''}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
});

// Responsive text component
export const ResponsiveText = memo(({ 
  children, 
  as = 'p',
  size = 'base',
  className = '',
  ...props 
}) => {
  const device = useDeviceDetection();
  const Component = as;
  
  const responsiveSize = React.useMemo(() => {
    const sizes = {
      xs: device.isMobile ? 'text-xs' : 'text-xs',
      sm: device.isMobile ? 'text-sm' : 'text-sm',
      base: device.isMobile ? 'text-base' : 'text-base',
      lg: device.isMobile ? 'text-lg' : 'text-lg',
      xl: device.isMobile ? 'text-xl' : 'text-xl',
      '2xl': device.isMobile ? 'text-xl' : 'text-2xl',
      '3xl': device.isMobile ? 'text-2xl' : 'text-3xl',
      '4xl': device.isMobile ? 'text-3xl' : 'text-4xl',
      '5xl': device.isMobile ? 'text-4xl' : 'text-5xl',
      '6xl': device.isMobile ? 'text-5xl' : 'text-6xl'
    };
    return sizes[size] || sizes.base;
  }, [size, device.isMobile]);

  return (
    <Component 
      className={`${responsiveSize} ${className}`} 
      {...props}
    >
      {children}
    </Component>
  );
});

// Mobile-optimized modal component
export const ResponsiveModal = memo(({ 
  isOpen, 
  onClose, 
  children, 
  title,
  className = '',
  ...props 
}) => {
  const device = useDeviceDetection();
  const shouldReduceMotion = useReducedMotion();
  
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: shouldReduceMotion ? 1 : 0.95,
      y: shouldReduceMotion ? 0 : 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      
      {/* Modal */}
      <motion.div
        className={`
          relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl
          ${device.isMobile ? 'w-full max-w-sm mx-4' : 'w-full max-w-md'}
          max-h-[90vh] overflow-y-auto
          ${className}
        `}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        {...props}
      >
        {title && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
});

ResponsiveContainer.displayName = 'ResponsiveContainer';
ResponsiveGrid.displayName = 'ResponsiveGrid';
TouchOptimizedButton.displayName = 'TouchOptimizedButton';
ResponsiveText.displayName = 'ResponsiveText';
ResponsiveModal.displayName = 'ResponsiveModal';
