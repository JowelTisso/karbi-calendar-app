// Note TypeScript interfaces

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string; // ISO 8601: "2026-01-15"
  color?: string; // Hex color for categorization
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NoteFormData {
  title: string;
  content: string;
  date: string;
  color?: string;
  tags?: string[];
}

export interface NoteState {
  notes: Record<string, Note>; // Keyed by ID
  notesByDate: Record<string, string[]>; // date -> note IDs
  loading: boolean;
  error: string | null;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncedAt: string | null;
}

// Request parameters for fetching notes
export interface FetchNotesParams {
  startDate?: string;
  endDate?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'date' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// Create note request
export interface CreateNoteRequest {
  title: string;
  content: string;
  date: string;
  color?: string;
  tags?: string[];
}

// Update note request (partial update)
export interface UpdateNoteRequest {
  id: string;
  title?: string;
  content?: string;
  date?: string;
  color?: string;
  tags?: string[];
}
