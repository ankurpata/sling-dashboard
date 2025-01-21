import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
} from '@material-ui/core';
import Header from './components/Header';
import CanvasLayout from './components/CanvasLayout';
import ProcessingView from './components/ProcessingView';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    background:
      'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)',
    backgroundColor: '#0A0A0B',
    color: '#fff',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 154px)',
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  heartLogo: {
    marginBottom: theme.spacing(8),
    '& img': {
      height: 100,
    },
  },
  title: {
    fontSize: '5.6rem',
    fontWeight: 300,
    marginBottom: theme.spacing(1),
    letterSpacing: '-0.02em',
    lineHeight: 1,
    minHeight: '1.2em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.9)',
  },
  subtitle: {
    color: 'rgb(156 163 175/var(--tw-text-opacity))',
    fontSize: '0.875rem',
    marginBottom: theme.spacing(6),
    maxWidth: 600,
    opacity: 0.8,
  },
  fadeIn: {
    animation: '$fadeIn 0.5s ease-in',
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
  searchInput: {
    width: '100%',
    maxWidth: 700,
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(6),
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: 12,
      height: 64,
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
      fontSize: '1.1rem',
      padding: theme.spacing(3),
      '&::placeholder': {
        color: 'rgba(255,255,255,0.5)',
        opacity: 1,
      },
    },
  },
  templates: {
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(8),
    flexWrap: 'wrap',
    justifyContent: 'center',
    '& button': {
      backgroundColor: 'rgba(255,255,255,0.05)',
      color: '#fff',
      borderRadius: 24,
      padding: theme.spacing(1, 3),
      fontSize: '0.95rem',
      textTransform: 'none',
      border: '1px solid rgba(255,255,255,0.1)',
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: 'rgba(255,255,255,0.2)',
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
      fontSize: '0.95rem',
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
  const [titleIndex, setTitleIndex] = useState(0);

  const titles = [
    {
      title: 'Lovable.dev for your codebase',
      subtitle:
        'AI-powered code assistant that understands your entire codebase',
    },
    {
      title: 'Junior engineer for your company',
      subtitle:
        'Autonomous AI that learns and adapts to your development practices',
    },
    {
      title: 'Let your product team create PRs',
      subtitle:
        'Empower non-technical teams to contribute code changes directly',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box className={classes.root}>
      <Header />

      <Box className={classes.main}>
        <Box className={classes.heartLogo}>
          <img src='/images/logo.png' alt='Logo' />
        </Box>

        <Box className={classes.title}>
          <Typography
            component='h1'
            style={{
              fontSize: '3.6rem',
              fontWeight: 600,
              lineHeight: 1,
              margin: 0,
            }}
            className={classes.fadeIn}
            key={titleIndex}>
            {titles[titleIndex].title}
          </Typography>
        </Box>

        <Typography
          variant='h2'
          className={classes.subtitle}
          style={{
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: 1,
            margin: 0,
          }}>
          {titles[titleIndex].subtitle}
        </Typography>

        <TextField
          className={classes.searchInput}
          variant='outlined'
          placeholder='Ask Lovable to create a portfolio website for my...'
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <Box className={classes.templates}>
          <Button>Startup dashboard ↑</Button>
          <Button>Confetti animation ↑</Button>
          <Button>Note taking app ↑</Button>
          <Button>Personal website ↑</Button>
        </Box>

        <Box className={classes.projectTabs}>
          <Button>My Projects</Button>
          <Button>Latest</Button>
          <Button>Featured</Button>
          <Button>Templates</Button>
        </Box>
      </Box>

      {isProcessing && !showCanvas && <ProcessingView />}

      {showCanvas && <CanvasLayout />}
    </Box>
  );
};

export default AIBuilder;
