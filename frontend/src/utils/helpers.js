import { format } from 'date-fns';

/**
 * Format date to readable string
 * @param {string|Date} date 
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy');
};

/**
 * Format date with time
 * @param {string|Date} date 
 * @returns {string}
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy h:mm a');
};

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password 
 * @returns {object} {isValid: boolean, errors: string[]}
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get priority color based on priority level
 * @param {string} priority 
 * @returns {string}
 */
export const getPriorityColor = (priority) => {
  const colors = {
    high: 'text-priority-high',
    medium: 'text-priority-medium',
    low: 'text-priority-low'
  };
  return colors[priority] || 'text-text-secondary';
};

/**
 * Get status color based on status
 * @param {string} status 
 * @returns {string}
 */
export const getStatusColor = (status) => {
  const colors = {
    pending: 'text-status-pending',
    in_progress: 'text-status-progress',
    completed: 'text-status-completed'
  };
  return colors[status] || 'text-text-secondary';
};

/**
 * Truncate text to specified length
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Calculate time difference between two dates
 * @param {Date} date1 
 * @param {Date} date2 
 * @returns {object} {days, hours, minutes}
 */
export const getTimeDifference = (date1, date2) => {
  const diffTime = Math.abs(new Date(date2) - new Date(date1));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days: diffDays, hours: diffHours, minutes: diffMinutes };
};

/**
 * Format file size to human readable format
 * @param {number} bytes 
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};