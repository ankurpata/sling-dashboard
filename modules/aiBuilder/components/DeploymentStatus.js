import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  makeStyles,
  Paper,
} from '@material-ui/core';
import { Launch as LaunchIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    border: '1px solid #E5E7EB',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  progress: {
    color: '#2563EB',
  },
  text: {
    flex: 1,
    color: '#111827',
  },
  previewButton: {
    textTransform: 'none',
    color: '#2563EB',
    '&:hover': {
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
    },
  },
  buttonIcon: {
    marginLeft: theme.spacing(0.5),
    fontSize: '1rem',
  },
}));

const DeploymentStatus = ({ status, previewUrl }) => {
  const classes = useStyles();

  const handlePreviewClick = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  return (
    <Paper elevation={0} className={classes.root}>
      <Box className={classes.content}>
        {status === 'in_progress' && (
          <CircularProgress size={20} className={classes.progress} />
        )}
        <Typography className={classes.text}>
          {status === 'in_progress' 
            ? 'Deployment in progress...' 
            : status === 'completed'
            ? 'Deployment completed successfully!'
            : 'Starting deployment...'}
        </Typography>
        {status === 'completed' && previewUrl && (
          <Button
            className={classes.previewButton}
            onClick={handlePreviewClick}
            endIcon={<LaunchIcon className={classes.buttonIcon} />}
          >
            View Preview
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default DeploymentStatus;
