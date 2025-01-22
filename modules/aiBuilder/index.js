import React, {useState, useEffect, useRef} from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
} from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import axios from 'axios';
import Header from './components/Header';
import CanvasLayout from './components/CanvasLayout';
import ProcessingView from './components/ProcessingView';
import GitHubRepoDialog from './components/GitHubRepoDialog';
import ConfirmationDialog from './components/ConfirmationDialog';
import CodeUtils from './utils';
import {ALLOWED_LIBRARIES} from './config';
import {useStyles} from './styles';
import {fetchRepositories} from './services/repositoryService';

const AIBuilder = () => {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRepoDialog, setShowRepoDialog] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [repoEnvVars, setRepoEnvVars] = useState({});
  const [loading, setLoading] = useState(false);
  const [titleIndex, setTitleIndex] = useState(0);
  const [searchId, setSearchId] = useState('');
  const [initialResponse, setInitialResponse] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeScope, setCodeScope] = useState({});
  const [activeTab, setActiveTab] = useState('preview');
  const [userId, setUserId] = useState(null);
  const classes = useStyles({ showCanvas });
  const [processingMessages, setProcessingMessages] = useState([]);
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isAuthenticated = params.get('authenticated');
    const userIdParam = params.get('userId');
    
    if (isAuthenticated && userIdParam) {
      setUserId(userIdParam);
      handleFetchRepositories(userIdParam);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (repositories.length > 0) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }, [repositories]);

  useEffect(() => {
    // Load selected repository from localStorage on mount
    const savedRepo = localStorage.getItem('selectedRepository');
    if (savedRepo) {
      try {
        setSelectedRepo(JSON.parse(savedRepo));
      } catch (error) {
        console.error('Error loading saved repository:', error);
      }
    }
  }, []);

  const handleFetchRepositories = async (userId) => {
    setLoading(true);
    try {
      const data = await fetchRepositories(userId);
      setRepositories(data);
      setShowRepoDialog(true);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
    localStorage.setItem('selectedRepository', JSON.stringify(repo));
    setShowRepoDialog(false);
    // Force re-render of components that depend on selectedRepo
    setRepositories(prev => [...prev]);
  };

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
      setShowConfirm(true);
    }
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsProcessing(true);
    setProcessingMessages(['Analyzing your request...']);
    setShowCanvas(true);

    processingTimeoutRef.current = setTimeout(() => {
      setProcessingMessages((prev) => [
        ...prev,
        'This is taking longer than expected...',
      ]);
    }, 10000);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProcessingMessages((prev) => [
        ...prev,
        'Preparing canvas layout...',
      ]);

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

      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }

      setProcessingMessages((prev) => [
        ...prev,
        'Setting up your workspace...',
      ]);

      const data = await response.json();
      setSearchId(data.conversationId);
      setInitialResponse(data.summary);
      const cleaned = CodeUtils.cleanCode(data);
      const transformed = CodeUtils.transformCode(cleaned.code);
      setGeneratedCode(transformed);
      setCodeScope(cleaned.scope);
    } catch (error) {
      console.error('Error generating page:', error);
      setProcessingMessages((prev) => [
        ...prev,
        'An error occurred. Please try again.',
      ]);
      setShowCanvas(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGitHubConnect = () => {
    const savedRepos = localStorage.getItem('repositories');
    if (savedRepos) {
      setShowRepoDialog(true);
    } else {
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=repo`;
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
              onClick={handleGitHubConnect}
            >
              {selectedRepo ? selectedRepo.name : 'Connect your Repo'}
            </Button>
            {selectedRepo && (
              <Typography variant="caption" color="textSecondary" style={{ marginLeft: 8 }}>
                {Object.keys(repoEnvVars).length} environment variables configured
              </Typography>
            )}
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
      <ConfirmationDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
      />
      <GitHubRepoDialog
        open={showRepoDialog}
        onClose={() => setShowRepoDialog(false)}
        onSelect={handleRepoSelect}
        userId={userId}
        initialRepo={selectedRepo}
      />
    </Box>
  );
};

export default AIBuilder;
