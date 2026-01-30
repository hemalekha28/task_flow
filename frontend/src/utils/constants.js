// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  TASKS: {
    GET_ALL: '/tasks',
    GET_ONE: '/tasks/:id',
    CREATE: '/tasks',
    UPDATE: '/tasks/:id',
    DELETE: '/tasks/:id',
    DASHBOARD: '/tasks/dashboard',
  },
};

// Local Storage Keys
export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  THEME: 'theme',
  USER: 'user',
};

// Default Values
export const DEFAULT_VALUES = {
  PRIORITY: 'medium',
  STATUS: 'pending',
};

// Status Options
export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

// Priority Options
export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'text-priority-low' },
  { value: 'medium', label: 'Medium', color: 'text-priority-medium' },
  { value: 'high', label: 'High', color: 'text-priority-high' },
];

// Theme Options
export const THEME_OPTIONS = {
  DARK: 'dark',
  LIGHT: 'light',
};