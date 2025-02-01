import React, {useState, useEffect, useCallback} from 'react';
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
  Tabs,
  Tab,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import {getAICommitMessage} from '../services/aiService';
import {createPullRequest, listPullRequests, discardChanges} from '../services/repositoryService';

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
    marginBottom: 36,
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
    backgroundColor: '#238636',
    color: '#fff',
  },
  deleteChip: {
    backgroundColor: '#da3633',
    color: '#fff',
  },
  newFileChip: {
    backgroundColor: '#58a6ff',
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
  tabs: {
    backgroundColor: '#1a1a1a',
    '& .MuiTabs-indicator': {
      backgroundColor: '#0078d4',
    },
  },
  tab: {
    color: '#888',
    minWidth: 100,
    textTransform: 'none',
    fontSize: '0.9rem',
    '&.Mui-selected': {
      color: '#fff',
    },
  },
  tabContent: {
    padding: '24px 0',
  },
  pullRequestList: {
    '& > *': {
      marginBottom: 16,
    },
  },
  pullRequestItem: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    '& .title': {
      color: '#fff',
      marginBottom: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    '& .meta': {
      color: '#888',
      fontSize: '0.85rem',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    },
    '& .state': {
      padding: '2px 8px',
      borderRadius: 12,
      fontSize: '0.75rem',
      fontWeight: 500,
      '&.open': {
        backgroundColor: '#238636',
        color: '#fff',
      },
      '&.closed': {
        backgroundColor: '#da3633',
        color: '#fff',
      },
    },
    '& .link': {
      color: '#58a6ff',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
}));

const CommitDialog = ({open, onClose, files, projectId}) => {
  const classes = useStyles();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [pullRequests, setPullRequests] = useState({});
  const [isPRLoading, setPRLoading] = useState(false);

  const fetchCommitMessage = useCallback(async () => {
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
  }, [files]);

  const fetchPullRequests = useCallback(async () => {
    setPRLoading(true);
    try {
      const prs = await listPullRequests();
      setPullRequests(prs);
    } catch (error) {
      console.error('Error fetching pull requests:', error);
    } finally {
      setPRLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchCommitMessage();
    }
  }, [open, fetchCommitMessage]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchPullRequests();
    }
  }, [activeTab, fetchPullRequests]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCommit = async () => {
    setIsLoading(true);
    try {
      await createPullRequest(projectId, message);
      onClose();
    } catch (error) {
      console.error('Error creating pull request:', error);
      // TODO: Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = async () => {
    try {
      await discardChanges(projectId);
      onClose();
    } catch (error) {
      console.error('Error discarding changes:', error);
      // TODO: Show error message to user
    }
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
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          className={classes.tabs}
          variant='fullWidth'>
          <Tab label='Changes' className={classes.tab} />
          <Tab label='Previous Changes' className={classes.tab} />
        </Tabs>
        <Box className={classes.tabContent}>
          {activeTab === 0 ? (
            <Box className={classes.fileList}>
              <Typography
                variant='subtitle2'
                style={{marginBottom: 8, color: '#888'}}>
                Files to be pushed:
              </Typography>
              {files?.map((file, index) => (
                <Box key={index} className={classes.fileItem}>
                  <Typography className={classes.fileName}>
                    {file.path}
                  </Typography>
                  <Box className={classes.chipContainer}>
                    {file.additions > 0 || file.deletions > 0 ? (
                      <>
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
                      </>
                    ) : (
                      <Chip
                        icon={<NoteAddIcon />}
                        label="New"
                        className={classes.newFileChip}
                        size='small'
                      />
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box className={classes.pullRequestList}>
              <Typography variant='subtitle2' style={{color: '#888'}}>
                Previous Pull Requests
              </Typography>
              {isPRLoading ? (
                <Box display="flex" justifyContent="center" p={2}>
                  <CircularProgress size={24} />
                </Box>
              ) : Object.entries(pullRequests || {}).map(([repo, prs]) => (
                prs?.length > 0 && (
                  <Box key={repo}>
                    <Typography variant="subtitle2" style={{color: '#888', marginBottom: 8}}>
                      {repo === 'baloonDev' ? 'Baloon Development' : repo}
                    </Typography>
                    {prs.map((pr) => (
                      <Box key={pr.number} className={classes.pullRequestItem}>
                        <Typography className="title">
                          <a href={pr.url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="link">
                            {pr.title}
                          </a>
                          <span className={`state ${pr.state}`}>
                            {pr.state}
                          </span>
                        </Typography>
                        <Typography className="meta">
                          <span>#{pr.number} in {pr.repository}</span>
                          <span>Created {new Date(pr.createdAt).toLocaleDateString()}</span>
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={handleDiscard} className={classes.cancelButton}>
          Discard Changes
        </Button>
        <Button
          onClick={handleCommit}
          className={classes.commitButton}
          disabled={!message.trim() || isLoading}>
          {isLoading ? (
            <>
              <CircularProgress size={16} style={{marginRight: 8}} />
              Creating PR...
            </>
          ) : (
            'Create Pull Request'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommitDialog;
