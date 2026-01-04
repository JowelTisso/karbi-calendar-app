// Common TypeScript interfaces used throughout the app

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export interface PaginationMeta {
  totalCount: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Color presets for notes and reminders
export const COLOR_PRESETS = [
  '#6366F1', // Indigo (primary)
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#6B7280', // Gray
] as const;

export type ColorPreset = typeof COLOR_PRESETS[number];

// Storage keys for AsyncStorage
export const STORAGE_KEYS = {
  NOTES: '@calendar_app/notes',
  REMINDERS: '@calendar_app/reminders',
  HOLIDAYS: '@calendar_app/holidays',
  SETTINGS: '@calendar_app/settings',
  VERSION: '@calendar_app/version',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
