// useCalendarData hook - Combined calendar data management

import { useMemo, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectSelectedDate,
  selectCurrentMonth,
  selectViewMode,
  setSelectedDate,
  navigateToMonth,
  goToToday,
  selectHolidaysByDate,
  selectNotesByDate,
  selectRemindersByDate,
  selectHolidaysLoading,
  selectNotesLoading,
  selectRemindersLoading,
  fetchHolidays,
  selectDateHasNotes,
  selectDateHasReminders,
} from '@/slices';
import { getMonthDays, parseMonthKey, toISODateString } from '@/utils/dateHelpers';
import type { Holiday, Note, Reminder, MarkedDates, DotMarking } from '@/types';
import { useThemeColors } from './useTheme';

export interface DateEvents {
  holidays: Holiday[];
  notes: Note[];
  reminders: Reminder[];
  hasEvents: boolean;
}

export interface UseCalendarDataResult {
  // Current state
  selectedDate: string;
  currentMonth: string;
  viewMode: 'month' | 'week' | 'day';

  // Loading states
  isLoading: boolean;

  // Month data
  monthDays: Date[];

  // Marked dates for calendar
  markedDates: MarkedDates;

  // Events for selected date
  selectedDateEvents: DateEvents;

  // Actions
  selectDate: (date: string) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  jumpToToday: () => void;

  // Helpers
  getEventsForDate: (date: string) => DateEvents;
  hasEventsOnDate: (date: string) => boolean;
}

export const useCalendarData = (): UseCalendarDataResult => {
  const dispatch = useAppDispatch();
  const colors = useThemeColors();

  // Selectors
  const selectedDate = useAppSelector(selectSelectedDate);
  const currentMonth = useAppSelector(selectCurrentMonth);
  const viewMode = useAppSelector(selectViewMode);

  // Loading states
  const holidaysLoading = useAppSelector(selectHolidaysLoading);
  const notesLoading = useAppSelector(selectNotesLoading);
  const remindersLoading = useAppSelector(selectRemindersLoading);

  // Selected date events
  const selectedHolidays = useAppSelector((state) =>
    selectHolidaysByDate(state, selectedDate)
  );
  const selectedNotes = useAppSelector((state) =>
    selectNotesByDate(state, selectedDate)
  );
  const selectedReminders = useAppSelector((state) =>
    selectRemindersByDate(state, selectedDate)
  );

  // Fetch holidays for current year
  useEffect(() => {
    const { year } = parseMonthKey(currentMonth);
    dispatch(fetchHolidays({ year }));
  }, [currentMonth, dispatch]);

  // Get month days
  const monthDays = useMemo(() => {
    const { year, month } = parseMonthKey(currentMonth);
    return getMonthDays(year, month);
  }, [currentMonth]);

  // Build marked dates for calendar
  const markedDates = useMemo((): MarkedDates => {
    const marks: MarkedDates = {};

    // Add selected date marking
    marks[selectedDate] = {
      selected: true,
      selectedColor: colors.selected,
    };

    return marks;
  }, [selectedDate, colors.selected]);

  // Get events for selected date
  const selectedDateEvents = useMemo((): DateEvents => ({
    holidays: selectedHolidays,
    notes: selectedNotes,
    reminders: selectedReminders,
    hasEvents:
      selectedHolidays.length > 0 ||
      selectedNotes.length > 0 ||
      selectedReminders.length > 0,
  }), [selectedHolidays, selectedNotes, selectedReminders]);

  // Actions
  const selectDate = useCallback(
    (date: string) => {
      dispatch(setSelectedDate(date));
    },
    [dispatch]
  );

  const nextMonth = useCallback(() => {
    dispatch(navigateToMonth(1));
  }, [dispatch]);

  const prevMonth = useCallback(() => {
    dispatch(navigateToMonth(-1));
  }, [dispatch]);

  const jumpToToday = useCallback(() => {
    dispatch(goToToday());
  }, [dispatch]);

  // Get events for any date (used by calendar day rendering)
  const getEventsForDate = useCallback(
    (date: string): DateEvents => {
      // This is a simplified version - in real usage,
      // you might want to use selectors with the state
      return {
        holidays: [],
        notes: [],
        reminders: [],
        hasEvents: false,
      };
    },
    []
  );

  // Check if date has events
  const hasEventsOnDate = useCallback(
    (date: string): boolean => {
      // This would need access to the full state
      // For now, return false as placeholder
      return false;
    },
    []
  );

  return {
    selectedDate,
    currentMonth,
    viewMode,
    isLoading: holidaysLoading || notesLoading || remindersLoading,
    monthDays,
    markedDates,
    selectedDateEvents,
    selectDate,
    nextMonth,
    prevMonth,
    jumpToToday,
    getEventsForDate,
    hasEventsOnDate,
  };
};

// Hook for getting date markers
export const useDateMarkers = (date: string) => {
  const colors = useThemeColors();

  const holidays = useAppSelector((state) => selectHolidaysByDate(state, date));
  const hasNotes = useAppSelector((state) => selectDateHasNotes(state, date));
  const hasReminders = useAppSelector((state) => selectDateHasReminders(state, date));

  const dots = useMemo((): DotMarking['dots'] => {
    const result: DotMarking['dots'] = [];

    if (holidays.length > 0) {
      result.push({ key: 'holiday', color: colors.holiday });
    }
    if (hasNotes) {
      result.push({ key: 'note', color: colors.note });
    }
    if (hasReminders) {
      result.push({ key: 'reminder', color: colors.reminder });
    }

    return result;
  }, [holidays.length, hasNotes, hasReminders, colors]);

  return {
    dots,
    hasHoliday: holidays.length > 0,
    hasNote: hasNotes,
    hasReminder: hasReminders,
    hasAnyEvent: holidays.length > 0 || hasNotes || hasReminders,
  };
};

export default useCalendarData;
