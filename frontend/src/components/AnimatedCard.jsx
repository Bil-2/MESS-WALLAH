import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({
  children,
  className = '',
  delay = 0,
  hover = true,
  tap = true
}) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const hoverVariants = hover ? {
    scale: 1.02,
    y: -4,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  } : {};

  const tapVariants = tap ? {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  } : {};

  return (
    <motion.div
      className={`card ${className}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={hoverVariants}
      whileTap={tapVariants}
      viewport={{
        once: true,
        amount: 0.1,
        margin: "-50px"
      }}
      style={{
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
