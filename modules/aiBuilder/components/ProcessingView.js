import React from 'react';
import {Box, Typography, CircularProgress} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  processingView: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    alignItems: 'flex-start',
    padding: theme.spacing(3),
    gap: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    maxWidth: 750,
    margin: '0 auto',
    // marginTop: theme.spacing(2),
     transition: 'all 0.3s ease-in-out',
    position: 'relative',
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: 1,
      backgroundColor: theme.palette.divider,
    },
    '&::before': {
      left: -theme.spacing(3),
    },
    '&::after': {
      right: -theme.spacing(3),
    }
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
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: '#f5f5f5',
    padding: theme.spacing(0.5),
    marginRight: theme.spacing(1),
  }
}));

const ProcessingView = () => {
  const classes = useStyles();

  return (
    <Box className={classes.processingView}>
      <Box className={classes.loadingContainer}>
        <img src="/favicon.ico" alt="AI" className={classes.icon} />
        <CircularProgress 
          size={30}
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
