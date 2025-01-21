import React from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  InputAdornment,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  repoContainer: {
    height: 400,
    display: 'flex',
    flexDirection: 'column',
  },
  searchBox: {
    marginBottom: theme.spacing(2),
  },
  repoList: {
    overflowY: 'auto',
    flex: 1,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 8,
    padding: theme.spacing(1),
  },
  repoListItem: {
    borderRadius: 8,
    marginBottom: theme.spacing(1),
    border: '1px solid transparent',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.04)',
    },
    '&.selected': {
      backgroundColor: 'rgba(79, 205, 196, 0.08)',
      borderColor: '#4ECDC4',
    },
  },
}));

const SelectRepository = ({
  loading,
  repositories,
  selectedRepo,
  searchQuery,
  onSearchChange,
  onRepoSelect,
  error,
}) => {
  const classes = useStyles();

  const filteredRepositories = repositories.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Box className={classes.repoContainer}>
      <TextField
        className={classes.searchBox}
        placeholder="Search repositories..."
        variant="outlined"
        size="small"
        fullWidth
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <Box className={classes.repoList}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {filteredRepositories.map((repo) => (
              <ListItem
                key={repo.id}
                button
                onClick={() => onRepoSelect(repo)}
                className={`${classes.repoListItem} ${selectedRepo?.id === repo.id ? 'selected' : ''}`}
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
            {filteredRepositories.length === 0 && !loading && (
              <Box p={2} textAlign="center">
                <Typography color="textSecondary">
                  No repositories found matching "{searchQuery}"
                </Typography>
              </Box>
            )}
          </List>
        )}
      </Box>
      {error && (
        <Typography color="error" variant="caption">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default SelectRepository;
