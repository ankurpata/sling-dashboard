import React from 'react';
import { CircularProgress, Box, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(3),
  },
  progress: {
    color: '#2563EB',
    marginBottom: theme.spacing(2),
  },
  text: {
    color: '#6B7280',
    fontSize: '0.875rem',
  },
}));

const LoadingIndicator = ({ message = 'Loading...' }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <CircularProgress size={24} className={classes.progress} />
      <Typography className={classes.text}>{message}</Typography>
    </Box>
  );
};

export default LoadingIndicator;
