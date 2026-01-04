// Calendar slice - UI state management

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { CalendarState, ViewMode } from '@/types';
import { getTodayString, getCurrentMonthKey, navigateMonth } from '@/utils/dateHelpers';

const initialState: CalendarState = {
  selectedDate: getTodayString(),
  currentMonth: getCurrentMonthKey(),
  viewMode: 'month',
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // Set the selected date
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },

    // Set the current month
    setCurrentMonth: (state, action: PayloadAction<string>) => {
      state.currentMonth = action.payload;
    },

    // Navigate to next/previous month
    navigateToMonth: (state, action: PayloadAction<1 | -1>) => {
      state.currentMonth = navigateMonth(state.currentMonth, action.payload);
    },

    // Set view mode
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },

    // Reset to today
    goToToday: (state) => {
      state.selectedDate = getTodayString();
      state.currentMonth = getCurrentMonthKey();
    },

    // Reset calendar state
    resetCalendar: () => initialState,
  },
});

// Export actions
export const {
  setSelectedDate,
  setCurrentMonth,
  navigateToMonth,
  setViewMode,
  goToToday,
  resetCalendar,
} = calendarSlice.actions;

// Selectors
export const selectSelectedDate = (state: RootState) => state.calendar.selectedDate;
export const selectCurrentMonth = (state: RootState) => state.calendar.currentMonth;
export const selectViewMode = (state: RootState) => state.calendar.viewMode;

export default calendarSlice.reducer;
