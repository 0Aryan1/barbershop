// App constants and configuration
export const APP_CONFIG = {
  name: 'BarberQueue',
  version: '1.0.0',
  author: 'Barbershop Management',
  description: 'Modern barbershop queue management system',
};

export const BUSINESS_HOURS = {
  open: '09:00',
  close: '20:00',
  timezone: 'local',
};

export const QUEUE_CONFIG = {
  maxQueueSize: 50,
  averageServiceTime: 30, // minutes
  autoProgressInterval: 2 * 60 * 1000, // 2 minutes in milliseconds
  notificationThreshold: 3, // notify when 3 people ahead
};

export const USER_ROLES = {
  CUSTOMER: 'customer',
  BARBER: 'barber',
  ADMIN: 'admin',
};

export const QUEUE_STATUS = {
  WAITING: 'waiting',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

export const SERVICE_CATEGORIES = {
  HAIRCUT: 'haircut',
  SHAVE: 'shave',
  STYLING: 'styling',
  BEARD: 'beard',
  COMBO: 'combo',
};

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
};

export const BREAKPOINTS = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1200px',
  large: '1400px',
};

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'barbershop_user_preferences',
  QUEUE_DATA: 'barbershop_queue_data',
  USER_PROFILE: 'barbershop_user_profile',
  THEME: 'barbershop_theme',
  LOCATION: 'barbershop_location',
};

export const API_ENDPOINTS = {
  BARBERSHOPS: '/api/barbershops',
  QUEUE: '/api/queue',
  APPOINTMENTS: '/api/appointments',
  SERVICES: '/api/services',
  USERS: '/api/users',
  NOTIFICATIONS: '/api/notifications',
};

export const DEFAULT_LOCATION = {
  latitude: 40.7128,
  longitude: -74.0060,
  city: 'New York',
  state: 'NY',
};

export const RATING_SCALE = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 4,
};

export const SEARCH_RADIUS = {
  NEARBY: 5, // km
  CITY: 25, // km
  REGION: 100, // km
};