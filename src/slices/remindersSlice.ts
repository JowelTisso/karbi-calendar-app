// Reminders slice - Reminders CRUD with notification integration

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { RootState } from '@/store';
import type {
  Reminder,
  ReminderState,
  CreateReminderRequest,
  UpdateReminderRequest,
} from '@/types';
import {
  scheduleReminderNotification,
  cancelNotification,
  updateReminderNotification,
} from '@/utils/notificationHelpers';
import { toISODateString, parseDate } from '@/utils/dateHelpers';

const initialState: ReminderState = {
  reminders: {},
  remindersByDate: {},
  loading: false,
  error: null,
  notificationPermission: 'undetermined',
  syncStatus: 'idle',
};

// Helper to get date key from reminder time
const getDateKey = (reminderTime: string): string => {
  return toISODateString(parseDate(reminderTime));
};

// Helper to add reminder to date index
const addToDateIndex = (
  remindersByDate: Record<string, string[]>,
  dateKey: string,
  reminderId: string
) => {
  if (!remindersByDate[dateKey]) {
    remindersByDate[dateKey] = [];
  }
  if (!remindersByDate[dateKey].includes(reminderId)) {
    remindersByDate[dateKey].push(reminderId);
  }
};

// Helper to remove reminder from date index
const removeFromDateIndex = (
  remindersByDate: Record<string, string[]>,
  dateKey: string,
  reminderId: string
) => {
  if (remindersByDate[dateKey]) {
    remindersByDate[dateKey] = remindersByDate[dateKey].filter(id => id !== reminderId);
    if (remindersByDate[dateKey].length === 0) {
      delete remindersByDate[dateKey];
    }
  }
};

// Async thunk for creating a reminder
export const createReminder = createAsyncThunk<
  Reminder,
  CreateReminderRequest,
  { rejectValue: string }
>(
  'reminders/createReminder',
  async (request, { rejectWithValue }) => {
    try {
      const now = new Date().toISOString();
      const reminder: Reminder = {
        id: uuidv4(),
        ...request,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      };

      // Schedule notification
      const notificationId = await scheduleReminderNotification(reminder);
      if (notificationId) {
        reminder.notificationId = notificationId;
      }

      return reminder;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create reminder'
      );
    }
  }
);

// Async thunk for updating a reminder
export const updateReminder = createAsyncThunk<
  Reminder,
  UpdateReminderRequest,
  { state: RootState; rejectValue: string }
>(
  'reminders/updateReminder',
  async (request, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const existingReminder = state.reminders.reminders[request.id];

      if (!existingReminder) {
        return rejectWithValue('Reminder not found');
      }

      const updatedReminder: Reminder = {
        ...existingReminder,
        ...request,
        updatedAt: new Date().toISOString(),
      };

      // Update notification if time changed or status changed
      if (
        request.reminderTime !== existingReminder.reminderTime ||
        request.status !== existingReminder.status
      ) {
        const newNotificationId = await updateReminderNotification(
          existingReminder.notificationId,
          updatedReminder
        );
        updatedReminder.notificationId = newNotificationId || undefined;
      }

      return updatedReminder;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update reminder'
      );
    }
  }
);

// Async thunk for completing a reminder
export const completeReminder = createAsyncThunk<
  Reminder,
  string,
  { state: RootState; rejectValue: string }
>(
  'reminders/completeReminder',
  async (reminderId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const existingReminder = state.reminders.reminders[reminderId];

      if (!existingReminder) {
        return rejectWithValue('Reminder not found');
      }

      // Cancel notification
      if (existingReminder.notificationId) {
        await cancelNotification(existingReminder.notificationId);
      }

      const completedReminder: Reminder = {
        ...existingReminder,
        status: 'completed',
        notificationId: undefined,
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return completedReminder;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to complete reminder'
      );
    }
  }
);

// Async thunk for deleting a reminder
export const deleteReminder = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>(
  'reminders/deleteReminder',
  async (reminderId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const existingReminder = state.reminders.reminders[reminderId];

      if (!existingReminder) {
        return rejectWithValue('Reminder not found');
      }

      // Cancel notification
      if (existingReminder.notificationId) {
        await cancelNotification(existingReminder.notificationId);
      }

      return reminderId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to delete reminder'
      );
    }
  }
);

const remindersSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    // Set reminders (used for hydration from storage)
    setReminders: (
      state,
      action: PayloadAction<{
        reminders: Record<string, Reminder>;
        remindersByDate: Record<string, string[]>;
      }>
    ) => {
      state.reminders = action.payload.reminders;
      state.remindersByDate = action.payload.remindersByDate;
    },

    // Set notification permission status
    setNotificationPermission: (
      state,
      action: PayloadAction<'granted' | 'denied' | 'undetermined'>
    ) => {
      state.notificationPermission = action.payload;
    },

    // Clear error
    clearRemindersError: (state) => {
      state.error = null;
    },

    // Reset reminders state
    resetReminders: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Create reminder
      .addCase(createReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReminder.fulfilled, (state, action) => {
        const reminder = action.payload;
        const dateKey = getDateKey(reminder.reminderTime);

        state.reminders[reminder.id] = reminder;
        addToDateIndex(state.remindersByDate, dateKey, reminder.id);
        state.loading = false;
        state.syncStatus = 'synced';
      })
      .addCase(createReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create reminder';
        state.syncStatus = 'error';
      })

      // Update reminder
      .addCase(updateReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReminder.fulfilled, (state, action) => {
        const reminder = action.payload;
        const oldReminder = state.reminders[reminder.id];

        // Update date index if time changed
        if (oldReminder) {
          const oldDateKey = getDateKey(oldReminder.reminderTime);
          const newDateKey = getDateKey(reminder.reminderTime);

          if (oldDateKey !== newDateKey) {
            removeFromDateIndex(state.remindersByDate, oldDateKey, reminder.id);
            addToDateIndex(state.remindersByDate, newDateKey, reminder.id);
          }
        }

        state.reminders[reminder.id] = reminder;
        state.loading = false;
        state.syncStatus = 'synced';
      })
      .addCase(updateReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update reminder';
        state.syncStatus = 'error';
      })

      // Complete reminder
      .addCase(completeReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeReminder.fulfilled, (state, action) => {
        const reminder = action.payload;
        state.reminders[reminder.id] = reminder;
        state.loading = false;
        state.syncStatus = 'synced';
      })
      .addCase(completeReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to complete reminder';
        state.syncStatus = 'error';
      })

      // Delete reminder
      .addCase(deleteReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReminder.fulfilled, (state, action) => {
        const reminderId = action.payload;
        const reminder = state.reminders[reminderId];

        if (reminder) {
          const dateKey = getDateKey(reminder.reminderTime);
          removeFromDateIndex(state.remindersByDate, dateKey, reminderId);
          delete state.reminders[reminderId];
        }

        state.loading = false;
        state.syncStatus = 'synced';
      })
      .addCase(deleteReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete reminder';
        state.syncStatus = 'error';
      });
  },
});

// Export actions
export const {
  setReminders,
  setNotificationPermission,
  clearRemindersError,
  resetReminders,
} = remindersSlice.actions;

// Selectors
export const selectAllReminders = (state: RootState): Reminder[] =>
  Object.values(state.reminders.reminders).sort(
    (a, b) => new Date(a.reminderTime).getTime() - new Date(b.reminderTime).getTime()
  ) as Reminder[];

export const selectActiveReminders = (state: RootState): Reminder[] =>
  selectAllReminders(state).filter(r => r.status === 'active');

export const selectReminderById = (state: RootState, id: string): Reminder | undefined =>
  state.reminders.reminders[id];

export const selectRemindersByDate = (state: RootState, date: string): Reminder[] => {
  const ids = state.reminders.remindersByDate[date] || [];
  return ids.map(id => state.reminders.reminders[id]).filter(Boolean);
};

export const selectRemindersLoading = (state: RootState) => state.reminders.loading;
export const selectRemindersError = (state: RootState) => state.reminders.error;
export const selectNotificationPermission = (state: RootState) =>
  state.reminders.notificationPermission;

// Select upcoming reminders (next N days)
export const selectUpcomingReminders = (
  state: RootState,
  days: number = 7
): Reminder[] => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return selectActiveReminders(state).filter(reminder => {
    const reminderDate = new Date(reminder.reminderTime);
    return reminderDate >= now && reminderDate <= futureDate;
  });
};

// Check if date has reminders
export const selectDateHasReminders = (state: RootState, date: string): boolean =>
  (state.reminders.remindersByDate[date]?.length || 0) > 0;

export default remindersSlice.reducer;
