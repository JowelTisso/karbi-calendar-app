// Spacing scale for consistent layout

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export type SpacingKey = keyof typeof spacing;
export type SpacingValue = typeof spacing[SpacingKey];

// Common padding presets
export const padding = {
  screen: spacing.md, // Default screen padding
  card: spacing.md, // Card internal padding
  button: {
    horizontal: spacing.lg,
    vertical: spacing.sm,
  },
  input: {
    horizontal: spacing.md,
    vertical: spacing.sm,
  },
  listItem: {
    horizontal: spacing.md,
    vertical: spacing.sm,
  },
} as const;

// Common margin presets
export const margin = {
  section: spacing.lg, // Space between sections
  item: spacing.sm, // Space between list items
  inline: spacing.xs, // Space between inline elements
} as const;

// Border radius values
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999, // For circular elements
} as const;

export type BorderRadiusKey = keyof typeof borderRadius;

// Common sizes
export const sizes = {
  icon: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
  avatar: {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  },
  button: {
    height: {
      sm: 32,
      md: 44,
      lg: 56,
    },
  },
  input: {
    height: 48,
  },
  tabBar: {
    height: 64,
  },
  header: {
    height: 56,
  },
} as const;
