// Notes slice - Notes CRUD with AsyncStorage persistence

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { RootState } from '@/store';
import type { Note, NoteState, CreateNoteRequest, UpdateNoteRequest } from '@/types';

const initialState: NoteState = {
  notes: {},
  notesByDate: {},
  loading: false,
  error: null,
  syncStatus: 'idle',
  lastSyncedAt: null,
};

// Helper to add note to date index
const addToDateIndex = (
  notesByDate: Record<string, string[]>,
  date: string,
  noteId: string
) => {
  if (!notesByDate[date]) {
    notesByDate[date] = [];
  }
  if (!notesByDate[date].includes(noteId)) {
    notesByDate[date].push(noteId);
  }
};

// Helper to remove note from date index
const removeFromDateIndex = (
  notesByDate: Record<string, string[]>,
  date: string,
  noteId: string
) => {
  if (notesByDate[date]) {
    notesByDate[date] = notesByDate[date].filter(id => id !== noteId);
    if (notesByDate[date].length === 0) {
      delete notesByDate[date];
    }
  }
};

// Async thunk for creating a note
export const createNote = createAsyncThunk<
  Note,
  CreateNoteRequest,
  { rejectValue: string }
>(
  'notes/createNote',
  async (request, { rejectWithValue }) => {
    try {
      const now = new Date().toISOString();
      const note: Note = {
        id: uuidv4(),
        ...request,
        createdAt: now,
        updatedAt: now,
      };

      // TODO: Sync to API when backend is ready
      return note;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create note'
      );
    }
  }
);

// Async thunk for updating a note
export const updateNote = createAsyncThunk<
  Note,
  UpdateNoteRequest,
  { state: RootState; rejectValue: string }
>(
  'notes/updateNote',
  async (request, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const existingNote = state.notes.notes[request.id];

      if (!existingNote) {
        return rejectWithValue('Note not found');
      }

      const updatedNote: Note = {
        ...existingNote,
        ...request,
        updatedAt: new Date().toISOString(),
      };

      // TODO: Sync to API when backend is ready
      return updatedNote;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update note'
      );
    }
  }
);

// Async thunk for deleting a note
export const deleteNote = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>(
  'notes/deleteNote',
  async (noteId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const existingNote = state.notes.notes[noteId];

      if (!existingNote) {
        return rejectWithValue('Note not found');
      }

      // TODO: Sync to API when backend is ready
      return noteId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to delete note'
      );
    }
  }
);

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    // Set notes (used for hydration from storage)
    setNotes: (
      state,
      action: PayloadAction<{
        notes: Record<string, Note>;
        notesByDate: Record<string, string[]>;
      }>
    ) => {
      state.notes = action.payload.notes;
      state.notesByDate = action.payload.notesByDate;
    },

    // Clear error
    clearNotesError: (state) => {
      state.error = null;
    },

    // Reset notes state
    resetNotes: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Create note
      .addCase(createNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        const note = action.payload;
        state.notes[note.id] = note;
        addToDateIndex(state.notesByDate, note.date, note.id);
        state.loading = false;
        state.syncStatus = 'synced';
        state.lastSyncedAt = new Date().toISOString();
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create note';
        state.syncStatus = 'error';
      })

      // Update note
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        const note = action.payload;
        const oldNote = state.notes[note.id];

        // Update date index if date changed
        if (oldNote && oldNote.date !== note.date) {
          removeFromDateIndex(state.notesByDate, oldNote.date, note.id);
          addToDateIndex(state.notesByDate, note.date, note.id);
        }

        state.notes[note.id] = note;
        state.loading = false;
        state.syncStatus = 'synced';
        state.lastSyncedAt = new Date().toISOString();
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update note';
        state.syncStatus = 'error';
      })

      // Delete note
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        const noteId = action.payload;
        const note = state.notes[noteId];

        if (note) {
          removeFromDateIndex(state.notesByDate, note.date, noteId);
          delete state.notes[noteId];
        }

        state.loading = false;
        state.syncStatus = 'synced';
        state.lastSyncedAt = new Date().toISOString();
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete note';
        state.syncStatus = 'error';
      });
  },
});

// Export actions
export const { setNotes, clearNotesError, resetNotes } = notesSlice.actions;

// Selectors
export const selectAllNotes = (state: RootState): Note[] =>
  Object.values(state.notes.notes).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ) as Note[];

export const selectNoteById = (state: RootState, id: string): Note | undefined =>
  state.notes.notes[id];

export const selectNotesByDate = (state: RootState, date: string): Note[] => {
  const ids = state.notes.notesByDate[date] || [];
  return ids.map(id => state.notes.notes[id]).filter(Boolean);
};

export const selectNotesLoading = (state: RootState) => state.notes.loading;
export const selectNotesError = (state: RootState) => state.notes.error;
export const selectNotesSyncStatus = (state: RootState) => state.notes.syncStatus;

// Select notes count
export const selectNotesCount = (state: RootState): number =>
  Object.keys(state.notes.notes).length;

// Check if date has notes
export const selectDateHasNotes = (state: RootState, date: string): boolean =>
  (state.notes.notesByDate[date]?.length || 0) > 0;

export default notesSlice.reducer;
