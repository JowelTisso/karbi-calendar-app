// Persistence middleware - Auto-save Redux state to AsyncStorage

import { Middleware, AnyAction, Dispatch } from '@reduxjs/toolkit';
import { storage } from '@/utils/storageHelpers';
import { STORAGE_KEYS } from '@/utils/constants';
import { Holiday, Note, Reminder } from '@/types';

type PersistedState = {
  notes: {
    notes: Record<string, Note>;
    notesByDate: Record<string, any[]>;
  };
  reminders: {
    reminders: Record<string, Reminder>;
    remindersByDate: Record<string, any[]>;
  };
  holidays: {
    holidays: Record<string, Holiday>;
    holidaysByDate: Record<string, any[]>;
    lastFetched: string | null;
    currentYear: number;
  };
};

// Debounce delay for saving (ms)
const SAVE_DEBOUNCE_MS = 1000;

// Actions that should trigger persistence
const PERSIST_ACTIONS = [
  // Notes actions
  'notes/createNote/fulfilled',
  'notes/updateNote/fulfilled',
  'notes/deleteNote/fulfilled',
  'notes/setNotes',
  'notes/resetNotes',
  // Reminders actions
  'reminders/createReminder/fulfilled',
  'reminders/updateReminder/fulfilled',
  'reminders/completeReminder/fulfilled',
  'reminders/deleteReminder/fulfilled',
  'reminders/setReminders',
  'reminders/resetReminders',
  // Holidays actions (for caching)
  'holidays/fetchHolidays/fulfilled',
  'holidays/setHolidays',
];

// Track pending saves
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

// Save state to AsyncStorage
const saveState = async (state: PersistedState): Promise<void> => {
  try {
    // Save notes
    await storage.save(STORAGE_KEYS.NOTES, {
      notes: state.notes.notes,
      notesByDate: state.notes.notesByDate,
    });

    // Save reminders
    await storage.save(STORAGE_KEYS.REMINDERS, {
      reminders: state.reminders.reminders,
      remindersByDate: state.reminders.remindersByDate,
    });

    // Save holidays cache
    await storage.save(STORAGE_KEYS.HOLIDAYS_CACHE, {
      holidays: state.holidays.holidays,
      holidaysByDate: state.holidays.holidaysByDate,
      lastFetched: state.holidays.lastFetched,
      currentYear: state.holidays.currentYear,
    });

    console.log('[Persistence] State saved to storage');
  } catch (error) {
    console.error('[Persistence] Failed to save state:', error);
  }
};

// Debounced save function
const debouncedSave = (state: PersistedState): void => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    saveState(state);
    saveTimeout = null;
  }, SAVE_DEBOUNCE_MS);
};

// Create the persistence middleware
export const createPersistenceMiddleware = (): Middleware => {
  return (store) => (next) => (action) => {
    // First, let the action pass through
    const result = next(action);

    // Check if this action should trigger persistence
    if (PERSIST_ACTIONS.includes((action as AnyAction).type)) {
      const state = store.getState();
      debouncedSave(state);
    }

    return result;
  };
};

// Load persisted state on app startup
export const loadPersistedState = async (): Promise<{
  notes?: {
    notes: PersistedState['notes']['notes'];
    notesByDate: PersistedState['notes']['notesByDate'];
  };
  reminders?: {
    reminders: PersistedState['reminders']['reminders'];
    remindersByDate: PersistedState['reminders']['remindersByDate'];
  };
  holidays?: {
    holidays: PersistedState['holidays']['holidays'];
    holidaysByDate: PersistedState['holidays']['holidaysByDate'];
    lastFetched: string | null;
    currentYear: number;
  };
}> => {
  try {
    const [notes, reminders, holidays] = await Promise.all([
      storage.load(STORAGE_KEYS.NOTES),
      storage.load(STORAGE_KEYS.REMINDERS),
      storage.load(STORAGE_KEYS.HOLIDAYS_CACHE),
    ]);

    console.log('[Persistence] State loaded from storage');

    return {
      notes: (notes as any) || undefined,
      reminders: (reminders as any) || undefined,
      holidays: (holidays as any) || undefined,
    };
  } catch (error) {
    console.error('[Persistence] Failed to load state:', error);
    return {};
  }
};

// Clear all persisted data
export const clearPersistedState = async (): Promise<void> => {
  try {
    await Promise.all([
      storage.remove(STORAGE_KEYS.NOTES),
      storage.remove(STORAGE_KEYS.REMINDERS),
      storage.remove(STORAGE_KEYS.HOLIDAYS_CACHE),
    ]);
    console.log('[Persistence] All persisted state cleared');
  } catch (error) {
    console.error('[Persistence] Failed to clear state:', error);
  }
};

export default createPersistenceMiddleware;
