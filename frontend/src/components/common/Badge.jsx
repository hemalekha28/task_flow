import React from 'react';
import clsx from 'clsx';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '' 
}) => {
  const variantClasses = {
    default: 'badge',
    primary: 'badge',
    secondary: 'badge',
    success: 'badge',
    warning: 'badge',
    danger: 'badge',
    info: 'badge',
    pending: 'badge-pending',
    progress: 'badge-progress',
    completed: 'badge-completed',
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low'
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const classes = clsx(
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge;