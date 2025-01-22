import React from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  InputAdornment,
  CircularProgress,
  Chip,
  IconButton,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  searchField: {
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
  selectedChip: {
    margin: theme.spacing(0.5),
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    borderRadius: '4px',
    '& .MuiChip-label': {
      fontSize: '0.95rem',
      color: 'rgba(0, 0, 0, 0.87)',
    },
    '& .MuiChip-deleteIcon': {
      color: 'rgba(0, 0, 0, 0.54)',
      '&:hover': {
        color: 'rgba(0, 0, 0, 0.87)',
      },
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
  searchInputContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
}));

const SelectRepository = ({
  repositories,
  selectedRepo,
  onRepoSelect,
  searchQuery,
  onSearchChange,
  loading,
  error,
}) => {
  const classes = useStyles();

  const filteredRepositories = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description &&
        repo.description.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleClearSelection = () => {
    onRepoSelect(null);
  };

  return (
    <div className={classes.root}>
      <TextField
        fullWidth
        variant="outlined"
        label="Search repositories"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className={classes.searchField}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {selectedRepo ? (
                <Chip
                  label={selectedRepo.name}
                  onDelete={handleClearSelection}
                  className={classes.selectedChip}
                  size="medium"
                />
              ) : (
                <SearchIcon />
              )}
            </InputAdornment>
          ),
        }}
        disabled={selectedRepo !== null}
        placeholder={selectedRepo ? "" : "Search repositories..."}
      />

      <List className={classes.list}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
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
                  <Typography className={classes.repoName}>{repo.name}</Typography>
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
        <Typography color="error" variant="caption">
          {error}
        </Typography>
      )}
    </div>
  );
};

export default SelectRepository;
