import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiDialog-paper': {
      backgroundColor: '#262626',
      color: '#fff',
      minWidth: 500,
      borderRadius: 15,
    },
  },
  title: {
    borderBottom: '1px solid #404040',
    padding: '20px 24px',
    '& h2': {
      fontSize: '1.2rem',
      fontWeight: 500,
    },
  },
  content: {
    padding: '24px',
    backgroundColor: '#262626',
  },
  messageField: {
    '& .MuiOutlinedInput-root': {
      fontSize: '0.9rem',
      backgroundColor: '#1a1a1a',
      borderRadius: 15,
      color: '#fff',
      '& fieldset': {
        borderColor: '#404040',
      },
      '&:hover fieldset': {
        borderColor: '#666',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#0078d4',
      },
    },
    '& .MuiFormHelperText-root': {
      color: '#888',
    },
  },
  fileList: {
    marginTop: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 16,
  },
  fileItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0',
    '&:not(:last-child)': {
      borderBottom: '1px solid #404040',
    },
  },
  fileIcon: {
    marginRight: 8,
    color: '#888',
  },
  fileName: {
    color: '#fff',
  },
  actions: {
    padding: '16px 24px',
    borderTop: '1px solid #404040',
    '& .MuiButton-root': {
      textTransform: 'none',
      padding: '6px 16px',
      borderRadius: 6,
    },
  },
  commitButton: {
    backgroundColor: '#0078d4',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#006abc',
    },
  },
  cancelButton: {
    color: '#fff',
    marginRight: 8,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
}));

const CommitDialog = ({ open, onClose, files, onCommit }) => {
  const classes = useStyles();
  const [message, setMessage] = useState('Update: Made changes to improve functionality and user experience');

  const handleCommit = () => {
    onCommit(message);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className={classes.dialog}>
      <DialogTitle className={classes.title}>
        Commit Changes
      </DialogTitle>
      <DialogContent className={classes.content}>
        <TextField
          autoFocus
          multiline
          rows={3}
          variant="outlined"
          fullWidth
          placeholder="Describe your changes..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={classes.messageField}
          helperText="Brief description of the changes you made"
        />
        <Box className={classes.fileList}>
          <Typography variant="subtitle2" style={{ marginBottom: 8, color: '#888' }}>
            Files to be committed:
          </Typography>
          {files.map((file, index) => (
            <Box key={index} className={classes.fileItem}>
              <Typography className={classes.fileName}>
                {file}
              </Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={onClose} className={classes.cancelButton}>
          Cancel
        </Button>
        <Button 
          onClick={handleCommit} 
          className={classes.commitButton}
          disabled={!message.trim()}
        >
          Commit Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommitDialog;
