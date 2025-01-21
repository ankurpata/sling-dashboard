import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Container, Grid, Typography, TextField, Button, img } from '@material-ui/core';
import Header from './components/Header';
import CanvasLayout from './components/CanvasLayout';
import ProcessingView from './components/ProcessingView';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)',
    backgroundColor: '#0A0A0B',
    color: '#fff',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 200px)',
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  heartLogo: {
    marginBottom: theme.spacing(4),
  },
  newFeature: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: theme.spacing(0.5, 2),
    marginBottom: theme.spacing(3),
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '1.25rem',
    marginBottom: theme.spacing(4),
    maxWidth: 600,
  },
  searchInput: {
    width: '100%',
    maxWidth: 700,
    marginBottom: theme.spacing(4),
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: 8,
      height: 56,
      '& fieldset': {
        borderColor: 'rgba(255,255,255,0.1)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255,255,255,0.2)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#4ECDC4',
      },
    },
    '& .MuiOutlinedInput-input': {
      color: '#fff',
      fontSize: '1rem',
      padding: theme.spacing(2),
      '&::placeholder': {
        color: 'rgba(255,255,255,0.5)',
      },
    },
  },
  templates: {
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(6),
    '& button': {
      backgroundColor: 'rgba(255,255,255,0.05)',
      color: '#fff',
      borderRadius: 20,
      padding: theme.spacing(0.75, 2),
      fontSize: 14,
      textTransform: 'none',
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.1)',
      },
    },
  },
  projectTabs: {
    display: 'flex',
    gap: theme.spacing(4),
    marginBottom: theme.spacing(4),
    '& button': {
      color: 'rgba(255,255,255,0.7)',
      padding: theme.spacing(1, 0),
      minWidth: 'auto',
      textTransform: 'none',
      '&:hover': {
        color: '#fff',
        backgroundColor: 'transparent',
      },
    },
  },
}));

const AIBuilder = () => {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);

  return (
    <Box className={classes.root}>
      <Header />
      
      <Box className={classes.main}>
        <Box className={classes.heartLogo}>
          <img src="/images/logo.png" alt="Logo" style={{ height: 80 }} />
        </Box>
        
        {/* <Box className={classes.newFeature}>
          New: Generate apps from a URL
        </Box> */}

        <Typography variant="h1" className={classes.title}>
          Idea to app in seconds.
        </Typography>
        
        <Typography variant="h2" className={classes.subtitle}>
          Lovable is your superhuman full stack engineer.
        </Typography>

        <TextField
          className={classes.searchInput}
          variant="outlined"
          placeholder="Ask Lovable to create a landing page for my..."
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <Box className={classes.templates}>
          <Button>Weather dashboard</Button>
          <Button>Startup dashboard</Button>
          <Button>Note taking app</Button>
          <Button>Hacker News app</Button>
        </Box>

        <Box className={classes.projectTabs}>
          <Button>My Projects</Button>
          <Button>Latest</Button>
          <Button>Featured</Button>
          <Button>Templates</Button>
        </Box>
      </Box>

      {isProcessing && !showCanvas && (
        <ProcessingView />
      )}

      {showCanvas && (
        <CanvasLayout />
      )}
    </Box>
  );
};

export default AIBuilder;
