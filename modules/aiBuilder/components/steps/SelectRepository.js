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
  makeStyles,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  header: {
    marginBottom: theme.spacing(3),
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  description: {
    fontSize: '1rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
  },
  searchField: {
    // marginBottom: theme.spacing(3),
    '& .MuiOutlinedInput-root': {
      fontSize: '1.1rem',
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
      },
      '&:hover fieldset': {
        borderColor: '#000',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#000',
      },
    },
    '& .MuiInputLabel-outlined': {
      fontSize: '1.1rem',
    },
  },
  list: {
    border: '1px solid rgba(0, 0, 0, 0.12)',
    borderRadius: theme.shape.borderRadius,
    maxHeight: '400px',
    overflow: 'auto',
    paddingTop: 0,
    paddingBottom: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  listItem: {
    padding: theme.spacing(2, 3),
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    '&:last-child': {
      borderBottom: 'none',
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
      },
    },
  },
  repoName: {
    fontSize: '1.1rem',
    fontWeight: 500,
  },
  repoDescription: {
    fontSize: '1rem',
    color: theme.palette.text.secondary,
  },
  noResults: {
    padding: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    fontSize: '1.1rem',
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

  const filteredRepositories = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description &&
        repo.description.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className={classes.root}>
      <TextField
        fullWidth
        variant='outlined'
        label='Search repositories'
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className={classes.searchField}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <List className={classes.list}>
        {loading ? (
          <Box display='flex' justifyContent='center' p={3}>
            <CircularProgress />
          </Box>
        ) : filteredRepositories.length > 0 ? (
          filteredRepositories.map((repo) => (
            <ListItem
              key={repo.id}
              button
              selected={selectedRepo?.id === repo.id}
              onClick={() => onRepoSelect(repo)}
              className={classes.listItem}>
              <ListItemText
                primary={
                  <Typography className={classes.repoName}>
                    {repo.name}
                  </Typography>
                }
                secondary={
                  <Typography className={classes.repoDescription}>
                    {repo.description || 'No description available'}
                  </Typography>
                }
              />
            </ListItem>
          ))
        ) : (
          <Typography className={classes.noResults}>
            No repositories found matching "{searchQuery}"
          </Typography>
        )}
      </List>
      {error && (
        <Typography color='error' variant='caption'>
          {error}
        </Typography>
      )}
    </div>
  );
};

export default SelectRepository;
