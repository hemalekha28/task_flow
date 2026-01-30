import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { getAnimationProps } from '../../utils/animationUtils';

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true 
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full'
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...getAnimationProps({
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 }
          })}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleOverlayClick}
        >
          <motion.div
            {...getAnimationProps({
              initial: { scale: 0.9, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              exit: { scale: 0.9, opacity: 0 }
            })}
            className={clsx(
              'bg-dark-secondary rounded-xl border border-dark-card relative w-full',
              sizeClasses[size]
            )}
          >
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 pb-4 border-b border-dark-card">
                {title && (
                  <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-dark-card transition-colors"
                  >
                    <X className="h-5 w-5 text-text-secondary" />
                  </button>
                )}
              </div>
            )}
            <div className="p-6 pt-4">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;