// useTheme hook - Theme and color management

import { useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { getColors, getCalendarTheme, lightColors, darkColors } from '@/theme/colors';
import type { Theme } from '@react-navigation/native';

export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  // Base colors
  primary: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  error: string;
  success: string;
  warning: string;
  // Calendar-specific
  holiday: string;
  note: string;
  reminder: string;
  today: string;
  selected: string;
  dayText: string;
  dayTextDisabled: string;
}

// Hook to get current color scheme
export const useColorSchemeValue = (): ColorScheme => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
};

// Hook to get theme colors
export const useThemeColors = (): ThemeColors => {
  const colorScheme = useColorSchemeValue();
  return useMemo(() => getColors(colorScheme === 'dark'), [colorScheme]);
};

// Hook to get calendar theme for react-native-calendars
export const useCalendarTheme = () => {
  const colorScheme = useColorSchemeValue();
  return useMemo(() => getCalendarTheme(colorScheme === 'dark'), [colorScheme]);
};

// Hook to get react-navigation theme
export const useNavigationTheme = (): Theme => {
  const colorScheme = useColorSchemeValue();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  return useMemo(
    () => ({
      dark: colorScheme === 'dark',
      colors: {
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        notification: colors.accent,
      },
      fonts: {
        regular: {
          fontFamily: 'System',
          fontWeight: '400' as const,
        },
        medium: {
          fontFamily: 'System',
          fontWeight: '500' as const,
        },
        bold: {
          fontFamily: 'System',
          fontWeight: '700' as const,
        },
        heavy: {
          fontFamily: 'System',
          fontWeight: '900' as const,
        },
      },
    }),
    [colorScheme, colors]
  );
};

// Check if dark mode
export const useIsDarkMode = (): boolean => {
  const colorScheme = useColorSchemeValue();
  return colorScheme === 'dark';
};

export default useThemeColors;
