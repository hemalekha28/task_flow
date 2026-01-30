// Utility to completely disable animations during development to prevent blinking UI
export const shouldReduceMotion = () => {
  // Always return true in development to prevent ALL animation-related flickering
  return process.env.NODE_ENV === 'development';
};

export const getAnimationProps = (defaultProps = {}) => {
  if (shouldReduceMotion()) {
    // Completely disable animations in development
    return { 
      initial: false, 
      animate: false, 
      exit: false,
      transition: { duration: 0, delay: 0 },
      whileHover: false,
      whileTap: false
    };
  }
  return defaultProps;
};