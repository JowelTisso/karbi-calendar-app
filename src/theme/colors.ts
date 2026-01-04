// Theme color definitions for light and dark modes

export const lightColors = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  primary: '#6366F1', // Indigo
  primaryLight: '#A5B4FC', // Lighter indigo
  secondary: '#8B5CF6', // Purple
  accent: '#EC4899', // Pink
  text: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  // Event type colors
  holiday: '#F59E0B', // Orange
  note: '#3B82F6', // Blue
  reminder: '#EC4899', // Pink
  // Calendar-specific
  today: '#EEF2FF',
  selected: '#6366F1',
  dayText: '#1F2937',
  dayTextDisabled: '#D1D5DB',
  // Additional UI colors
  card: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',
  skeleton: '#E5E7EB',
  divider: '#F3F4F6',
};

export const darkColors = {
  background: '#0F172A',
  surface: '#1E293B',
  primary: '#818CF8', // Lighter indigo for dark mode
  primaryLight: '#A5B4FC',
  secondary: '#A78BFA', // Lighter purple
  accent: '#F472B6', // Lighter pink
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  border: '#334155',
  borderLight: '#475569',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  // Event type colors (lighter for dark mode)
  holiday: '#FBBF24',
  note: '#60A5FA',
  reminder: '#F472B6',
  // Calendar-specific
  today: '#312E81',
  selected: '#818CF8',
  dayText: '#F1F5F9',
  dayTextDisabled: '#475569',
  // Additional UI colors
  card: '#1E293B',
  overlay: 'rgba(0, 0, 0, 0.7)',
  skeleton: '#334155',
  divider: '#1E293B',
};

// Type for color themes
export type ColorTheme = typeof lightColors;

// Get theme colors based on color scheme
export const getColors = (isDark: boolean): ColorTheme => {
  return isDark ? darkColors : lightColors;
};

// Calendar theme for react-native-calendars
export const getCalendarTheme = (isDark: boolean) => {
  const colors = getColors(isDark);
  return {
    backgroundColor: colors.background,
    calendarBackground: colors.background,
    textSectionTitleColor: colors.textSecondary,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: '#FFFFFF',
    todayTextColor: colors.primary,
    dayTextColor: colors.text,
    textDisabledColor: colors.textMuted,
    dotColor: colors.primary,
    selectedDotColor: '#FFFFFF',
    arrowColor: colors.primary,
    monthTextColor: colors.text,
    textDayFontWeight: '400' as const,
    textMonthFontWeight: '600' as const,
    textDayHeaderFontWeight: '500' as const,
    textDayFontSize: 14,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 12,
  };
};
