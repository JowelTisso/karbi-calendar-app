// Redux store configuration

import { configureStore } from '@reduxjs/toolkit';
import {
  calendarReducer,
  holidaysReducer,
  notesReducer,
  remindersReducer,
} from '@/slices';
import { createPersistenceMiddleware } from './middleware/persistenceMiddleware';

// Create the Redux store
export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    holidays: holidaysReducer,
    notes: notesReducer,
    reminders: remindersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization check
        ignoredActions: [
          'reminders/createReminder/fulfilled',
          'reminders/updateReminder/fulfilled',
        ],
      },
    }).concat(createPersistenceMiddleware()),
  devTools: __DEV__,
});

// Infer types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export persistence utilities
export {
  loadPersistedState,
  clearPersistedState,
} from './middleware/persistenceMiddleware';
