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
    borderRadius: '15px',
    paddingLeft: '0',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e5e5',
    '& .MuiTypography-root': {
      color: '#000000',
    },
    '& .MuiTab-root': {
      color: '#4b5563',
      '&.Mui-selected': {
        color: '#000000',
      },
    },
  },
  urlBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e5e5e5',
    borderRadius: '15px',
    borderBottomRightRadius: '0',
    borderBottomLeftRadius: '0',
    padding: '4px 8px',
    marginBottom: theme.spacing(2),
  },
  urlText: {
    flex: 1,
    fontSize: '13px',
    color: '#6c757d',
    padding: '4px 8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  urlActions: {
    display: 'flex',
    gap: '4px',
    '& .MuiIconButton-root': {
      padding: 6,
      color: '#6c757d',
      '&:hover': {
        backgroundColor: '#e9ecef',
        color: '#212529',
      },
    },
  },
  previewTabs: {
    borderBottom: '1px solid #e5e5e5',
    '& .MuiTab-root': {
      textTransform: 'none',
      minWidth: 100,
      fontSize: '14px',
      fontWeight: 500,
    },
  },
  previewHeader: {
    marginBottom: theme.spacing(2),
  },
  headerSection: {
    marginBottom: theme.spacing(3),
    borderBottom: '1px solid #e2e8f073',
    padding: theme.spacing(3, 2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    '& h5': {
      fontWeight: 500,
    },
    '& .MuiTypography-subtitle1': {
      marginTop: theme.spacing(1),
      opacity: 0.8,
    },
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
  previewFrame: {
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
  previewContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0, // Important for flex child to respect parent height
  },
}));

// CanvasLayout component
const CanvasLayout = ({
  isProcessing,
  sessionId,
  initialResponse,
  setGeneratedCode,
  setCodeScope,
  chatHistory,
}) => {
  const classes = useStyles();
  const {currentProject} = useProject();
  const [visibleStepIndex, setVisibleStepIndex] = useState(0);
  const [chatHistories, setChatHistories] = useState({});
  const [promptInput, setPromptInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentView, setCurrentView] = useState('editor');

  const chatContainerRef = useRef(null);
  const [activeTabState, setActiveTabState] = useState('chat');
  const [previewTab, setPreviewTab] = useState('preview');

  useEffect(() => {
    // Initialize chat history from props
    if (chatHistory?.length > 0) {
      // Transform the chat history to match our UI structure
      const transformedHistory = chatHistory.map((message) => ({
        type: message.isUser ? 'user' : 'ai',
        content: message.message,
        timestamp: message.timestamp,
        changes: message.changes || [],
      }));

      setChatHistories((prev) => ({
        ...prev,
        [sessionId]: transformedHistory,
      }));
    }
  }, [chatHistory, sessionId]);

  useEffect(() => {
    // Scroll to bottom when chat updates
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistories[sessionId]]);

  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setVisibleStepIndex((prev) => (prev + 1) % processingSteps.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  const processingSteps = [
    {icon: '🔍', text: 'Analyzing your request...'},
    {icon: '💡', text: 'Brainstorming ideas...'},
    {icon: '🎨', text: 'Crafting the perfect solution...'},
    {icon: '🏗️', text: 'Building components...'},
    {icon: '✨', text: 'Adding some magic...'},
    {icon: '⚡️', text: 'Generating preview for you...'},
    {icon: '🧪', text: 'Testing the changes locally...'},
    {icon: '🎯', text: 'Fine-tuning the details...'},
  ];

  // Handle prompt submission
  const handlePromptSubmit = async () => {
    if (!promptInput.trim()) return;

    if (currentView === 'preview') {
      setChatHistories((prev) => ({
        ...prev,
        [sessionId]: [
          ...(prev[sessionId] || []),
          {
            type: 'user',
            content: promptInput,
          },
          {
            type: 'ai',
            content:
              'To make changes to the layout, please return to the "Generate UI" step.',
          },
        ],
      }));
      setPromptInput('');
      return;
    }

    const newMessage = {
      type: 'user',
      content: promptInput,
    };

    setChatHistories((prev) => ({
      ...prev,
      [sessionId]: [...(prev[sessionId] || []), newMessage],
    }));

    setPromptInput('');
    setIsTyping(true);

    try {
      // Send follow-up question to API
      const response = await fetch(
        'http://localhost:5001/api/ai/generate-page',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: promptInput,
            mock: false,
            conversationId: sessionId,
          }),
        },
      );

      const data = await response.json();

      // Process returned code same as index.js
      const cleaned = CodeUtils.cleanCode(data);
      const transformed = CodeUtils.transformCode(cleaned.code);
      setGeneratedCode(transformed);
      setCodeScope(cleaned.scope);

      // Add AI response to chat
      setChatHistories((prev) => ({
        ...prev,
        [sessionId]: [
          ...prev[sessionId],
          {
            type: 'ai',
            content: data.summary || 'No response summary available.',
          },
        ],
      }));
    } catch (error) {
      // Add error message to chat
      setChatHistories((prev) => ({
        ...prev,
        [sessionId]: [
          ...prev[sessionId],
          {
            type: 'ai',
            content: 'Sorry, I encountered an error. Please try again.',
            isError: true,
          },
        ],
      }));
      console.error('Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = '/images/favicon.ico';
  };

  const fileChanges = getDummyFileChanges();

  const renderChatMessage = (message, index) => {
    return (
      <Box
        key={`${sessionId}-${index}`}
        mb={2}
        display='flex'
        alignItems='flex-start'
        className={`${classes.messageWrapper} ${message.type}`}>
        <Box className={classes.messageIcon}>
          {message.type === 'ai' && (
            <img src='/favicon.ico' alt='AI' onError={handleImageError} />
          )}
        </Box>
        <ListItem className={`${classes.chatMessage} ${message.type}`}>
          <Typography>{message.content}</Typography>
          {message.changes?.length > 0 && (
            <Box mt={2}>
              <Typography variant='subtitle2' color='textSecondary'>
                Changes:
              </Typography>
              <CodeDiffViewer fileChanges={message.changes} />
            </Box>
          )}
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
                    <img
                      src='/favicon.ico'
                      alt='AI'
                      onError={handleImageError}
                    />
                  </Box>
                  <ListItem className={`${classes.chatMessage} ai typing`}>
                    <Typography>Thinking...</Typography>
                  </ListItem>
                </Box>
              )}
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
                  handlePromptSubmit();
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
                      onClick={handlePromptSubmit}
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
          {isProcessing && (
            <Box className={classes.processingOverlay}>
              <Box className={classes.heartLogo}>
                <img src='/images/logo.png' alt='Processing' />
              </Box>
              <Typography variant='h2' className={classes.processingTitle}>
                Spinning up preview...
              </Typography>
              <Box className={classes.processingSteps}>
                {processingSteps.map((step, index) => (
                  <Typography
                    key={step.text}
                    variant='body1'
                    className={clsx(classes.processingStep, {
                      [classes.activeStep]: index === visibleStepIndex,
                      [classes.inactiveStep]: index !== visibleStepIndex,
                    })}>
                    <span className={classes.stepIcon}>{step.icon}</span>
                    <span>{step.text}</span>
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
          <Box className={classes.slideContainer}>
            <Slide
              direction='right'
              in={currentView === 'editor'}
              mountOnEnter
              unmountOnExit>
              <Box className={classes.slidePage}>
                <Box className={classes.urlBar}>
                  <Typography className={classes.urlText}>
                    {currentProject?.development?.previewUrl ||
                      'No preview URL available'}
                  </Typography>
                  <Box className={classes.urlActions}>
                    <IconButton
                      size='small'
                      onClick={() =>
                        window.open(
                          currentProject?.development?.previewUrl,
                          '_blank',
                        )
                      }>
                      <OpenInNew fontSize='small' />
                    </IconButton>
                    <IconButton
                      size='small'
                      onClick={() => {
                        // Add refresh logic here
                      }}>
                      <Refresh fontSize='small' />
                    </IconButton>
                  </Box>
                </Box>

                <Tabs
                  value={previewTab}
                  onChange={handlePreviewTabChange}
                  className={classes.previewTabs}>
                  <Tab label='Preview' value='preview' />
                  <Tab label='Code' value='code' />
                </Tabs>

                <Box flex={1} style={{overflowY: 'auto', height: '100%'}}>
                  {isProcessing ? (
                    <Typography variant='body2' color='textSecondary'>
                      Processing...
                    </Typography>
                  ) : (
                    <Box
                      className={classes.previewContent}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                      }}>
                      {previewTab === 'preview' ? (
                        currentProject?.development?.previewUrl ? (
                          <Box className={classes.livePreview}>
                            <iframe
                              src={'http://localhost:3674'}
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
                          <Box
                            p={4}
                            bgcolor='#f5f7f9'
                            style={{borderBottom: '1px solid #e1e1e1'}}
                            borderRadius={1}>
                            <Typography variant='body2' color='textSecondary'>
                              ✨ Review the changes below. These changes will be
                              applied when you click Publish.
                            </Typography>
                          </Box>
                          <CodeDiffViewer fileChanges={fileChanges} />
                        </>
                      )}
                    </Box>
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
