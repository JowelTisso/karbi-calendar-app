// API endpoint definitions
// These will be used when the backend is ready

export const ENDPOINTS = {
  // Holidays
  HOLIDAYS: {
    LIST: '/holidays',
    BY_YEAR: (year: number) => `/holidays/${year}`,
    BY_DATE: (date: string) => `/holidays/date/${date}`,
  },

  // Notes
  NOTES: {
    LIST: '/notes',
    CREATE: '/notes',
    BY_ID: (id: string) => `/notes/${id}`,
    UPDATE: (id: string) => `/notes/${id}`,
    DELETE: (id: string) => `/notes/${id}`,
    BY_DATE: (date: string) => `/notes/date/${date}`,
  },

  // Reminders
  REMINDERS: {
    LIST: '/reminders',
    CREATE: '/reminders',
    BY_ID: (id: string) => `/reminders/${id}`,
    UPDATE: (id: string) => `/reminders/${id}`,
    DELETE: (id: string) => `/reminders/${id}`,
    COMPLETE: (id: string) => `/reminders/${id}/complete`,
    BY_DATE: (date: string) => `/reminders/date/${date}`,
    UPCOMING: '/reminders/upcoming',
  },

  // Future: Authentication endpoints
  // AUTH: {
  //   LOGIN: '/auth/login',
  //   REGISTER: '/auth/register',
  //   LOGOUT: '/auth/logout',
  //   REFRESH: '/auth/refresh',
  //   PROFILE: '/auth/profile',
  // },
};

export default ENDPOINTS;
