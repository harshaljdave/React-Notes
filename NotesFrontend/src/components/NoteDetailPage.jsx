import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getNoteById, updateNote, deleteNote, favoriteNote, unfavoriteNote, archiveNote, unarchiveNote } from '../features/notesSlice';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import ShareIcon from '@mui/icons-material/Share';
import TagManager from './TagManager';
import FolderManager from './FolderManager';
import ShareDialog from './ShareDialog';

const NoteDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedNote, loading, error } = useSelector((state) => state.notes);
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [openShareDialog, setOpenShareDialog] = useState(false);

  useEffect(() => {
    dispatch(getNoteById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
    }
  }, [selectedNote]);

  const handleUpdate = () => {
    dispatch(updateNote({ id, noteData: { title, content } }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch(deleteNote(id));
    navigate('/');
  };

  const handleFavorite = () => {
    if (selectedNote.favorited_by.includes(user.id)) {
      dispatch(unfavoriteNote(id));
    } else {
      dispatch(favoriteNote(id));
    }
  };

  const handleArchive = () => {
    if (selectedNote.is_archived) {
      dispatch(unarchiveNote(id));
    } else {
      dispatch(archiveNote(id));
    }
  };

  const handleOpenShareDialog = () => {
    setOpenShareDialog(true);
  };

  const handleCloseShareDialog = () => {
    setOpenShareDialog(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error.detail || 'An error occurred'}</Alert>;
  }

  if (!selectedNote) {
    return <Typography>Note not found</Typography>;
  }

  const isFavorited = selectedNote.favorited_by.includes(user.id);

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        {isEditing ? (
          <>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Content"
              multiline
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button onClick={handleUpdate} sx={{ mt: 2 }}>
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)} sx={{ mt: 2 }}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              {selectedNote.title}
            </Typography>
            <Typography variant="body1">{selectedNote.content}</Typography>
            <IconButton onClick={() => setIsEditing(true)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={handleFavorite}>
              {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton onClick={handleArchive}>
              {selectedNote.is_archived ? <UnarchiveIcon /> : <ArchiveIcon />}
            </IconButton>
            <IconButton onClick={handleOpenShareDialog}>
              <ShareIcon />
            </IconButton>
            <Box sx={{ mt: 4 }}>
              <TagManager note={selectedNote} />
            </Box>
            <Box sx={{ mt: 4 }}>
              <FolderManager note={selectedNote} />
            </Box>
          </>
        )}
      </Box>
      <ShareDialog
        open={openShareDialog}
        handleClose={handleCloseShareDialog}
        note={selectedNote}
      />
    </Container>
  );
};

export default NoteDetailPage;
