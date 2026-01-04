// Reminder TypeScript interfaces

export type ReminderStatus = 'active' | 'completed' | 'cancelled';

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  reminderTime: string; // ISO 8601 with time: "2026-01-15T09:00:00Z"
  status: ReminderStatus;
  notificationId?: string; // Expo notification ID for cancellation
  color?: string; // Hex color
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string; // When marked as completed
}

export interface ReminderFormData {
  title: string;
  description: string;
  reminderTime: string;
  color?: string;
  tags?: string[];
}

export interface ReminderState {
  reminders: Record<string, Reminder>; // Keyed by ID
  remindersByDate: Record<string, string[]>; // date -> reminder IDs
  loading: boolean;
  error: string | null;
  notificationPermission: 'granted' | 'denied' | 'undetermined';
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
}

// Request parameters for fetching reminders
export interface FetchRemindersParams {
  startDate?: string;
  endDate?: string;
  status?: ReminderStatus;
  limit?: number;
  offset?: number;
  sortBy?: 'reminderTime' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Create reminder request
export interface CreateReminderRequest {
  title: string;
  description?: string;
  reminderTime: string;
  color?: string;
  tags?: string[];
}

// Update reminder request (partial update)
export interface UpdateReminderRequest {
  id: string;
  title?: string;
  description?: string;
  reminderTime?: string;
  status?: ReminderStatus;
  color?: string;
  tags?: string[];
}

// Notification data payload
export interface ReminderNotificationData {
  reminderId: string;
  type: 'reminder';
}
