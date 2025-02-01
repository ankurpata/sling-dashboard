import React, {useState, useEffect} from 'react';
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
  IconButton,
  Chip,
  CircularProgress,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import {getAICommitMessage} from '../services/aiService';

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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    '& h2': {
      fontSize: '1.2rem',
      fontWeight: 500,
      marginBottom: 4,
    },
  },
  subtitle: {
    color: '#888',
    fontSize: '0.75rem',
  },
  closeButton: {
    color: '#fff',
    padding: 6,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '1.2rem',
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
      color: '#666',
    },
  },
  loadingMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#666',
    fontSize: '0.85rem',
    marginBottom: 8,
  },
  fileList: {
    marginTop: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 16,
  },
  fileItem: {
    padding: '8px 0',
    borderBottom: '1px solid #404040',
    '&:last-child': {
      borderBottom: 'none',
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fileName: {
    color: '#fff',
    fontSize: '0.9rem',
    flex: 1,
    marginRight: 16,
    width: '80%',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  chipContainer: {
    display: 'flex',
    gap: 8,
    width: '20%',
    justifyContent: 'flex-end',
  },
  addChip: {
    backgroundColor: '#1e4620',
    color: '#81c784',
    height: 24,
    '& .MuiChip-icon': {
      color: '#81c784',
      fontSize: '1rem',
      marginLeft: 4,
    },
  },
  deleteChip: {
    backgroundColor: '#461e1e',
    color: '#e57373',
    height: 24,
    '& .MuiChip-icon': {
      color: '#e57373',
      fontSize: '1rem',
      marginLeft: 4,
    },
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

const CommitDialog = ({open, onClose, files, onCommit}) => {
  const classes = useStyles();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCommitMessage = async () => {
      if (!files || files.length === 0) return;

      setIsLoading(true);
      try {
        const commitMessage = await getAICommitMessage(files);
        if (commitMessage?.message) {
          setMessage(commitMessage.message);
        }
      } catch (error) {
        console.error('Error fetching AI commit message:', error);
        setMessage(
          'Update: Made changes to improve functionality and user experience',
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchCommitMessage();
    }
  }, [files, open]);

  const handleCommit = () => {
    onCommit(message);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className={classes.dialog}>
      <DialogTitle className={classes.title} disableTypography>
        <Box>
          <Typography variant='h2'>Push Changes</Typography>
          <Typography className={classes.subtitle}>
            This will only create a pull request for review. No direct changes
            to production.
          </Typography>
        </Box>
        <IconButton
          className={classes.closeButton}
          onClick={onClose}
          aria-label='close'
          size='small'>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.content}>
        {isLoading && (
          <Box className={classes.loadingMessage}>
            <CircularProgress size={16} />
            <span>Generating commit message...</span>
          </Box>
        )}
        <TextField
          autoFocus
          multiline
          rows={3}
          variant='outlined'
          fullWidth
          placeholder='Describe your changes...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={classes.messageField}
          helperText='Brief description of the changes you made'
        />
        <Box className={classes.fileList}>
          <Typography
            variant='subtitle2'
            style={{marginBottom: 8, color: '#888'}}>
            Files to be committed:
          </Typography>
          {files.map((file, index) => (
            <Box key={index} className={classes.fileItem}>
              <Typography className={classes.fileName}>{file.path}</Typography>
              <Box className={classes.chipContainer}>
                {file.additions > 0 && (
                  <Chip
                    icon={<AddIcon />}
                    label={file.additions}
                    className={classes.addChip}
                    size='small'
                  />
                )}
                {file.deletions > 0 && (
                  <Chip
                    icon={<RemoveIcon />}
                    label={file.deletions}
                    className={classes.deleteChip}
                    size='small'
                  />
                )}
              </Box>
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
          disabled={!message.trim()}>
          Commit Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommitDialog;
