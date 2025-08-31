import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const getTags = createAsyncThunk(
  'tags/getTags',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.get('/tags/', {
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

export const createTag = createAsyncThunk(
  'tags/createTag',
  async (tagData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await api.post('/tags/', tagData, {
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
  tags: [],
  loading: false,
  error: null,
};

export const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(getTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.loading = false;
        state.tags.push(action.payload);
      })
      .addCase(createTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default tagsSlice.reducer;
