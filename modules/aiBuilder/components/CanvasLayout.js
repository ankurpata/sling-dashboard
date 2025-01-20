import React, {useState, useEffect} from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  IconButton,
  List,
  ListItem,
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
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live';
import {makeStyles} from '@material-ui/core/styles';
import AttachFile from '@material-ui/icons/AttachFile';
import Send from '@material-ui/icons/Send';
import TuneIcon from '@material-ui/icons/Tune';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowRight';
import CodeUtils from '../utils';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import PreviewLayout from './PreviewLayout'; // Import PreviewLayout
import {useStyles as useSharedStyles} from '../styles';

// Import CodeUtils from index.js

const useStyles = makeStyles((theme) => ({
  canvas: {
    display: 'flex',
    gap: theme.spacing(3),
    marginTop: theme.spacing(3),
    height: 'calc(100vh - 200px)',
    minHeight: '600px',
  },
  progress: {
    flex: '0 0 30%',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
    border: '1px solid #e5e5e5',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  progressHeader: {
    padding: theme.spacing(2.5, 3),
    borderBottom: '1px solid #e5e5e5',
    '& h6': {
      fontWeight: 500,
      color: '#1a1a1a',
    },
  },
  progressContent: {
    flex: 1,
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#e5e5e5',
      borderRadius: '2px',
      '&:hover': {
        background: '#d0d0d0',
      },
    },
  },
  chatHistory: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    padding: theme.spacing(2.5, 3),
  },
  chatMessage: {
    padding: theme.spacing(2),
    maxWidth: '100%',
    position: 'relative',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    '&.user': {
      backgroundColor: '#f7f7f8',
      color: '#1a1a1a',
      alignSelf: 'flex-end',
      marginLeft: 'auto',
      textAlign: 'right',
      borderRadius: '12px',
      padding: theme.spacing(1.5, 2),
    },
    '&.ai': {
      backgroundColor: '#ffffff',
      color: '#1a1a1a',
      alignSelf: 'flex-start',
      borderRadius: '12px',
      border: '1px solid #e5e5e5',
      padding: theme.spacing(2),
      '&.typing': {
        backgroundColor: '#f7f7f8',
        border: 'none',
        '& .MuiTypography-root': {
          color: '#6b7280',
          fontStyle: 'italic',
        },
      },
      '&.error': {
        borderColor: '#fee2e2',
        backgroundColor: '#fef2f2',
        color: '#991b1b',
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
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e5e5e5',
    position: 'relative',
  },
  input: {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: '#ffffff',
      transition: 'all 0.2s ease',
      border: '1px solid #e5e5e5',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      '&:hover': {
        borderColor: '#d0d0d0',
        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
      },
      '&.Mui-focused': {
        borderColor: '#d0d0d0',
        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
      },
      '& textarea': {
        padding: theme.spacing(1.2, 2),
        paddingRight: theme.spacing(10),
        fontSize: '0.95rem',
        color: '#1a1a1a',
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
        backgroundColor: '#f7f7f8',
        color: '#1a1a1a',
      },
    },
  },
  preview: {
    flex: '0 0 70%',
    backgroundColor: '#ffffff',
    padding: theme.spacing(3),
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    // backgroundColor: theme.palette.background.default,
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
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
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
    flex: 1,
    // padding: theme.spacing(2),
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    minHeight: '500px',
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
}));

// Define allowed libraries
const ALLOWED_LIBRARIES = [
  '@mui/material',
  '@mui/icons-material',
  'react',
  'react-dom',
  'prop-types',
];

const steps = [
  {
    label: 'Generate UI',
    description: 'Create and preview your component'
  },
  {
    label: 'Customize Layout',
    description: 'Arrange and style your widgets'
  }
];

// CanvasLayout component
const CanvasLayout = ({
  activeTab,
  handleTabChange,
  generatedCode,
  codeScope,
  inputValue,
  isProcessing,
  searchId,
  initialResponse,
  setGeneratedCode,
  setCodeScope,
  setIsProcessing,
}) => {
  const classes = useStyles();
  const sharedClasses = useSharedStyles();
  const [chatHistories, setChatHistories] = useState({});
  const [promptInput, setPromptInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentView, setCurrentView] = useState('editor');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isBreakingWidgets, setIsBreakingWidgets] = useState(false);
  const [originalCode, setOriginalCode] = useState(null);
  const [originalScope, setOriginalScope] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const handleBreakWidgets = async (prompt, options = {}) => {
    setIsProcessing(true);
    setIsTyping(false);

    // Store original code before breaking into widgets
    setOriginalCode(generatedCode);
    setOriginalScope(codeScope);
    localStorage.setItem('originalCode', generatedCode);
    localStorage.setItem('originalScope', JSON.stringify(codeScope));

    try {
      const response = await fetch(
        'http://localhost:5001/api/ai/generate-page',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            mock: false,
            conversationId: searchId,
            constraints: {
              ...options,
            },
          }),
        },
      );

      const data = await response.json();

      // Process returned code same as index.js
      const cleaned = CodeUtils.cleanCode(data);
      const transformed = CodeUtils.transformCode(cleaned.code);
      setGeneratedCode(transformed);
      setCodeScope(cleaned.scope);

      if (data?.message) {
        setChatHistories((prev) => ({
          ...prev,
          [searchId]: [
            ...(prev[searchId] || []),
            {type: 'ai', content: data.message},
          ],
        }));
      }

      return data;
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmNext = async () => {
    setShowConfirmDialog(false);
    setCurrentView('preview');
    setIsBreakingWidgets(true);

    // Add confirmation message to chat
    setChatHistories((prev) => ({
      ...prev,
      [searchId]: [
        ...(prev[searchId] || []),
        {
          type: 'ai',
          content:
            'Alright, your request is my command! We are breaking the UI into smaller React Widgets and creating layout config for Sling. This will help in better component organization and reusability.',
        },
      ],
    }));

    try {
      await handleBreakWidgets(inputValue, {
        breakWidgets: true,
      });
    } finally {
      setIsBreakingWidgets(false);
    }
  };

  // Initialize chat history with initial prompt and AI response
  useEffect(() => {
    if (searchId && !chatHistories[searchId] && inputValue && initialResponse) {
      setChatHistories((prev) => ({
        ...prev,
        [searchId]: [
          {
            type: 'user',
            content: inputValue,
          },
          {
            type: 'ai',
            content: initialResponse,
          },
        ],
      }));
    }
  }, [searchId, inputValue, initialResponse]);

  // Get current chat history for the active search
  const getCurrentChatHistory = () => {
    return searchId ? chatHistories[searchId] || [] : [];
  };

  // Handle prompt submission
  const handlePromptSubmit = async () => {
    if (!promptInput.trim() || !searchId) return;

    // Add user message to chat
    const newMessage = {
      type: 'user',
      content: promptInput,
    };

    setChatHistories((prev) => ({
      ...prev,
      [searchId]: [...(prev[searchId] || []), newMessage],
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
            conversationId: searchId,
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
        [searchId]: [
          ...prev[searchId],
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
        [searchId]: [
          ...prev[searchId],
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

  const handleImageError = (event) => {
    event.target.src = '/images/default-component.png';
  };

  const renderChatMessage = (message, index) => {
    return (
      <Box
        key={`${searchId}-${index}`}
        mb={2}
        display='flex'
        alignItems='flex-start'
        className={`${classes.messageWrapper} ${message.type}`}>
        {message.type === 'ai' && (
          <Box className={classes.messageIcon}>
            <img src='/favicon.ico' alt='AI' onError={handleImageError} />
          </Box>
        )}
        <Box flex={1}>
          <ListItem
            className={`${classes.chatMessage} ${message.type} ${message.isError ? 'error' : ''}`}
            disableGutters>
            <ListItemText
              className={classes.messageContent}
              primary={message.content}
            />
          </ListItem>
        </Box>
      </Box>
    );
  };

  const handleNext = () => {
    setShowConfirmDialog(true);
  };

  const handleCancelNext = () => {
    setShowConfirmDialog(false);
  };

  const handleBack = () => {
    // Restore original code when going back
    if (originalCode) {
      setGeneratedCode(originalCode);
      setOriginalCode(null);
      localStorage.removeItem('originalCode');
    } else {
      // Try to get from localStorage as fallback
      const savedCode = localStorage.getItem('originalCode');
      if (savedCode) {
        setGeneratedCode(savedCode);
        localStorage.removeItem('originalCode');
      }
    }

    if (originalScope) {
      setCodeScope(originalScope);
      setOriginalScope(null);
      localStorage.removeItem('originalScope');
    } else {
      // Try to get from localStorage as fallback
      const savedScope = localStorage.getItem('originalScope');
      if (savedScope) {
        try {
          setCodeScope(JSON.parse(savedScope));
          localStorage.removeItem('originalScope');
        } catch (e) {
          console.error('Error parsing saved scope:', e);
        }
      }
    }

    setCurrentView('editor');
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving layout...');
  };

  return (
    <Box className={classes.canvas}>
      <Box className={classes.progress}>
        <Box className={classes.progressHeader}>
          <Typography variant='h6' gutterBottom>
            AI Assistant
          </Typography>
        </Box>
        <Box className={classes.progressContent}>
          <Box className={sharedClasses.progressItem}>
            <Typography variant='subtitle2' color='textSecondary'>
              Prompt Analysis
            </Typography>
            <Typography style={{fontStyle: 'italic'}} variant='body2'>
              "{inputValue}"
            </Typography>
          </Box>

          <List className={classes.chatHistory}>
            {getCurrentChatHistory().map((message, index) =>
              renderChatMessage(message, index),
            )}
            {isTyping && (
              <Box className={classes.messageWrapper}>
                <ListItem
                  className={`${classes.chatMessage} ai typing`}
                  disableGutters>
                  <ListItemText
                    className={classes.messageContent}
                    primary='Thinking...'
                  />
                </ListItem>
              </Box>
            )}
          </List>
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
      <Box className={classes.preview}>
        <Box className={classes.slideContainer}>
          <Slide
            direction='right'
            in={currentView === 'editor'}
            mountOnEnter
            unmountOnExit>
            <Box className={classes.slidePage}>
              <Box className={classes.headerSection}>
                <Box className={classes.headerLeft}>
                  <Typography variant='h5' color='primary'>
                    Generate UI
                  </Typography>
                  <Typography variant='subtitle1' color='textSecondary'>
                    Create and preview your component using AI
                  </Typography>
                </Box>
                <Box className={classes.buttonGroup}>
                  <Button
                    variant='contained'
                    className={classes.nextButton}
                    onClick={handleNext}
                    disabled={!generatedCode || isProcessing}
                    disableElevation>
                    Customize Layout
                    <ArrowForwardIosIcon style={{fontSize: 25}} />
                  </Button>
                </Box>
              </Box>

              <Box mb={2}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  classes={{
                    root: classes.tabsRoot,
                    indicator: classes.tabsIndicator,
                  }}>
                  <Tab
                    label='Preview'
                    value='preview'
                    classes={{
                      root: classes.tabRoot,
                    }}
                  />
                  <Tab
                    label='Code'
                    value='code'
                    classes={{
                      root: classes.tabRoot,
                    }}
                  />
                </Tabs>
              </Box>
              <Box flex={1} style={{overflowY: 'auto'}}>
                {isProcessing ? (
                  <Typography variant='body2' color='textSecondary'>
                    Generating code...
                  </Typography>
                ) : (
                  <Box
                    style={{
                      backgroundColor: '#ffffff',
                      padding: '16px',
                      borderRadius: '12px',
                      minHeight: '500px',
                    }}>
                    {activeTab === 'preview' ? (
                      generatedCode ? (
                        <LiveProvider
                          code={generatedCode}
                          noInline={true}
                          scope={{
                            React,
                            ...codeScope,
                          }}>
                          <Box className={classes.livePreview}>
                            <LivePreview />
                          </Box>
                          <LiveError className={classes.liveError} />
                        </LiveProvider>
                      ) : (
                        <Box className={classes.noPreview}>
                          <img
                            src='/favicon.ico'
                            alt='AI'
                            className={classes.loadingIcon}
                          />
                          <CircularProgress size={24} />
                          <Typography>is thinking...</Typography>
                        </Box>
                      )
                    ) : (
                      <>
                        <Box mb={2} p={2} bgcolor='#f5f7f9' borderRadius={1}>
                          <Typography variant='body2' color='textSecondary'>
                            ✨ Edit the code below and switch to the Preview tab
                            to see changes in real-time. The code automatically
                            updates as you type.
                          </Typography>
                        </Box>
                        <LiveProvider
                          code={generatedCode}
                          noInline={true}
                          scope={{
                            React,
                            ...codeScope,
                          }}>
                          <LiveEditor
                            onChange={(code) => setGeneratedCode(code)}
                            className={classes.liveEditor}
                            style={{
                              fontFamily: 'monospace',
                              fontSize: 14,
                              backgroundColor: '#f8fafc',
                              borderRadius: 12,
                              padding: 16,
                            }}
                          />
                          <LiveError
                            style={{
                              color: 'red',
                              marginTop: 8,
                              padding: 8,
                              backgroundColor: '#ffebee',
                              borderRadius: 12,
                            }}
                          />
                        </LiveProvider>
                      </>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </Slide>

          <Slide
            direction='left'
            in={currentView === 'preview'}
            mountOnEnter
            unmountOnExit>
            <Box className={classes.slidePage}>
              <PreviewLayout
                generatedCode={generatedCode}
                codeScope={codeScope}
                isProcessing={isProcessing}
                onBack={handleBack}
                onSave={handleSave}
                isBreakingWidgets={isBreakingWidgets}
              />
            </Box>
          </Slide>
        </Box>
      </Box>
      <Dialog
        open={showConfirmDialog}
        onClose={handleCancelNext}
        className={classes.confirmDialog}
        maxWidth='xs'
        fullWidth>
        <DialogTitle className={classes.dialogTitle}>
          Ready to Customize Layout?
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Typography>
            Are you done creating the UI using AI? If yes, proceed to breaking
            this into Sling Layout and Widgets. You can always come back to edit
            if needed.
          </Typography>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button onClick={handleCancelNext} color='primary' variant='outlined'>
            Continue Editing
          </Button>
          <Button
            onClick={handleConfirmNext}
            color='primary'
            variant='contained'
            disableElevation>
            Proceed to Customize
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CanvasLayout;
