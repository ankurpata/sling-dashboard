import React from 'react';
import {Box, Typography, CircularProgress} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  processingView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(3),
    gap: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    maxWidth: 800,
    margin: '0 auto',
    marginTop: theme.spacing(2),
    transition: 'all 0.3s ease-in-out',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  progress: {
    color: theme.palette.grey[400],
    width: 30,
    height: 30,
  },
  text: {
    color: theme.palette.text.secondary,
    fontSize: '0.95rem',
  }
}));

const ProcessingView = () => {
  const classes = useStyles();

  return (
    <Box className={classes.processingView}>
      <Box className={classes.loadingContainer}>
        <CircularProgress 
          size={24}
          className={classes.progress}
        />
        <Typography className={classes.text}>
          is thinking...
        </Typography>
      </Box>
    </Box>
  );
};

export default ProcessingView;
