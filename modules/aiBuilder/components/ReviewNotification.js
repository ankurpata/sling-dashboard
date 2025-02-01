import React from 'react';
import {Box, Typography, Button, makeStyles} from '@material-ui/core';
import {FileCopyTwoTone} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  reviewNotification: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e1e1e',
    width: '100%',
    padding: '8px 16px',
    borderRadius: '4px',
    border: '1px solid #333',
  },
  reviewLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  reviewIcon: {
    fontSize: '18px',
    color: '#888',
    marginRight: '4px',
  },
  reviewText: {
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 500,
  },
  reviewActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  rejectButton: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: 'none',
    padding: '4px 12px',
    fontSize: '13px',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  acceptButton: {
    backgroundColor: '#0078d4',
    color: '#ffffff',
    border: 'none',
    padding: '4px 12px',
    fontSize: '13px',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#006abc',
    },
  },
}));

const ReviewNotification = ({fileCount, onReject, onPushForReview}) => {
  const classes = useStyles();

  return (
    <Box className={classes.reviewNotification}>
      <Box className={classes.reviewLeft}>
        <FileCopyTwoTone className={classes.reviewIcon} />
        <Typography className={classes.reviewText}>
          {fileCount} files changed.
        </Typography>
      </Box>
      <Box className={classes.reviewActions}>
        <Button className={classes.rejectButton} onClick={onReject}>
          Reject
        </Button>
        <Button className={classes.acceptButton} onClick={onPushForReview}>
          Push for Review
        </Button>
      </Box>
    </Box>
  );
};

export default ReviewNotification;
