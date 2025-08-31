import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFolders, createFolder } from '../features/foldersSlice';
import { addFolderToNote, removeFolderFromNote } from '../features/notesSlice';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  TextField,
  Button,
  Autocomplete,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const FolderManager = ({ note }) => {
  const dispatch = useDispatch();
  const { folders, loading: foldersLoading } = useSelector((state) => state.folders);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    dispatch(getFolders());
  }, [dispatch]);

  const handleAddFolder = (folder) => {
    dispatch(addFolderToNote({ noteId: note.id, folderId: folder.id }));
  };

  const handleRemoveFolder = (folderId) => {
    dispatch(removeFolderFromNote({ noteId: note.id, folderId }));
  };

  const handleCreateFolder = () => {
    dispatch(createFolder({ name: newFolderName }));
    setNewFolderName('');
  };

  const noteFolderIds = note.folders.map((folder) => folder.id);
  const availableFolders = folders.filter((folder) => !noteFolderIds.includes(folder.id));

  return (
    <Box>
      <Typography variant="h6">Folders</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {note.folders.map((folder) => (
          <Chip
            key={folder.id}
            label={folder.name}
            onDelete={() => handleRemoveFolder(folder.id)}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Autocomplete
          options={availableFolders}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => {
            if (newValue) {
              handleAddFolder(newValue);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Add to folder" variant="standard" />
          )}
          loading={foldersLoading}
        />
        <TextField
          label="Create new folder"
          variant="standard"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <IconButton onClick={handleCreateFolder}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default FolderManager;
