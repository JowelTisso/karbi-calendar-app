// Holiday TypeScript interfaces

export type HolidayType = 'national' | 'regional' | 'observance';

export interface Holiday {
  id: string;
  name: string;
  date: string; // ISO 8601: "2026-01-01"
  country?: string;
  type: HolidayType;
  description?: string;
  isRecurring?: boolean;
}

export interface HolidayApiResponse {
  data: Holiday[];
  meta: {
    year: number;
    month?: number;
    country: string;
    totalCount: number;
  };
}

export interface HolidayState {
  holidays: Record<string, Holiday>; // Keyed by ID
  holidaysByDate: Record<string, string[]>; // date -> holiday IDs
  loading: boolean;
  error: string | null;
  lastFetched: string | null; // ISO timestamp
  currentYear: number;
}

// Request parameters for fetching holidays
export interface FetchHolidaysParams {
  year: number;
  month?: number;
  country?: string;
}

// Grouped holidays for display
export interface HolidayGroup {
  month: string; // "January 2026"
  monthKey: string; // "2026-01"
  holidays: Holiday[];
}
