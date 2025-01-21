import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(12px)',
    borderRadius: 16,
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(3),
    maxWidth: 400,
    width: '90%',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    zIndex: 1000,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    width: '100%',
    opacity: 0,
    transform: 'translateY(10px)',
    animation: '$fadeIn 0.5s ease-out forwards',
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#4ECDC4',
    borderRadius: '50%',
  },
  text: {
    color: '#111827',
    fontSize: '1rem',
    fontWeight: 500,
  },
}));

const ProcessingView = ({ messages = [] }) => {
  const classes = useStyles();
  const [visibleMessages, setVisibleMessages] = useState([]);

  useEffect(() => {
    let currentIndex = 0;
    
    const showNextMessage = () => {
      if (currentIndex < messages.length) {
        setVisibleMessages(prev => [...prev, messages[currentIndex]]);
        currentIndex++;
      }
    };

    // Show first message immediately
    showNextMessage();

    // Show subsequent messages with delay
    const interval = setInterval(() => {
      showNextMessage();
    }, 1000);

    return () => clearInterval(interval);
  }, [messages]);

  return (
    <Box className={classes.root}>
      {visibleMessages.map((message, index) => (
        <Box key={index} className={classes.message} style={{ animationDelay: `${index * 0.2}s` }}>
          <Box className={classes.dot} />
          <Typography className={classes.text}>{message}</Typography>
        </Box>
      ))}
      <CircularProgress size={24} style={{ color: '#4ECDC4' }} />
    </Box>
  );
};

export default ProcessingView;
