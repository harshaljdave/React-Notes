import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTags, createTag } from '../features/tagsSlice';
import { addTagToNote, removeTagFromNote } from '../features/notesSlice';
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

const TagManager = ({ note }) => {
  const dispatch = useDispatch();
  const { tags, loading: tagsLoading } = useSelector((state) => state.tags);
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    dispatch(getTags());
  }, [dispatch]);

  const handleAddTag = (tag) => {
    dispatch(addTagToNote({ noteId: note.id, tagId: tag.id }));
  };

  const handleRemoveTag = (tagId) => {
    dispatch(removeTagFromNote({ noteId: note.id, tagId }));
  };

  const handleCreateTag = () => {
    dispatch(createTag({ name: newTagName }));
    setNewTagName('');
  };

  const noteTagIds = note.tags.map((tag) => tag.id);
  const availableTags = tags.filter((tag) => !noteTagIds.includes(tag.id));

  return (
    <Box>
      <Typography variant="h6">Tags</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {note.tags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.name}
            onDelete={() => handleRemoveTag(tag.id)}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Autocomplete
          options={availableTags}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => {
            if (newValue) {
              handleAddTag(newValue);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Add a tag" variant="standard" />
          )}
          loading={tagsLoading}
        />
        <TextField
          label="Create new tag"
          variant="standard"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
        />
        <IconButton onClick={handleCreateTag}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TagManager;
