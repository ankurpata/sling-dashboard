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
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'relative',
  },
  searchInput: {
    width: '100%',
    marginBottom: theme.spacing(2),
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
    setIsOpen(true);
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  const handleRepoClick = (repo) => {
    onRepoSelect(repo);
    setIsOpen(false);
  };

  const filteredRepos = repositories.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className={classes.root}>
        <TextField
          className={classes.searchInput}
          placeholder="Search repositories..."
          value={selectedRepo ? selectedRepo.name : searchQuery}
          onClick={handleInputClick}
          onChange={(e) => onSearchChange(e.target.value)}
          error={!!error}
          helperText={error}
          InputProps={{
            readOnly: !!selectedRepo,
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
                  primary={repo.name}
                  secondary={
                    repo.description || 'No description available'
                  }
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
