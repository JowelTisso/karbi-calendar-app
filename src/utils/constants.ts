// Application constants

// Storage keys for AsyncStorage
export const STORAGE_KEYS = {
  NOTES: '@calendar_app/notes',
  REMINDERS: '@calendar_app/reminders',
  HOLIDAYS: '@calendar_app/holidays',
  SETTINGS: '@calendar_app/settings',
  VERSION: '@calendar_app/version',
  THEME_PREFERENCE: '@calendar_app/theme',
  HOLIDAYS_CACHE: '@calendar_app/holidays_cache',
} as const;

// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/v1',
  TIMEOUT: 10000, // 10 seconds
  RETRY_COUNT: 3,
} as const;

// Cache TTL (time to live)
export const CACHE_TTL = {
  HOLIDAYS: 24 * 60 * 60 * 1000, // 24 hours
  NOTES: 5 * 60 * 1000, // 5 minutes
  REMINDERS: 5 * 60 * 1000, // 5 minutes
} as const;

// Persistence debounce time (ms)
export const PERSISTENCE_DEBOUNCE = 300;

// Notification channel ID (Android)
export const NOTIFICATION_CHANNEL_ID = 'reminders';

// Default country for holidays
export const DEFAULT_COUNTRY = 'US';

// Date formats
export const DATE_FORMATS = {
  ISO: 'yyyy-MM-dd',
  ISO_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss'Z'",
  DISPLAY_DATE: 'MMM d, yyyy',
  DISPLAY_DATE_SHORT: 'MMM d',
  DISPLAY_TIME: 'h:mm a',
  DISPLAY_DATETIME: 'MMM d, yyyy h:mm a',
  MONTH_YEAR: 'MMMM yyyy',
  MONTH_KEY: 'yyyy-MM',
  DAY_OF_WEEK: 'EEEE',
  DAY_OF_WEEK_SHORT: 'EEE',
} as const;

// Weekday names
export const WEEKDAYS = {
  FULL: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORT: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROW: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
} as const;

// Month names
export const MONTHS = {
  FULL: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  SHORT: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
} as const;

// Limits
export const LIMITS = {
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 2000,
  MAX_TAGS: 10,
  MAX_SCHEDULED_NOTIFICATIONS: 500, // Android limit
  NOTES_PER_PAGE: 50,
  REMINDERS_PER_PAGE: 50,
} as const;

// Animation durations (ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 400,
} as const;

// Bottom sheet snap points
export const BOTTOM_SHEET_SNAP_POINTS = {
  SMALL: '25%',
  MEDIUM: '50%',
  LARGE: '75%',
  FULL: '90%',
} as const;
