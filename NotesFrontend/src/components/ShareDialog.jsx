import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSharedWith, shareNote } from '../features/notesSlice';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ShareDialog = ({ open, handleClose, note }) => {
  const dispatch = useDispatch();
  const { sharedWith, loading } = useSelector((state) => state.notes);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('view');

  useEffect(() => {
    if (open) {
      dispatch(getSharedWith(note.id));
    }
  }, [dispatch, open, note.id]);

  const handleShare = () => {
    dispatch(shareNote({ noteId: note.id, email, permission }));
    setEmail('');
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Share "{note.title}"</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Shared with</Typography>
        <List>
          {sharedWith.map((share) => (
            <ListItem
              key={share.id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={share.shared_with.email}
                secondary={share.permission}
              />
            </ListItem>
          ))}
        </List>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Share with new user
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="permission-label">Permission</InputLabel>
          <Select
            labelId="permission-label"
            id="permission"
            value={permission}
            label="Permission"
            onChange={(e) => setPermission(e.target.value)}
          >
            <MenuItem value="view">View</MenuItem>
            <MenuItem value="edit">Edit</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleShare}>Share</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;
