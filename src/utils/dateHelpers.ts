// Date helper functions using date-fns

import {
  format,
  parse,
  parseISO,
  isToday as isTodayFns,
  isSameDay as isSameDayFns,
  isSameMonth as isSameMonthFns,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  addDays,
  subDays,
  getDaysInMonth,
  getDay,
  isAfter,
  isBefore,
  isValid,
  differenceInDays,
  differenceInMinutes,
} from 'date-fns';
import { DATE_FORMATS } from './constants';

// Parse date string to Date object
export const parseDate = (dateString: string): Date => {
  if (!dateString) return new Date();

  // Handle ISO strings
  if (dateString.includes('T')) {
    return parseISO(dateString);
  }

  // Handle YYYY-MM-DD format
  return parse(dateString, DATE_FORMATS.ISO, new Date());
};

// Format date to string
export const formatDate = (
  date: string | Date,
  formatString: string = DATE_FORMATS.ISO
): string => {
  const dateObj = typeof date === 'string' ? parseDate(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, formatString);
};

// Get ISO date string (YYYY-MM-DD)
export const toISODateString = (date: Date): string => {
  return format(date, DATE_FORMATS.ISO);
};

// Get ISO datetime string
export const toISODateTimeString = (date: Date): string => {
  return date.toISOString();
};

// Check if date is today
export const isToday = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseDate(date) : date;
  return isTodayFns(dateObj);
};

// Check if two dates are the same day
export const isSameDay = (date1: string | Date, date2: string | Date): boolean => {
  const d1 = typeof date1 === 'string' ? parseDate(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseDate(date2) : date2;
  return isSameDayFns(d1, d2);
};

// Check if two dates are in the same month
export const isSameMonth = (date1: string | Date, date2: string | Date): boolean => {
  const d1 = typeof date1 === 'string' ? parseDate(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseDate(date2) : date2;
  return isSameMonthFns(d1, d2);
};

// Get month range (start and end dates)
export const getMonthRange = (month: string): { start: Date; end: Date } => {
  const date = parseDate(month + '-01');
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
};

// Get week range
export const getWeekRange = (date: string | Date): { start: Date; end: Date } => {
  const dateObj = typeof date === 'string' ? parseDate(date) : date;
  return {
    start: startOfWeek(dateObj, { weekStartsOn: 0 }), // Sunday
    end: endOfWeek(dateObj, { weekStartsOn: 0 }),
  };
};

// Navigate months
export const navigateMonth = (month: string, direction: 1 | -1): string => {
  const date = parseDate(month + '-01');
  const newDate = direction === 1 ? addMonths(date, 1) : subMonths(date, 1);
  return format(newDate, DATE_FORMATS.MONTH_KEY);
};

// Navigate days
export const navigateDay = (date: string, direction: 1 | -1): string => {
  const dateObj = parseDate(date);
  const newDate = direction === 1 ? addDays(dateObj, 1) : subDays(dateObj, 1);
  return toISODateString(newDate);
};

// Get month key from date (YYYY-MM)
export const getMonthKey = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseDate(date) : date;
  return format(dateObj, DATE_FORMATS.MONTH_KEY);
};

// Get display month (e.g., "January 2026")
export const getDisplayMonth = (month: string): string => {
  const date = parseDate(month + '-01');
  return format(date, DATE_FORMATS.MONTH_YEAR);
};

// Get number of days in month
export const getDaysCount = (month: string): number => {
  const date = parseDate(month + '-01');
  return getDaysInMonth(date);
};

// Get first day of week for month (0 = Sunday)
export const getFirstDayOfWeek = (month: string): number => {
  const date = startOfMonth(parseDate(month + '-01'));
  return getDay(date);
};

// Check if date is in the past
export const isPast = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseDate(date) : date;
  return isBefore(dateObj, new Date());
};

// Check if date is in the future
export const isFuture = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseDate(date) : date;
  return isAfter(dateObj, new Date());
};

// Get days difference
export const getDaysDifference = (date1: string | Date, date2: string | Date): number => {
  const d1 = typeof date1 === 'string' ? parseDate(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseDate(date2) : date2;
  return differenceInDays(d1, d2);
};

// Get minutes difference
export const getMinutesDifference = (date1: string | Date, date2: string | Date): number => {
  const d1 = typeof date1 === 'string' ? parseDate(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseDate(date2) : date2;
  return differenceInMinutes(d1, d2);
};

// Get today's date string
export const getTodayString = (): string => {
  return toISODateString(new Date());
};

// Get current month key
export const getCurrentMonthKey = (): string => {
  return getMonthKey(new Date());
};

// Get current year
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

// Format relative time (e.g., "in 5 minutes", "2 hours ago")
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseDate(date) : date;
  const now = new Date();
  const diffMinutes = differenceInMinutes(dateObj, now);

  if (diffMinutes === 0) return 'now';
  if (diffMinutes > 0) {
    if (diffMinutes < 60) return `in ${diffMinutes} min`;
    if (diffMinutes < 1440) return `in ${Math.floor(diffMinutes / 60)} hr`;
    return `in ${Math.floor(diffMinutes / 1440)} days`;
  } else {
    const absDiff = Math.abs(diffMinutes);
    if (absDiff < 60) return `${absDiff} min ago`;
    if (absDiff < 1440) return `${Math.floor(absDiff / 60)} hr ago`;
    return `${Math.floor(absDiff / 1440)} days ago`;
  }
};

// Generate array of dates for a month (including padding for calendar grid)
export const getMonthDates = (month: string): string[] => {
  const { start, end } = getMonthRange(month);
  const weekStart = startOfWeek(start, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(end, { weekStartsOn: 0 });

  const dates: string[] = [];
  let current = weekStart;

  while (!isAfter(current, weekEnd)) {
    dates.push(toISODateString(current));
    current = addDays(current, 1);
  }

  return dates;
};

// Format month and year (e.g., "January 2026")
export const formatMonthYear = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

// Format full date (e.g., "Monday, January 15, 2026")
export const formatFullDate = (date: Date): string => {
  return format(date, 'EEEE, MMMM d, yyyy');
};

// Format time (e.g., "9:30 AM")
export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

// Parse month key to year and month
export const parseMonthKey = (monthKey: string): { year: number; month: number } => {
  const [year, month] = monthKey.split('-').map(Number);
  return { year, month };
};

// Get array of Date objects for a month
export const getMonthDays = (year: number, month: number): Date[] => {
  const date = new Date(year, month - 1, 1);
  const days: Date[] = [];
  const daysInMonth = getDaysInMonth(date);

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month - 1, i));
  }

  return days;
};
