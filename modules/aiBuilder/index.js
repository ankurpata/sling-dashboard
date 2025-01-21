import React, {useState, useEffect, useRef} from 'react';
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
import CodeUtils from './utils';
import { ALLOWED_LIBRARIES } from './config';
import GitHubIcon from '@material-ui/icons/GitHub';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      margin: 0,
      padding: 0,
      minHeight: '100vh',
    },
  },
  root: {
    minHeight: '100vh',
    position: 'relative',
    color: '#111827',
    display: 'flex',
    flexDirection: 'column',
    transition: 'background 0.3s ease-in-out',
    background: (props) => !props.showCanvas ? 
      'radial-gradient(circle at center, #ffffff 0%, #f0f9ff 35%, #e0f2fe 50%, #f0f9ff 65%, #ffffff 100%)' : 
      '#ffffff',
    '&::before': (props) => !props.showCanvas ? {
      content: '""',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 1,
      transition: 'opacity 0.3s ease-in-out',
      background:
        'radial-gradient(circle at center, rgba(255,255,255,0) 0%, rgba(240,249,255,0.15) 35%, rgba(224,242,254,0.15) 50%, rgba(240,249,255,0.15) 65%, rgba(255,255,255,0) 100%)',
      pointerEvents: 'none',
      zIndex: 0,
    } : {
      opacity: 0,
      content: '""',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
    },
  },
  main: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 'calc(100vh - 64px)',
    textAlign: 'center',
    padding: theme.spacing(20, 4),
    position: 'relative',
  },
  heartLogo: {
    marginBottom: theme.spacing(8),
    zIndex: 1,
    '& img': {
      height: 100,
    },
  },
  title: {
    fontSize: '5.6rem',
    fontWeight: 300,
    marginBottom: theme.spacing(3),
    letterSpacing: '-0.02em',
    lineHeight: 1,
    minHeight: '1.2em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#111827',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: '0.875rem',
    marginBottom: theme.spacing(8),
    maxWidth: 600,
    opacity: 0.9,
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
      backgroundColor: 'white',
      borderRadius: 12,
      height: 64,
      '& fieldset': {
        borderColor: '#E5E7EB',
      },
      '&:hover fieldset': {
        borderColor: '#D1D5DB',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#4ECDC4',
      },
    },
    '& .MuiOutlinedInput-input': {
      color: '#111827',
      fontSize: '1.1rem',
      '&::placeholder': {
        color: '#6B7280',
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
    marginTop: theme.spacing(4),
    '& button': {
      backgroundColor: 'rgba(255,255,255,0.9)',
      color: '#111827',
      borderRadius: 24,
      padding: theme.spacing(1.5, 3),
      fontSize: '0.95rem',
      textTransform: 'none',
      border: '1px solid rgba(0,0,0,0.1)',
      backdropFilter: 'blur(8px)',
      fontWeight: 500,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,1)',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
    },
  },
  projectTabs: {
    display: 'flex',
    gap: theme.spacing(4),
    marginBottom: theme.spacing(4),
    '& button': {
      color: '#6B7280',
      padding: theme.spacing(1, 0),
      minWidth: 'auto',
      textTransform: 'none',
      fontSize: '0.95rem',
      '&:hover': {
        color: '#111827',
        backgroundColor: 'transparent',
      },
    },
  },
  inputContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
  },
  repoButton: {
    color: "#fff",
    height: "62px",
    marginTop: "9px",
    padding: "0px 12px",
    fontSize: "1rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    fontWeight: 500,
    whiteSpace: "nowrap",
    borderRadius: "8px",
    textTransform: "none",
    backgroundColor: "#0b111e",
    border: "none",
    transition: "all 0.2s ease-in-out",
    '&:hover': {
      backgroundColor: "#1a1f2e",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
    '& .MuiSvgIcon-root': {
      marginRight: theme.spacing(1),
      fontSize: '1.2rem',
    },
  },
}));

const AIBuilder = () => {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [titleIndex, setTitleIndex] = useState(0);
  const [searchId, setSearchId] = useState('');
  const [initialResponse, setInitialResponse] = useState('');
  const classes = useStyles({ showCanvas });
  const [processingMessages, setProcessingMessages] = useState([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeScope, setCodeScope] = useState({});
  const [activeTab, setActiveTab] = useState('preview');
  const inputRef = useRef(null);
  const processingTimeoutRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && !showCanvas) {
      inputRef.current.focus();
    }
  }, [showCanvas]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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

  const handleInputSubmit = async (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      setIsProcessing(true);
      setProcessingMessages(['Analyzing your request...']);
      setShowCanvas(true); // Show canvas immediately

      // Set a timeout for processing
      processingTimeoutRef.current = setTimeout(() => {
        setProcessingMessages((prev) => [
          ...prev,
          'This is taking longer than expected...',
        ]);
      }, 10000);

      try {
        // Show initial processing message
        await new Promise((resolve) => setTimeout(resolve, 800));
        setProcessingMessages((prev) => [
          ...prev,
          'Preparing canvas layout...',
        ]);

        // Make API call
        const response = await fetch(
          'http://localhost:5001/api/ai/generate-page',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: inputValue,
              mock: false,
              constraints: {
                componentName: true,
                useArrowFunction: true,
                useMaterialUI: true,
                noStyleImports: true,
                singleComponent: true,
                separateDependencies: true,
                allowedLibraries: ALLOWED_LIBRARIES,
              },
            }),
          },
        );

        // Clear timeout since we got a response
        if (processingTimeoutRef.current) {
          clearTimeout(processingTimeoutRef.current);
        }

        setProcessingMessages((prev) => [
          ...prev,
          'Setting up your workspace...',
        ]);

        const data = await response.json();

        // Update states with response data
        setSearchId(data.conversationId);
        setInitialResponse(data.summary);

        // Clean and transform the code
        const cleaned = CodeUtils.cleanCode(data);
        const transformed = CodeUtils.transformCode(cleaned.code);
        setGeneratedCode(transformed);
        setCodeScope(cleaned.scope);
        setIsProcessing(false);
      } catch (error) {
        console.error('Error generating page:', error);
        setProcessingMessages((prev) => [
          ...prev,
          'An error occurred. Please try again.',
        ]);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setShowCanvas(false); // Return to input on error
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <Box className={classes.root}>
      <Header />

      {!showCanvas && (
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
                zIndex: 23,
                color: '#0b111e',
                margin: 0,
              }}
              key={titleIndex}>
              {titles[titleIndex].title}
            </Typography>
          </Box>

          <Typography
            variant='h2'
            className={classes.subtitle}
            style={{
              fontSize: '1rem',
              fontWeight: 500,
              lineHeight: 1,
              margin: 0,
            }}>
            {titles[titleIndex].subtitle}
          </Typography>

          <Box className={classes.inputContainer}>
            <Button 
              variant="outlined" 
              className={classes.repoButton}
              startIcon={<GitHubIcon />}
            >
              Connect your Repo
            </Button>

            <TextField
              className={classes.searchInput}
              variant='outlined'
              placeholder='Create and add a new report to dashboard which ...'
              fullWidth
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputSubmit}
              inputRef={inputRef}
            />
          </Box>

          <Box className={classes.templates}>
            <Button onClick={() => setInputValue("Create a crypto portfolio tracker")}>
              Crypto portfolio tracker ↑
            </Button>
            <Button onClick={() => setInputValue("Create a personal website")}>
              Personal website ↑
            </Button>
            <Button onClick={() => setInputValue("Create an AI image generator")}>
              AI image generator ↑
            </Button>
            <Button onClick={() => setInputValue("Create a weather dashboard")}>
              Weather dashboard ↑
            </Button>
          </Box>
        </Box>
      )}

      {isProcessing && !showCanvas && (
        <ProcessingView messages={processingMessages} />
      )}

      {showCanvas && (
        <CanvasLayout
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          generatedCode={generatedCode}
          codeScope={codeScope}
          inputValue={inputValue}
          isProcessing={isProcessing}
          searchId={searchId}
          initialResponse={initialResponse}
          setGeneratedCode={setGeneratedCode}
          setCodeScope={setCodeScope}
          setIsProcessing={setIsProcessing}
        />
      )}
    </Box>
  );
};

export default AIBuilder;
