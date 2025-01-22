import React, {useState} from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Paper,
  ClickAwayListener,
  Chip,
  InputAdornment,
  Typography,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import GitHubIcon from '@material-ui/icons/GitHub';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'relative',
  },
  searchInput: {
    width: '100%',
    marginBottom: theme.spacing(2),
    '& .MuiInputBase-root': {
      paddingBottom: theme.spacing(1),
    },
  },
  resultsList: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    maxHeight: 300,
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    display: 'none',
    '&.open': {
      display: 'block',
    },
  },
  listItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.selected': {
      backgroundColor: theme.palette.action.selected,
    },
  },
  description: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
  chip: {
    margin: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    '& .MuiChip-label': {
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
  },
  searchIcon: {
    color: theme.palette.text.secondary,
  },
  githubIcon: {
    fontSize: '1rem',
    marginRight: theme.spacing(0.5),
  },
  branchName: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    '&::before': {
      content: '"/"',
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(0.5),
    },
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
  const [isOpen, setIsOpen] = useState(false);

  const handleInputClick = () => {
    if (!selectedRepo) {
      setIsOpen(true);
    }
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  const handleRepoClick = (repo) => {
    onRepoSelect(repo);
    onSearchChange(''); // Clear search when selecting
    setIsOpen(false);
  };

  const handleDeleteChip = (e) => {
    e.stopPropagation(); // Prevent input click handler from firing
    onRepoSelect(null);
    onSearchChange('');
  };

  const filteredRepos = repositories.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getChipLabel = (repo) => (
    <Box display="flex" alignItems="center">
      <GitHubIcon className={classes.githubIcon} />
      {repo.name}
      <Typography component="span" className={classes.branchName}>
        {repo.defaultBranch || 'main'}
      </Typography>
    </Box>
  );

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className={classes.root}>
        <TextField
          className={classes.searchInput}
          placeholder={selectedRepo ? '' : 'Search repositories...'}
          value={searchQuery}
          onClick={handleInputClick}
          onChange={(e) => onSearchChange(e.target.value)}
          error={!!error}
          helperText={error}
          InputProps={{
            readOnly: !!selectedRepo,
            startAdornment: selectedRepo ? (
              <InputAdornment position="start">
                <Chip
                  label={getChipLabel(selectedRepo)}
                  onDelete={handleDeleteChip}
                  className={classes.chip}
                />
              </InputAdornment>
            ) : (
              <InputAdornment position="start">
                <SearchIcon className={classes.searchIcon} />
              </InputAdornment>
            ),
            endAdornment: loading && <CircularProgress size={20} />,
          }}
        />
        <Paper className={`${classes.resultsList} ${isOpen ? 'open' : ''}`}>
          <List>
            {filteredRepos.map((repo) => (
              <ListItem
                key={repo.name}
                onClick={() => handleRepoClick(repo)}
                className={`${classes.listItem} ${
                  selectedRepo?.name === repo.name ? 'selected' : ''
                }`}>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center">
                      <GitHubIcon className={classes.githubIcon} />
                      {repo.name}
                    </Box>
                  }
                  secondary={repo.description || 'No description available'}
                  classes={{secondary: classes.description}}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
    </ClickAwayListener>
  );
};

export default SelectRepository;
