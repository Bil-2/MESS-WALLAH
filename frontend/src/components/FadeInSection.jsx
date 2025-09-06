import React from 'react';
import { motion } from 'framer-motion';

const FadeInSection = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 30
}) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance }
  };

  const variants = {
    hidden: {
      opacity: 0,
      ...directions[direction]
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.1,
        margin: "-100px"
      }}
      style={{
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInSection;
