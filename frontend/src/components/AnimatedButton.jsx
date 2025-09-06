import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({
  children,
  className = '',
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  ...props
}) => {
  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.15,
        ease: 'easeOut'
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  const loadingVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };

  const baseClasses = `btn ${variant === 'primary' ? 'btn-primary' : variant === 'secondary' ? 'btn-secondary' : 'btn-outline'} ${className}`;

  return (
    <motion.button
      className={`${baseClasses} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      variants={buttonVariants}
      initial="initial"
      whileHover={!disabled && !loading ? "hover" : "initial"}
      whileTap={!disabled && !loading ? "tap" : "initial"}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
      {...props}
    >
      {loading && (
        <motion.div
          className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
          variants={loadingVariants}
          animate="animate"
        />
      )}
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
