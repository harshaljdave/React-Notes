import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotes, createNote } from '../features/notesSlice';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const dispatch = useDispatch();
  const { notes, loading, error } = useSelector((state) => state.notes);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getNotes());
    }
  }, [dispatch, isAuthenticated]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateNote = () => {
    dispatch(createNote({ title, content }));
    handleClose();
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <Typography variant="h4" sx={{ mt: 4 }}>
          Welcome to the Notes App
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Please <Link to="/login">login</Link> or <Link to="/register">register</Link> to continue.
        </Typography>
      </Container>
    );
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error.detail || 'An error occurred'}</Alert>;
  }

  return (
    <Container>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {notes.map((note) => (
          <Grid item xs={12} sm={6} md={4} key={note.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {note.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {note.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleClickOpen}
      >
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a new note</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            id="content"
            label="Content"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="standard"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateNote}>Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomePage;
