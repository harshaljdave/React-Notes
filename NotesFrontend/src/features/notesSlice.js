import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const getNotes = createAsyncThunk(
  'notes/getNotes',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.get('/notes/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (noteData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.post('/notes/', noteData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getNoteById = createAsyncThunk(
  'notes/getNoteById',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.get(`/notes/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async ({ id, noteData }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.put(`/notes/${id}/`, noteData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await api.delete(`/notes/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const favoriteNote = createAsyncThunk(
  'notes/favoriteNote',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.post(`/notes/${id}/favorite/`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const unfavoriteNote = createAsyncThunk(
  'notes/unfavoriteNote',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.post(`/notes/${id}/unfavorite/`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const archiveNote = createAsyncThunk(
  'notes/archiveNote',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.post(`/notes/${id}/archive/`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const unarchiveNote = createAsyncThunk(
  'notes/unarchiveNote',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.post(`/notes/${id}/unarchive/`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTagToNote = createAsyncThunk(
  'notes/addTagToNote',
  async ({ noteId, tagId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.post(`/notes/${noteId}/tags/`, { tag_id: tagId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeTagFromNote = createAsyncThunk(
  'notes/removeTagFromNote',
  async ({ noteId, tagId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await api.delete(`/notes/${noteId}/tags/${tagId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { noteId, tagId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addFolderToNote = createAsyncThunk(
  'notes/addFolderToNote',
  async ({ noteId, folderId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.post(`/notes/${noteId}/add_to_folder/`, { folder_id: folderId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeFolderFromNote = createAsyncThunk(
  'notes/removeFolderFromNote',
  async ({ noteId, folderId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      await api.post(`/notes/${noteId}/remove_from_folder/`, { folder_id: folderId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { noteId, folderId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const shareNote = createAsyncThunk(
  'notes/shareNote',
  async ({ noteId, email, permission }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.post('/shared-notes/', { note: noteId, shared_with: { email: email }, permission: permission }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getSharedWith = createAsyncThunk(
  'notes/getSharedWith',
  async (noteId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.get(`/shared-notes/?note_id=${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  notes: [],
  selectedNote: null,
  sharedWith: [],
  loading: false,
  error: null,
};

export const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.push(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getNoteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNoteById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNote = action.payload;
      })
      .addCase(getNoteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNote = action.payload;
        const index = state.notes.findIndex((note) => note.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = state.notes.filter((note) => note.id !== action.payload);
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(favoriteNote.fulfilled, (state, action) => {
        if (state.selectedNote && state.selectedNote.id === action.payload.id) {
          state.selectedNote.favorited_by.push(action.meta.arg);
        }
      })
      .addCase(unfavoriteNote.fulfilled, (state, action) => {
        if (state.selectedNote && state.selectedNote.id === action.payload.id) {
          state.selectedNote.favorited_by = state.selectedNote.favorited_by.filter(
            (userId) => userId !== action.meta.arg
          );
        }
      })
      .addCase(archiveNote.fulfilled, (state, action) => {
        if (state.selectedNote && state.selectedNote.id === action.payload.id) {
          state.selectedNote.is_archived = true;
        }
      })
      .addCase(unarchiveNote.fulfilled, (state, action) => {
        if (state.selectedNote && state.selectedNote.id === action.payload.id) {
          state.selectedNote.is_archived = false;
        }
      })
      .addCase(addTagToNote.fulfilled, (state, action) => {
        if (state.selectedNote && state.selectedNote.id === action.payload.id) {
          state.selectedNote.tags.push(action.payload.tag);
        }
      })
      .addCase(removeTagFromNote.fulfilled, (state, action) => {
        if (state.selectedNote && state.selectedNote.id === action.payload.noteId) {
          state.selectedNote.tags = state.selectedNote.tags.filter(
            (tag) => tag.id !== action.payload.tagId
          );
        }
      })
      .addCase(addFolderToNote.fulfilled, (state, action) => {
        if (state.selectedNote && state.selectedNote.id === action.payload.id) {
          state.selectedNote.folders.push(action.payload.folder);
        }
      })
      .addCase(removeFolderFromNote.fulfilled, (state, action) => {
        if (state.selectedNote && state.selectedNote.id === action.payload.noteId) {
          state.selectedNote.folders = state.selectedNote.folders.filter(
            (folder) => folder.id !== action.payload.folderId
          );
        }
      })
      .addCase(shareNote.fulfilled, (state, action) => {
        state.sharedWith.push(action.payload);
      })
      .addCase(getSharedWith.fulfilled, (state, action) => {
        state.sharedWith = action.payload;
      });
  },
});

export default notesSlice.reducer;
