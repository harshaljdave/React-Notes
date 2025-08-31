import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const getFolders = createAsyncThunk(
  'folders/getFolders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.get('/folders/', {
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

export const createFolder = createAsyncThunk(
  'folders/createFolder',
  async (folderData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.post('/folders/', folderData, {
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
  folders: [],
  loading: false,
  error: null,
};

export const foldersSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFolders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFolders.fulfilled, (state, action) => {
        state.loading = false;
        state.folders = action.payload;
      })
      .addCase(getFolders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.loading = false;
        state.folders.push(action.payload);
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default foldersSlice.reducer;
