import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    borderRadius: 8,
    padding: 8,
  },
  dialogContent: {
    '& .MuiDialogContentText-root': {
      color: '#4b5563',
    },
  },
  dialogActions: {
    padding: theme.spacing(2),
  },
  cancelButton: {
    textTransform: 'none',
    color: '#6b7280',
  },
  repoListItem: {
    borderRadius: 8,
    marginBottom: theme.spacing(1),
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.04)',
    },
    '& .MuiListItemText-primary': {
      fontWeight: 500,
      color: '#111827',
      fontSize: '1rem',
      marginBottom: theme.spacing(0.5),
    },
    '& .MuiListItemText-secondary': {
      color: '#4b5563',
    },
  },
}));

const GitHubRepoDialog = ({ open, onClose, onSelect }) => {
  const classes = useStyles();
  const [repositories, setRepositories] = useState(() => {
    const savedRepos = localStorage.getItem('repositories');
    return savedRepos ? JSON.parse(savedRepos) : [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (repositories.length > 0) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }, [repositories]);

  useEffect(() => {
    if (open) {
      const params = new URLSearchParams(window.location.search);
      const isAuthenticated = params.get('authenticated');
      const userId = params.get('userId');
      
      if (isAuthenticated && userId) {
        fetchRepositories(userId);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [open]);

  const fetchRepositories = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/github/repos', {
        userId
      }, {
        headers: {
          'Accept': 'application/json'
        }
      });
      setRepositories(response.data);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      // If API fails, try to use cached repositories
      const savedRepos = localStorage.getItem('repositories');
      if (savedRepos) {
        setRepositories(JSON.parse(savedRepos));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRepoSelect = (repo) => {
    onSelect(repo);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: classes.dialogPaper
      }}
    >
      <DialogTitle>Select a Repository</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {repositories.map((repo) => (
              <ListItem
                key={repo.id}
                button
                onClick={() => handleRepoSelect(repo)}
                className={classes.repoListItem}
              >
                <ListItemText
                  primary={repo.name}
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="textSecondary">
                        {repo.description || 'No description'}
                      </Typography>
                      <Box mt={0.5}>
                        {repo.language && (
                          <Typography component="span" variant="caption" color="textSecondary">
                            {repo.language}
                          </Typography>
                        )}
                        <Typography component="span" variant="caption" color="textSecondary" style={{ marginLeft: 8 }}>
                          Updated {new Date(repo.updatedAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button 
          onClick={onClose}
          className={classes.cancelButton}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GitHubRepoDialog;
