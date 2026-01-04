// Export all slices and their actions/selectors

// Calendar slice
export {
  default as calendarReducer,
  setSelectedDate,
  setCurrentMonth,
  navigateToMonth,
  setViewMode,
  goToToday,
  resetCalendar,
  selectSelectedDate,
  selectCurrentMonth,
  selectViewMode,
} from './calendarSlice';

// Holidays slice
export {
  default as holidaysReducer,
  fetchHolidays,
  setHolidays,
  clearHolidaysCache,
  clearHolidaysError,
  selectAllHolidays,
  selectHolidayById,
  selectHolidaysByDate,
  selectHolidaysLoading,
  selectHolidaysError,
  selectHolidaysLastFetched,
  selectHolidaysGroupedByMonth,
} from './holidaysSlice';

// Notes slice
export {
  default as notesReducer,
  createNote,
  updateNote,
  deleteNote,
  setNotes,
  clearNotesError,
  resetNotes,
  selectAllNotes,
  selectNoteById,
  selectNotesByDate,
  selectNotesLoading,
  selectNotesError,
  selectNotesSyncStatus,
  selectNotesCount,
  selectDateHasNotes,
} from './notesSlice';

// Reminders slice
export {
  default as remindersReducer,
  createReminder,
  updateReminder,
  completeReminder,
  deleteReminder,
  setReminders,
  setNotificationPermission,
  clearRemindersError,
  resetReminders,
  selectAllReminders,
  selectActiveReminders,
  selectReminderById,
  selectRemindersByDate,
  selectRemindersLoading,
  selectRemindersError,
  selectNotificationPermission,
  selectUpcomingReminders,
  selectDateHasReminders,
} from './remindersSlice';
