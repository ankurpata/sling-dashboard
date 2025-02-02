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
  Snackbar,
  ErrorIcon,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ShareIcon from '@material-ui/icons/Share';
import RefreshIcon from '@material-ui/icons/Refresh';
import FolderIcon from '@material-ui/icons/Folder';
import {getAICommitMessage} from '../services/aiService';
import {
  createPullRequest,
  listPullRequests,
  discardChanges,
} from '../services/repositoryService';

const CACHE_KEY = 'pullRequestsCache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const COMMIT_CACHE_KEY = 'aiCommitMessageCache';
const COMMIT_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

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
    marginBottom: 16,
    position: 'relative',
    '& .MuiOutlinedInput-root': {
      fontSize: '0.9rem',
      backgroundColor: '#1a1a1a',
      borderColor: '#30363d',
      color: '#c9d1d9',
      '&:hover': {
        borderColor: '#58a6ff',
      },
      '&.Mui-focused': {
        borderColor: '#58a6ff',
      },
    },
    '& .MuiFormHelperText-root': {
      marginLeft: 0,
      color: '#8b949e',
    },
  },
  messageRefreshButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    color: '#888',
    padding: 6,
    '&:hover': {
      color: '#fff',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&.spinning': {
      animation: '$spin 1s linear infinite',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '1.1rem',
    },
  },
  branchField: {
    marginBottom: 36,
    '& .MuiOutlinedInput-root': {
      fontSize: '0.9rem',
      backgroundColor: '#1a1a1a',
      borderColor: '#30363d',
      color: '#c9d1d9',
      '&:hover': {
        borderColor: '#58a6ff',
      },
      '&.Mui-focused': {
        borderColor: '#58a6ff',
      },
    },
    '& .MuiFormHelperText-root': {
      marginLeft: 0,
      color: '#8b949e',
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
    '& .header': {
      padding: '0 16px 8px',
      color: '#888',
    },
  },
  fileItem: {
    padding: '8px 16px',
    borderBottom: '1px solid #21262d',
    '&:last-child': {
      borderBottom: 'none',
    },
    '&:hover': {
      backgroundColor: '#161b22',
    },
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginBottom: 0,
    borderBottom: '1px solid #30363d',
    '& .MuiTabs-indicator': {
      backgroundColor: '#0078d4',
    },
  },
  tab: {
    color: '#888',
    minWidth: 100,
    textTransform: 'none',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    '&.Mui-selected': {
      color: '#fff',
    },
  },
  refreshButton: {
    color: 'inherit',
    padding: 4,
    marginLeft: 4,
    width: 20,
    height: 20,
    '&:hover': {
      color: '#fff',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&.spinning': {
      animation: '$spin 1s linear infinite',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '0.9rem',
    },
  },
  tabContent: {
    backgroundColor: '#1a1a1a',
    padding: '16px 0',
  },
  pullRequestList: {
    '& > *': {
      marginBottom: 16,
    },
  },
  pullRequestItem: {
    padding: '10px 25px',
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
  pullRequestHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 25px',
    color: '#888',
  },
  sectionHeader: {
    backgroundColor: '#161b22',
    color: '#c9d1d9',
    padding: '12px 25px',
    borderBottom: '1px solid #30363d',
    fontWeight: 600,
    fontSize: '0.95rem',
    letterSpacing: '0.01em',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    '& .MuiSvgIcon-root': {
      fontSize: '1.1rem',
      opacity: 0.7,
    },
  },
  '@keyframes spin': {
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
  successContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 0',
    '& .icon': {
      fontSize: 64,
      color: '#238636',
      animation: '$scaleIn 0.5s ease-out',
    },
    '& .message': {
      marginTop: 16,
      marginBottom: 24,
      textAlign: 'center',
    },
  },
  '@keyframes scaleIn': {
    '0%': {
      transform: 'scale(0)',
      opacity: 0,
    },
    '50%': {
      transform: 'scale(1.2)',
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
  shareButtons: {
    display: 'flex',
    gap: 16,
    marginTop: 16,
    '& .MuiButton-root': {
      textTransform: 'none',
      borderColor: '#30363d',
      color: '#c9d1d9',
      '&:hover': {
        borderColor: '#58a6ff',
        backgroundColor: 'rgba(56, 139, 253, 0.1)',
      },
    },
  },
  errorMessage: {
    backgroundColor: '#3d1c1c',
    color: '#f85149',
    padding: '8px 16px',
    borderRadius: 4,
    marginTop: -8,
    marginBottom: 16,
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    '& .MuiSvgIcon-root': {
      fontSize: '1.1rem',
    },
  },
}));

const CommitDialog = ({open, onClose, files, projectId, setFileChanges}) => {
  const classes = useStyles();
  const [message, setMessage] = useState('');
  const [branchName, setBranchName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [pullRequests, setPullRequests] = useState({});
  const [isPRLoading, setPRLoading] = useState(false);
  const [prSuccess, setPrSuccess] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [error, setError] = useState('');

  const generateCacheKey = (files) => {
    // Create a unique key based on file paths and their states
    const fileKey = files
      .map((f) => `${f.path}:${f.additions || 0}:${f.deletions || 0}`)
      .join('|');
    return `${COMMIT_CACHE_KEY}_${fileKey}`;
  };

  const fetchCommitMessage = useCallback(
    async (forceRefresh = false) => {
      if (!files || files.length === 0) return;

      const cacheKey = generateCacheKey(files);
      const cachedData = localStorage.getItem(cacheKey);

      if (!forceRefresh && cachedData) {
        const {message, timestamp} = JSON.parse(cachedData);
        const isExpired = Date.now() - timestamp > COMMIT_CACHE_DURATION;

        if (!isExpired) {
          setMessage(message);
          return;
        }
      }

      setIsMessageLoading(true);
      try {
        const commitMessage = await getAICommitMessage(files);
        if (commitMessage?.message) {
          setMessage(commitMessage.message);
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              message: commitMessage.message,
              timestamp: Date.now(),
            }),
          );
        }
      } catch (error) {
        console.error('Error fetching AI commit message:', error);
        setMessage(
          'Update: Made changes to improve functionality and user experience',
        );
      } finally {
        setIsMessageLoading(false);
      }
    },
    [files],
  );

  const handleRefreshMessage = (e) => {
    e.stopPropagation();
    fetchCommitMessage(true);
  };

  const fetchPullRequests = useCallback(async (forceRefresh = false) => {
    const cachedData = localStorage.getItem(CACHE_KEY);

    if (!forceRefresh && cachedData) {
      const {data, timestamp} = JSON.parse(cachedData);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;

      if (!isExpired) {
        setPullRequests(data);
        return;
      }
    }

    setPRLoading(true);
    setIsRefreshing(forceRefresh);
    try {
      const prs = await listPullRequests();
      setPullRequests(prs);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: prs,
          timestamp: Date.now(),
        }),
      );
    } catch (error) {
      console.error('Error fetching pull requests:', error);
    } finally {
      setPRLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleRefresh = () => {
    fetchPullRequests(true);
  };

  useEffect(() => {
    if (open) {
      setError('');
      setPrSuccess(null);
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
    setError('');
    try {
      const response = await createPullRequest(projectId, message, branchName);
      if (response.success && response.prUrl) {
        setPrSuccess(response.prUrl);
        setFileChanges([]);
      }
    } catch (error) {
      console.error('Error creating pull request:', error);
      setError('Failed to create pull request. Please try again.');
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

  const handleCopyPRUrl = () => {
    if (prSuccess) {
      navigator.clipboard.writeText(prSuccess);
      setSnackbarOpen(true);
    }
  };

  const handleShare = () => {
    if (prSuccess) {
      navigator
        .share({
          title: 'New Pull Request',
          text: message,
          url: prSuccess,
        })
        .catch(console.error);
    }
  };

  return (
    <>
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
          {prSuccess ? (
            <Box className={classes.successContent}>
              <CheckCircleIcon className='icon' />
              <Typography variant='h6' className='message'>
                Pull Request Created Successfully!
              </Typography>
              <Typography style={{color: '#8b949e', marginBottom: 24}}>
                Your changes are now ready for review
              </Typography>
              <Box className={classes.shareButtons}>
                <Button
                  variant='outlined'
                  startIcon={<FileCopyIcon />}
                  onClick={handleCopyPRUrl}>
                  Copy PR URL
                </Button>
                {navigator.share && (
                  <Button
                    variant='outlined'
                    startIcon={<ShareIcon />}
                    onClick={handleShare}>
                    Share
                  </Button>
                )}
                <Button
                  variant='outlined'
                  color='primary'
                  href={prSuccess}
                  target='_blank'
                  rel='noopener noreferrer'>
                  View PR
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              {isMessageLoading && (
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
                error={!!error}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      className={`${classes.messageRefreshButton} ${isMessageLoading ? 'spinning' : ''}`}
                      onClick={handleRefreshMessage}
                      disabled={isMessageLoading}
                      size='small'
                      title='Refresh AI commit message'>
                      <RefreshIcon />
                    </IconButton>
                  ),
                }}
              />
              {error && <Box className={classes.errorMessage}>{error}</Box>}
              <TextField
                variant='outlined'
                fullWidth
                placeholder='feature/my-new-feature'
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className={classes.branchField}
                helperText='Optional: Branch name for your changes (if not provided, a name will be generated)'
              />
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                className={classes.tabs}
                variant='fullWidth'>
                <Tab label='Changes' className={classes.tab} />
                <Tab
                  className={classes.tab}
                  label={
                    <Box display='flex' alignItems='center'>
                      Previous Changes
                      <IconButton
                        className={`${classes.refreshButton} ${isRefreshing ? 'spinning' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRefresh();
                        }}
                        disabled={isPRLoading}
                        size='small'>
                        <RefreshIcon />
                      </IconButton>
                    </Box>
                  }
                />
              </Tabs>
              <Box className={classes.tabContent}>
                {activeTab === 0 ? (
                  <Box className={classes.fileList}>
                    <Typography variant='subtitle2' className='header'>
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
                              label='New'
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
                    {isPRLoading ? (
                      <Box display='flex' justifyContent='center' p={2}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : (
                      Object.entries(pullRequests || {}).map(
                        ([repo, prs]) =>
                          prs?.length > 0 && (
                            <Box key={repo}>
                              <Typography
                                variant='subtitle2'
                                className={classes.sectionHeader}>
                                {repo === 'baloonDevPRs' ? (
                                  <>
                                    <FolderIcon />
                                    Baloon Development
                                  </>
                                ) : (
                                  <>
                                    <FolderIcon />
                                    Others
                                  </>
                                )}
                              </Typography>
                              {prs.map((pr) => (
                                <Box
                                  key={pr.number}
                                  className={classes.pullRequestItem}>
                                  <Typography className='title'>
                                    <a
                                      href={pr.url}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                      className='link'>
                                      {pr.title}
                                    </a>
                                    <span className={`state ${pr.state}`}>
                                      {pr.state}
                                    </span>
                                  </Typography>
                                  <Typography className='meta'>
                                    <span>
                                      #{pr.number} in {pr.repository}
                                    </span>
                                    <span>
                                      Created{' '}
                                      {new Date(
                                        pr.createdAt,
                                      ).toLocaleDateString()}
                                    </span>
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          ),
                      )
                    )}
                  </Box>
                )}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions className={classes.actions}>
          {!prSuccess && (
            <>
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
            </>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message='PR URL copied to clipboard'
      />
    </>
  );
};

export default CommitDialog;
