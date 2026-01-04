// Holidays slice - Holiday data management with caching

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { Holiday, HolidayState, FetchHolidaysParams } from '@/types';
import { getCurrentYear } from '@/utils/dateHelpers';
import { CACHE_TTL } from '@/utils/constants';

const initialState: HolidayState = {
  holidays: {},
  holidaysByDate: {},
  loading: false,
  error: null,
  lastFetched: null,
  currentYear: getCurrentYear(),
};

// Async thunk for fetching holidays
export const fetchHolidays = createAsyncThunk<
  Holiday[],
  FetchHolidaysParams,
  { state: RootState; rejectValue: string }
>(
  'holidays/fetchHolidays',
  async (params, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { lastFetched, currentYear } = state.holidays;

      // Check cache validity
      if (lastFetched && params.year === currentYear) {
        const cacheAge = Date.now() - new Date(lastFetched).getTime();
        if (cacheAge < CACHE_TTL.HOLIDAYS) {
          // Return empty to skip update (cache is valid)
          return [];
        }
      }

      // TODO: Replace with actual API call when backend is ready
      // For now, return mock data
      const { getMockHolidays } = await import('@/api/mock/mockHolidays');
      const holidays = getMockHolidays(params.year);

      return holidays;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch holidays'
      );
    }
  }
);

const holidaysSlice = createSlice({
  name: 'holidays',
  initialState,
  reducers: {
    // Set holidays (used for hydration from storage)
    setHolidays: (
      state,
      action: PayloadAction<{
        holidays: Record<string, Holiday>;
        holidaysByDate: Record<string, string[]>;
        lastFetched: string | null;
        currentYear: number;
      }>
    ) => {
      state.holidays = action.payload.holidays;
      state.holidaysByDate = action.payload.holidaysByDate;
      state.lastFetched = action.payload.lastFetched;
      state.currentYear = action.payload.currentYear;
    },

    // Clear holidays cache
    clearHolidaysCache: (state) => {
      state.lastFetched = null;
    },

    // Clear error
    clearHolidaysError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHolidays.fulfilled, (state, action) => {
        state.loading = false;

        // Skip if returned empty (cache was valid)
        if (action.payload.length === 0) return;

        // Normalize holidays by ID
        const holidays: Record<string, Holiday> = {};
        const holidaysByDate: Record<string, string[]> = {};

        for (const holiday of action.payload) {
          holidays[holiday.id] = holiday;

          // Index by date
          if (!holidaysByDate[holiday.date]) {
            holidaysByDate[holiday.date] = [];
          }
          holidaysByDate[holiday.date].push(holiday.id);
        }

        state.holidays = holidays;
        state.holidaysByDate = holidaysByDate;
        state.lastFetched = new Date().toISOString();
        state.currentYear = action.meta.arg.year;
      })
      .addCase(fetchHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch holidays';
      });
  },
});

// Export actions
export const { setHolidays, clearHolidaysCache, clearHolidaysError } = holidaysSlice.actions;

// Selectors
export const selectAllHolidays = (state: RootState): Holiday[] =>
  Object.values(state.holidays.holidays);

export const selectHolidayById = (state: RootState, id: string): Holiday | undefined =>
  state.holidays.holidays[id];

export const selectHolidaysByDate = (state: RootState, date: string): Holiday[] => {
  const ids = state.holidays.holidaysByDate[date] || [];
  return ids.map(id => state.holidays.holidays[id]).filter(Boolean);
};

export const selectHolidaysLoading = (state: RootState) => state.holidays.loading;
export const selectHolidaysError = (state: RootState) => state.holidays.error;
export const selectHolidaysLastFetched = (state: RootState) => state.holidays.lastFetched;

// Select holidays grouped by month
export const selectHolidaysGroupedByMonth = (state: RootState) => {
  const holidays = selectAllHolidays(state);
  const grouped: Record<string, Holiday[]> = {};

  for (const holiday of holidays) {
    const monthKey = holiday.date.substring(0, 7); // "YYYY-MM"
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    grouped[monthKey].push(holiday);
  }

  // Sort within each group
  for (const monthKey of Object.keys(grouped)) {
    grouped[monthKey].sort((a, b) => a.date.localeCompare(b.date));
  }

  return grouped;
};

export default holidaysSlice.reducer;
