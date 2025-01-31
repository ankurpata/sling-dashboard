import React, {useEffect, useState, useRef} from 'react';
import {
  Box,
  Typography,
  IconButton,
  ListItem,
  TextField,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import AttachFile from '@material-ui/icons/AttachFile';
import Send from '@material-ui/icons/Send';
import CodeUtils from '../utils';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import {getDummyFileChanges} from '../utils/fileChanges';
import {
  Tabs,
  Tab,
  List,
  ListItemText,
  Divider,
  CircularProgress,
  Button,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
} from '@material-ui/core';
import PreviewLayout from './PreviewLayout';
import {useStyles as useSharedStyles} from '../styles';
import {ALLOWED_LIBRARIES} from '../config';
import clsx from 'clsx';
import {OpenInNew, Refresh} from '@material-ui/icons';
import {useProject} from '../context/ProjectContext';
import CodeDiffViewer from './CodeDiffViewer';
import {
  initializeSocket,
  disconnectSocket,
  emitMessage,
  subscribeToEvent,
} from '../services/socketService';

// Import CodeUtils from index.js

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    height: '100%',
    backgroundColor: '#1a1a1a',
  },
  canvas: {
    display: 'flex',
    height: '100%',
    minHeight: '600px',
    gap: theme.spacing(3),
    padding: theme.spacing(3),
  },
  progress: {
    flex: '0 0 25%',
    height: '100%',
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
    flexDirection: 'column',
    backgroundColor: '#262626',
    borderRadius: '15px',
    border: '1px solid #404040',
  },
  appBar: {
    borderBottom: 'none',
    position: 'relative',
    backgroundColor: '#262626',
  },
  progressHeader: {
    padding: theme.spacing(0.5),
    backgroundColor: '#262626',
    borderTopLeftRadius: '15px',
    borderTopRightRadius: '15px',
    borderBottom: '1px solid #404040',
  },
  tabContainer: {
    display: 'flex',
    backgroundColor: '#262626',
    padding: '2px',
    borderRadius: '15px',
    border: '1px solid #404040',
  },
  tab: {
    flex: 1,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: '#9ca3af',
    cursor: 'pointer',
    borderRadius: '15px',
    transition: 'all 0.2s ease',
    '& .MuiTypography-root': {
      fontSize: '14px',
      fontWeight: 500,
    },
    '&:hover': {
      backgroundColor: '#333333',
      color: '#ffffff',
    },
  },
  activeTab: {
    backgroundColor: '#333333',
    color: '#ffffff',
  },
  progressContent: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: '#262626',
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#1a1a1a',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#404040',
      borderRadius: '2px',
      '&:hover': {
        background: '#4a4a4a',
      },
    },
  },
  chatHistory: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    padding: theme.spacing(2.5, 3),
    flex: 1,
    overflowY: 'auto',
    marginBottom: theme.spacing(2),
    scrollBehavior: 'smooth',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#1a1a1a',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#404040',
    },
  },
  chatMessage: {
    padding: theme.spacing(2),
    maxWidth: '100%',
    position: 'relative',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    color: '#ffffff',
    '&.user': {
      backgroundColor: '#333333',
      color: '#ffffff',
      alignSelf: 'flex-end',
      marginLeft: 'auto',
      textAlign: 'right',
      borderRadius: '12px',
      padding: theme.spacing(1.5, 2),
    },
    '&.ai': {
      backgroundColor: '#262626',
      color: '#ffffff',
      alignSelf: 'flex-start',
      borderRadius: '12px',
      border: '1px solid #404040',
      padding: theme.spacing(2),
      '&.typing': {
        backgroundColor: '#333333',
        border: 'none',
        '& .MuiTypography-root': {
          color: '#9ca3af',
          fontStyle: 'italic',
        },
      },
      '&.error': {
        borderColor: '#991b1b',
        backgroundColor: '#7f1d1d',
        color: '#fecaca',
      },
    },
  },
  messageWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
    '&.user': {
      justifyContent: 'flex-end',
      maxWidth: '50%',
      width: 'auto',
      alignSelf: 'flex-end',
    },
  },
  messageContent: {
    wordBreak: 'break-word',
    '& .MuiTypography-body1': {
      fontSize: '0.95rem',
      lineHeight: 1.6,
      color: '#1a1a1a',
    },
  },
  inputContainer: {
    marginTop: 'auto',
    padding: theme.spacing(2),
    borderTop: '1px solid #404040',
    position: 'relative',
    backgroundColor: '#262626',
  },
  input: {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: '#333333',
      transition: 'all 0.2s ease',
      border: '1px solid #404040',
      '&:hover': {
        borderColor: '#4a4a4a',
      },
      '&.Mui-focused': {
        borderColor: '#059669',
      },
      '& textarea': {
        padding: theme.spacing(1.2, 2),
        paddingRight: theme.spacing(10),
        fontSize: '0.95rem',
        color: '#ffffff',
        '&::placeholder': {
          color: '#9ca3af',
        },
      },
    },
  },
  actionButtons: {
    position: 'absolute',
    right: theme.spacing(3),
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    gap: theme.spacing(1),
    '& .MuiIconButton-root': {
      padding: theme.spacing(1),
      transition: 'all 0.2s ease',
      color: '#9ca3af',
      '&:hover': {
        backgroundColor: '#333333',
        color: '#ffffff',
      },
    },
  },
  preview: {
    flex: '0 0 75%',
    display: 'flex',
    padding: '0',
    flexDirection: 'column',
    backgroundColor: '#262626',
    border: '1px solid #404040',
    overflow: 'hidden',
    borderRadius: '15px',
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderBottom: '1px solid #404040',
    padding: '4px 8px',
  },
  previewTabs: {
    backgroundColor: '#1a1a1a',
    minHeight: '36px',
    '& .MuiTab-root': {
      color: '#9ca3af',
      minHeight: '36px',
      textTransform: 'none',
      fontSize: '13px',
      '&.Mui-selected': {
        color: '#ffffff',
      },
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#ffffff',
      height: '2px',
    },
  },
  previewContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
    backgroundColor: '#262626',
  },
  livePreview: {
    width: '100%',
    height: '100%',
    backgroundColor: '#262626',
    '& iframe': {
      backgroundColor: '#262626',
      border: 'none',
    },
  },
  noPreview: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: '#262626',
    color: '#9ca3af',
  },
  urlBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0.5, 1),
    backgroundColor: '#1a1a1a',
    // borderBottom: '1px solid #404040',
    height: '36px',
  },
  urlText: {
    display: 'flex',
    paddingLeft: theme.spacing(2),
    alignItems: 'center',
    gap: theme.spacing(1),
    color: '#9ca3af',
    fontSize: '13px',
    '& .MuiTypography-root': {
      fontSize: '13px',
    },
  },
  urlActions: {
    display: 'flex',
    gap: theme.spacing(0.5),
    '& .MuiIconButton-root': {
      padding: 4,
      color: '#9ca3af',
      '&:hover': {
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  previewFrame: {
    width: '100%',
    height: '100%',
    border: 'none',
    backgroundColor: '#262626',
  },
  nextButton: {
    color: 'white',
    border: 'none',
    padding: '6px 16px',
    position: 'relative',
    fontSize: '1rem',
    minWidth: '120px',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
    fontWeight: 500,
    borderRadius: '10px',
    paddingRight: '5px',
    textTransform: 'none',
    backgroundColor: '#098fdc',
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '&.Mui-disabled': {
      backgroundColor: 'rgba(9, 143, 220, 0.4)',
      color: 'rgba(255, 255, 255, 0.8)',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '1rem',
      marginLeft: theme.spacing(1),
    },
    '&:hover': {
      backgroundColor: '#0076c6',
      transform: 'translateX(4px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
      '& .MuiSvgIcon-root': {
        transform: 'translateX(2px)',
      },
    },
  },
  nextButtonWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  nextInfo: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: theme.spacing(1),
    padding: theme.spacing(1, 2),
    backgroundColor: 'rgba(9, 143, 220, 0.1)',
    borderRadius: theme.spacing(1),
    fontSize: '0.875rem',
    color: '#098fdc',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '&:before': {
      content: '""',
      position: 'absolute',
      top: -6,
      right: '30%',
      width: 12,
      height: 12,
      backgroundColor: 'rgba(9, 143, 220, 0.1)',
      transform: 'rotate(45deg)',
    },
  },
  tabRoot: {
    minWidth: 'auto',
    padding: '6px 12px',
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: '0.875rem',
    '&.Mui-selected': {
      color: '#1a1a1a',
    },
  },
  tabsRoot: {
    minHeight: 'auto',
    borderBottom: `1px solid #f0f0f0`,
  },
  tabsIndicator: {
    backgroundColor: '#1a1a1a',
  },
  livePreview: {
    height: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  liveEditor: {
    fontFamily: 'monospace',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
  },
  liveError: {
    padding: theme.spacing(2),
    color: '#1a1a1a',
    backgroundColor: '#ffebee',
    borderRadius: '12px',
    marginTop: theme.spacing(2),
  },
  inputWrapper: {
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative',
  },
  messageIcon: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(2),
    '& img': {
      width: 24,
      height: 24,
      borderRadius: '50%',
    },
  },
  noPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    color: theme.palette.text.secondary,
    fontSize: '0.95rem',
    padding: theme.spacing(3),
  },
  loadingIcon: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: '#f5f5f5',
    padding: theme.spacing(0.5),
  },
  slideContainer: {
    position: 'relative',
    height: '100%',
    overflow: 'hidden',
  },
  slidePage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  confirmDialog: {
    '& .MuiDialog-paper': {
      borderRadius: '12px',
      padding: theme.spacing(2),
    },
  },
  dialogTitle: {
    '& .MuiTypography-root': {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
  },
  dialogContent: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    '& .MuiTypography-root': {
      color: theme.palette.text.secondary,
    },
  },
  dialogActions: {
    padding: theme.spacing(2),
    gap: theme.spacing(1),
  },
  stepHeader: {
    backgroundColor: '#1E1E2E',
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  stepTitle: {
    color: '#E4E4E7',
    fontWeight: 500,
  },
  stepDescription: {
    color: '#A1A1AA',
    marginTop: theme.spacing(1),
  },
  activeStep: {
    color: '#64FFDA',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    minHeight: '500px',
  },
  heartLogo: {
    marginBottom: theme.spacing(6),
    animation: '$pulse 2s infinite',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
  },
  processingTitle: {
    fontSize: '1.75rem',
    fontWeight: 500,
    marginBottom: theme.spacing(8),
    color: '#1A1A1A',
  },
  processingSteps: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    height: '40px',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '400px',
  },
  processingStep: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    fontSize: '1rem',
    color: '#666',
    fontWeight: 400,
    position: 'absolute',
    transition: 'all 0.5s ease-in-out',
    width: '100%',
    textAlign: 'center',
    justifyContent: 'center',
  },
  activeStep: {
    transform: 'translateY(0)',
    opacity: 1,
  },
  inactiveStep: {
    transform: 'translateY(100%)',
    opacity: 0.3,
  },
  stepIcon: {
    fontSize: '1.25rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 0.8,
    },
    '50%': {
      transform: 'scale(1.1)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 0.8,
    },
  },
  publishButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#18181b',
    color: '#fff',
    borderRadius: '8px',
    padding: '6px 16px',
    fontSize: '14px',
    textTransform: 'none',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: '#27272a',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '18px',
      marginRight: theme.spacing(1),
    },
  },
}));

// CanvasLayout component
const CanvasLayout = ({
  sessionId,
  initialChatHistory = [],
  conversationId,
  session,
}) => {
  const classes = useStyles();
  const {currentProject} = useProject();
  const [chatHistories, setChatHistories] = useState({});
  const [promptInput, setPromptInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentView, setCurrentView] = useState('editor');
  const [fileChanges, setFileChanges] = useState([]);
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [activeTabState, setActiveTabState] = useState('chat');
  const [previewTab, setPreviewTab] = useState('preview');

  // Helper function to scroll to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
      });
    }
  };

  // Initialize chat history from props
  useEffect(() => {
    if (sessionId && initialChatHistory.length > 0) {
      setChatHistories((prev) => ({
        ...prev,
        [sessionId]: initialChatHistory,
      }));
    }
  }, [sessionId, initialChatHistory]);

  // Scroll to bottom when chat history changes or component mounts
  useEffect(() => {
    scrollToBottom();
  }, [chatHistories, sessionId]);

  // Initialize socket connection
  useEffect(() => {
    console.log('CanvasLayout mounted with sessionId:', sessionId);

    if (!sessionId) {
      console.warn('No sessionId provided, skipping socket initialization');
      return;
    }

    try {
      console.log('Initializing socket connection...');
      const socketInstance = initializeSocket(sessionId);

      // Wait for socket to be connected before subscribing to events
      const setupSocketEvents = () => {
        console.log('Setting up socket event listeners...');

        // Debug: Log all incoming socket events
        const unsubscribeDebug = subscribeToEvent('*', (event) => {
          console.log('Socket event received:', event);
        });

        const unsubscribeProgress = subscribeToEvent(
          'analyze-query-progress',
          (data) => {
            console.log('Progress update received:', data);
            handleProgressUpdate(data);
          },
        );

        const unsubscribeSuccess = subscribeToEvent(
          'analyze-query-success',
          (data) => {
            console.log('Success update received:', data);
            handleSuccessUpdate(data);
          },
        );

        const unsubscribeComplete = subscribeToEvent(
          'analyze-query-complete',
          (data) => {
            console.log('Analysis Completd:', data);
            handleCompleteUpdate(data);
          },
        );

        const unsubscribeError = subscribeToEvent(
          'analyze-query-error',
          (error) => {
            console.log('Analysis error received:', error);
            handleAnalysisError(error);
          },
        );

        const unsubscribeFileChanges = subscribeToEvent(
          'file-changes',
          (data) => {
            console.log('File changes event received:', data);
            handleFileChanges(data);
          },
        );

        return () => {
          unsubscribeDebug();
          unsubscribeProgress();
          unsubscribeComplete();
          unsubscribeSuccess();
          unsubscribeError();
          unsubscribeFileChanges();
        };
      };

      let cleanup = null;
      const connectHandler = () => {
        console.log('Socket connected, setting up events');
        cleanup = setupSocketEvents();
      };

      socketInstance.on('connect', connectHandler);
      if (socketInstance.connected) {
        console.log('Socket already connected, setting up events immediately');
        cleanup = setupSocketEvents();
      }

      // Send initial prompt through socket if available and it's from user
      if (currentProject?._id && initialChatHistory.length > 0) {
        const lastMessage = initialChatHistory[initialChatHistory.length - 1];
        const isLastMessageFromUser = lastMessage.role === 'user';

        if (isLastMessageFromUser) {
          console.log(
            'Sending initial prompt through socket:',
            lastMessage.message,
          );
          emitMessage('analyze-query', {
            projectId: currentProject._id,
            sessionId,
            conversationId,
            query: lastMessage.message,
            newConversation: true,
          });
        } else {
          console.log(
            'Skipping initial analyze-query as last message was not from user',
          );
        }
      }

      // Cleanup function
      return () => {
        console.log('Cleaning up socket connections...');
        if (cleanup) cleanup();
        socketInstance.off('connect', connectHandler);
        disconnectSocket();
      };
    } catch (error) {
      console.error('Error in socket setup:', error);
    }
  }, [sessionId, currentProject?._id]);

  const handleSendMessage = async (newPrompt) => {
    if (!newPrompt.trim()) return;

    setIsTyping(true);

    // Update chat history with new user message
    setChatHistories((prev) => ({
      ...prev,
      [sessionId]: [
        ...(prev[sessionId] || []),
        {
          role: 'user',
          message: newPrompt,
          timestamp: new Date().toISOString(),
        },
      ],
    }));

    // Emit message through socket
    emitMessage('analyze-query', {
      conversationId,
      projectId: currentProject._id,
      sessionId,
      query: newPrompt,
    });
    setPromptInput('');
    setTimeout(scrollToBottom, 100);
  };

  const handleProgressUpdate = (data) => {
    setChatHistories((prev) => ({
      ...prev,
      [sessionId]: [
        ...(prev[sessionId] || []),
        {
          role: 'progress',
          message: data.message,
          progress: data.progress,
          timestamp: new Date().toISOString(),
        },
      ],
    }));
    setTimeout(scrollToBottom, 100);
  };

  const handleSuccessUpdate = (data) => {
    setChatHistories((prev) => ({
      ...prev,
      [sessionId]: [
        ...(prev[sessionId] || []),
        {
          role: 'success',
          message: data.message,
          summary: data.summary,
          fileChanges: data.fileChanges,
          timestamp: new Date().toISOString(),
        },
      ],
    }));
    setIsTyping(false);
    setTimeout(scrollToBottom, 100);
  };

  const handleCompleteUpdate = (data) => {
    setChatHistories((prev) => ({
      ...prev,
      [sessionId]: [
        ...(prev[sessionId] || []),
        {
          role: 'assistant',
          message: data.message,
          changes: data.changes,
          timestamp: new Date().toISOString(),
        },
      ],
    }));
    setIsTyping(false);
    setTimeout(scrollToBottom, 100);
  };

  const handleAnalysisError = (error) => {
    setChatHistories((prev) => ({
      ...prev,
      [sessionId]: [
        ...(prev[sessionId] || []),
        {
          role: 'system',
          message: `Error: ${error.message}`,
          timestamp: new Date().toISOString(),
        },
      ],
    }));
    setIsTyping(false);
    setTimeout(scrollToBottom, 100);
  };

  const handleFileChanges = (data) => {
    console.log('Received file changes:', data);
    if (data.changes && Array.isArray(data.changes)) {
      setFileChanges(data.changes);
    }
  };

  const renderChatMessage = (message, index) => {
    // Show favicon only for first response after user message
    const showFavicon = () => {
      if (message.role === 'progress' && index > 0) {
        const messages = chatHistories[sessionId] || [];
        const prevMessage = messages[index - 1];
        return prevMessage.role === 'user';
      }
      return false;
    };

    return (
      <Box
        key={`${sessionId}-${index}`}
        mb={2}
        display='flex'
        alignItems='flex-start'
        className={`${classes.messageWrapper} ${message.role}`}>
        {showFavicon() && (
          <Box className={classes.messageIcon}>
            <img src='/images/favicon.ico' alt='AI' />
          </Box>
        )}
        <ListItem className={`${classes.chatMessage} ${message.role}`}>
          <Typography>{message.message}</Typography>
        </ListItem>
      </Box>
    );
  };

  const handlePreviewTabChange = (event, value) => {
    setPreviewTab(value);
  };

  const handlePublish = () => {
    // Add publish logic here
    console.log('Publishing...');
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.canvas}>
        <Box className={classes.progress}>
          <Box className={classes.progressHeader}>
            <Box className={classes.tabContainer}>
              <Box
                className={`${classes.tab} ${
                  activeTabState === 'chat' ? classes.activeTab : ''
                }`}
                onClick={() => setActiveTabState('chat')}>
                <Typography variant='body1'>Chat</Typography>
              </Box>
              <Box
                className={`${classes.tab} ${
                  activeTabState === 'history' ? classes.activeTab : ''
                }`}
                onClick={() => setActiveTabState('history')}>
                <Typography variant='body1'>History</Typography>
              </Box>
            </Box>
          </Box>
          <Box className={classes.progressContent}>
            <Box className={classes.chatHistory} ref={chatContainerRef}>
              {chatHistories[sessionId]?.map((message, index) =>
                renderChatMessage(message, index),
              )}
              {isTyping && (
                <Box
                  key={`typing-${sessionId}`}
                  mb={2}
                  display='flex'
                  alignItems='flex-start'
                  className={`${classes.messageWrapper} ai`}>
                  <Box className={classes.messageIcon}>
                    <img src='/images/favicon.ico' alt='AI' />
                  </Box>
                  <ListItem className={`${classes.chatMessage} ai typing`}>
                    <Typography>Thinking...</Typography>
                  </ListItem>
                </Box>
              )}
              <div ref={messagesEndRef} />{' '}
              {/* This keeps scrolling to bottom */}
            </Box>
          </Box>

          <Box className={classes.inputContainer}>
            <TextField
              className={classes.input}
              variant='outlined'
              multiline
              rows={1}
              placeholder='Ask a follow up...'
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyPress={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  handleSendMessage(promptInput);
                }
              }}
              disabled={isTyping}
              InputProps={{
                endAdornment: (
                  <Box className={classes.actionButtons}>
                    <IconButton disabled={isTyping}>
                      <AttachFile />
                    </IconButton>
                    <IconButton
                      onClick={() => handleSendMessage(promptInput)}
                      disabled={isTyping || !promptInput.trim()}>
                      <Send />
                    </IconButton>
                  </Box>
                ),
              }}
            />
          </Box>
        </Box>
        <Box className={classes.preview} position='relative'>
          <Box className={classes.slideContainer}>
            <Slide
              direction='right'
              in={currentView === 'editor'}
              mountOnEnter
              unmountOnExit>
              <Box className={classes.slidePage}>
                <Box className={classes.urlBar}>
                  <Box className={classes.urlText}>
                    <Typography className={classes.urlText}>
                      {currentProject?.development?.previewUrl ||
                        'No preview URL available'}
                    </Typography>
                  </Box>
                  <Box className={classes.urlActions}>
                    <IconButton
                      size='small'
                      onClick={() =>
                        window.open('http://localhost:3674', '_blank')
                      }>
                      <OpenInNew fontSize='small' />
                    </IconButton>
                    <IconButton size='small'>
                      <Refresh fontSize='small' />
                    </IconButton>
                  </Box>
                </Box>

                <Box className={classes.previewHeader}>
                  <Tabs
                    value={previewTab}
                    onChange={(e, newValue) => setPreviewTab(newValue)}
                    className={classes.previewTabs}>
                    <Tab label='Preview' value='preview' />
                    <Tab label='Code' value='code' />
                  </Tabs>
                </Box>

                <Box
                  className={classes.previewContent}
                  style={{
                    backgroundColor: '#262626',
                    borderRadius: '12px',
                  }}>
                  {previewTab === 'preview' ? (
                    currentProject?.development?.previewUrl ||
                    'http://localhost:3674' ? (
                      <Box className={classes.livePreview}>
                        <iframe
                          src={currentProject?.development?.previewUrl || 'http://localhost:3674'}
                          className={classes.previewFrame}
                          title='Preview'
                          sandbox='allow-same-origin allow-scripts allow-popups allow-forms'
                        />
                      </Box>
                    ) : (
                      <Typography
                        variant='body2'
                        color='textSecondary'
                        style={{padding: 16}}>
                        No preview URL available
                      </Typography>
                    )
                  ) : (
                    <>
                      <CodeDiffViewer fileChanges={fileChanges} />
                    </>
                  )}
                </Box>
              </Box>
            </Slide>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CanvasLayout;
