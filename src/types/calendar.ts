// Calendar TypeScript interfaces

export type ViewMode = 'month' | 'week' | 'day';

export interface CalendarState {
  selectedDate: string; // ISO 8601: "2026-01-15"
  currentMonth: string; // "2026-01"
  viewMode: ViewMode;
}

export interface DayMarkerProps {
  date: string;
  hasHoliday: boolean;
  hasNote: boolean;
  hasReminder: boolean;
  isSelected: boolean;
  isToday: boolean;
}

// react-native-calendars MarkedDates type
export interface MarkedDates {
  [date: string]: {
    selected?: boolean;
    marked?: boolean;
    dotColor?: string;
    selectedColor?: string;
    selectedTextColor?: string;
    dots?: Array<{ key: string; color: string }>;
    customStyles?: {
      container?: object;
      text?: object;
    };
  };
}

// Single dot marker
export interface DotMarker {
  key: string;
  color: string;
}

// Dot marking for calendar
export interface DotMarking {
  dots: Array<{ key: string; color: string }>;
}

// Events aggregated for a single date
export interface DateEvents {
  date: string;
  holidays: string[]; // Holiday IDs
  notes: string[]; // Note IDs
  reminders: string[]; // Reminder IDs
  hasEvents: boolean;
}

// Calendar navigation direction
export type NavigationDirection = 1 | -1;

// Month data for display
export interface MonthData {
  key: string; // "2026-01"
  year: number;
  month: number;
  name: string; // "January"
  fullName: string; // "January 2026"
  daysCount: number;
  firstDayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
}

// Calendar theme colors (for react-native-calendars)
export interface CalendarTheme {
  backgroundColor: string;
  calendarBackground: string;
  textSectionTitleColor: string;
  selectedDayBackgroundColor: string;
  selectedDayTextColor: string;
  todayTextColor: string;
  dayTextColor: string;
  textDisabledColor: string;
  dotColor: string;
  selectedDotColor: string;
  arrowColor: string;
  monthTextColor: string;
  textDayFontWeight: '400' | '500' | '600' | '700';
  textMonthFontWeight: '400' | '500' | '600' | '700';
  textDayHeaderFontWeight: '400' | '500' | '600' | '700';
  textDayFontSize: number;
  textMonthFontSize: number;
  textDayHeaderFontSize: number;
}
