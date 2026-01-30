import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = false,
  interactive = false,
  ...props 
}) => {
  const variantClasses = {
    default: 'card',
    elevated: 'card shadow-card-hover',
    glass: 'glass-card',
    neumorphic: 'neumorphic',
    stat: 'card-stat',
    task: 'card-task',
    interactive: 'card-interactive'
  };

  const cardClasses = clsx(
    variantClasses[variant],
    { 'hover:-translate-y-1 hover:shadow-card-hover': hover },
    { 'card-interactive': interactive },
    className
  );

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className={cardClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;