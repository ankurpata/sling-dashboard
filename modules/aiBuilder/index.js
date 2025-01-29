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
  Tooltip,
} from '@material-ui/core';
import {useRouter} from 'next/router';
import GitHubIcon from '@material-ui/icons/GitHub';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import EditIcon from '@material-ui/icons/Edit';
import PublishIcon from '@material-ui/icons/Publish'; // Import PublishIcon
import axios from 'axios';
import Header from './components/Header';
import CanvasLayout from './components/CanvasLayout';
import ProcessingView from './components/ProcessingView';
import GitHubRepoDialog from './components/GitHubRepoDialog';
import ConfirmationDialog from './components/ConfirmationDialog';
import AuthDialog from './components/AuthDialog';
import CodeUtils from './utils';
import {ALLOWED_LIBRARIES} from './config';
import {useStyles} from './styles';
import {fetchRepositories} from './services/repositoryService';
import {createSession} from './services/sessionService';
import {UserProvider} from './context/UserContext';
import {useUser} from './context/UserContext';
import {useProject} from './context/ProjectContext';

const AIBuilder = () => {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showRepoDialog, setShowRepoDialog] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [titleIndex, setTitleIndex] = useState(0);
  const [searchId, setSearchId] = useState('');
  const [initialResponse, setInitialResponse] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeScope, setCodeScope] = useState({});
  const [activeTab, setActiveTab] = useState('preview');
  const [userId, setUserId] = useState();
  const {currentProject, setProject} = useProject();
  const {user} = useUser();
  const classes = useStyles({showCanvas});
  const [processingMessages, setProcessingMessages] = useState([]);
  const inputRef = useRef(null);
  const processingTimeoutRef = useRef(null);
  const router = useRouter();
  console.log(currentProject, 'currentProject');
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

    // Case 1: Redirected from auth with userId in params
    if (isAuthenticated && userIdParam) {
      setUserId(userIdParam);
      localStorage.setItem('userId', userIdParam);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    // Case 2: Check for existing userId in localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (repositories.length > 0) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }, [repositories]);

  const loadRepositories = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const data = await fetchRepositories(userId);
      setRepositories(data);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepositories();
  }, [userId]);

  const handleRepoSelect = (repo) => {
    setProject(repo);
    localStorage.setItem('selectedRepository', JSON.stringify(repo));
    setShowRepoDialog(false);
    // Force re-render of components that depend on repo
    setRepositories((prev) => [...prev]);
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
      // Check if user is authenticated
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setShowAuthDialog(true);
        return;
      }
      // setShowConfirm(true);
      handleConfirm();
    }
  };

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);

      console.log('Creating session with:', {
        userId: user?.id,
        projectId: currentProject?._id,
        inputValue,
      });

      if (!user?.id || !currentProject?._id) {
        throw new Error('Missing user ID or project ID');
      }

      // Create chat session with current context
      const context = {
        currentFile: window.location.pathname,
        cursorPosition: 0,
        selectedText: '',
        activeCodeItem: '',
        openFiles: [],
      };

      const session = await createSession(user.id, currentProject._id, context);
      console.log('Session created:', session);

      console.log(
        'Redirecting to:',
        `https://baloon.dev/projects/${session.sessionId}`,
      );

      // Redirect to the project URL with encoded session ID
      window.location.href = `${window.location.origin}/project/${session.sessionId}`;
    } catch (error) {
      console.error('Error creating chat session:', error);
      setProcessingMessages([
        ...processingMessages,
        'An error occurred. Please try again.',
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGitHubConnect = () => {
    setShowRepoDialog(true);
  };

  const handleOpenRepoDialog = () => {
    setShowRepoDialog(true);
  };

  const handleCloseRepoDialog = () => {
    setShowRepoDialog(false);
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <UserProvider>
      <Box className={classes.root}>
        <Header>
          <Box className={classes.rightSection}>
            <Button
              variant='contained'
              color='primary'
              size='small'
              startIcon={<PublishIcon />}
              style={{
                marginRight: '16px',
                textTransform: 'none',
                backgroundColor: '#10B981',
                '&:hover': {
                  backgroundColor: '#059669',
                },
              }}>
              Publish
            </Button>
            <Typography variant='body2' color='textSecondary'>
              {user?.name || 'Guest'}
            </Typography>
          </Box>
        </Header>
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
                variant='outlined'
                className={classes.repoButton}
                startIcon={
                  currentProject ? (
                    <EditIcon
                      className={classes.editIcon}
                      style={{marginRight: -5, fontSize: 16}}
                    />
                  ) : (
                    <GitHubIcon />
                  )
                }
                onClick={handleGitHubConnect}>
                <Box
                  display='flex'
                  alignItems='center'
                  position='relative'
                  width='100%'>
                  {user?.isGithubConnected && !currentProject && (
                    <Box
                      position='absolute'
                      top={-21}
                      right={-33}
                      display='flex'
                      alignItems='center'
                      sx={{
                        fontSize: '0.6rem',
                        color: '#10B981', // green-500
                        backgroundColor: 'rgba(16, 185, 129, 0.1)', // light green background
                        padding: '2px 6px',
                        borderRadius: '10px',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                      }}>
                      <Box
                        component='span'
                        sx={{
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          backgroundColor: '#10B981',
                          marginRight: 0.5,
                          display: 'inline-block',
                        }}
                      />{' '}
                      &nbsp; Connected
                    </Box>
                  )}
                  {currentProject
                    ? currentProject.name
                    : user?.isGithubConnected
                      ? 'Select Repository'
                      : 'Connect your Repo'}
                  {currentProject && (
                    <Box
                      style={{
                        padding: 5,
                        top: -24,
                        right: -40,
                        position: 'absolute',
                      }}>
                      <Tooltip
                        title={
                          currentProject?.buildSettings &&
                          currentProject?.development
                            ? 'Deployment configured with environment variables'
                            : 'No deployment configuration'
                        }
                        placement='right'>
                        <Box className={classes.deploymentStatus}>
                          {currentProject?.buildSettings &&
                          currentProject?.development ? (
                            <CheckCircleIcon
                              className={`${classes.statusIcon} ${classes.statusIconConfigured}`}
                            />
                          ) : (
                            <RadioButtonUncheckedIcon
                              className={`${classes.statusIcon} ${classes.statusIconUnconfigured}`}
                            />
                          )}
                        </Box>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
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
              <Button
                onClick={() =>
                  setInputValue('Create a crypto portfolio tracker')
                }>
                Crypto portfolio tracker ↑
              </Button>
              <Button
                onClick={() => setInputValue('Create a personal website')}>
                Personal website ↑
              </Button>
              <Button
                onClick={() => setInputValue('Create an AI image generator')}>
                AI image generator ↑
              </Button>
              <Button
                onClick={() => setInputValue('Create a weather dashboard')}>
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
        <AuthDialog
          open={showAuthDialog}
          onClose={() => setShowAuthDialog(false)}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
        />
        <GitHubRepoDialog
          open={showRepoDialog}
          onClose={handleCloseRepoDialog}
          onSelect={handleRepoSelect}
          userId={userId}
          initialRepo={currentProject}
        />
      </Box>
    </UserProvider>
  );
};

export default AIBuilder;
