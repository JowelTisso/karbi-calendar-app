// Export all theme modules from a single entry point

export * from './colors';
export * from './spacing';
export * from './typography';

// Re-export for convenience
import { lightColors, darkColors, getColors, getCalendarTheme } from './colors';
import { spacing, padding, margin, borderRadius, sizes } from './spacing';
import { fontSizes, fontWeights, lineHeights, textStyles } from './typography';

export const theme = {
  colors: {
    light: lightColors,
    dark: darkColors,
    get: getColors,
    calendar: getCalendarTheme,
  },
  spacing,
  padding,
  margin,
  borderRadius,
  sizes,
  fontSizes,
  fontWeights,
  lineHeights,
  textStyles,
} as const;

export default theme;
