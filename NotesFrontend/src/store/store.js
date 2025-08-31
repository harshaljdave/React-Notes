import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import notesReducer from '../features/notesSlice';
import tagsReducer from '../features/tagsSlice';
import foldersReducer from '../features/foldersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
    tags: tagsReducer,
    folders: foldersReducer,
  },
});
