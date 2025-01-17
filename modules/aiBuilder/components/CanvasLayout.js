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
} from '@material-ui/core';
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live';
import {makeStyles} from '@material-ui/core/styles';
import AttachFile from '@material-ui/icons/AttachFile';
import Send from '@material-ui/icons/Send';

const useStyles = makeStyles((theme) => ({
  canvas: {
    display: 'flex',
    gap: theme.spacing(3),
    marginTop: theme.spacing(3),
    height: 'calc(100vh - 250px)',
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
    maxWidth: '90%',
    position: 'relative',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    '&.user': {
      backgroundColor: '#f7f7f8',
      color: '#1a1a1a',
      alignSelf: 'flex-end',
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
    flexDirection: 'column',
    width: '100%',
    position: 'relative',
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
  },
  previewHeader: {
    borderBottom: `1px solid #f0f0f0`,
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  progressItem: {
    padding: theme.spacing(2),
    backgroundColor: '#ffffff',
    border: `1px solid #e6e6e6`,
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
    padding: theme.spacing(2),
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
}));

const ALLOWED_LIBRARIES = [
  '@mui/material',
  '@mui/icons-material',
  'react',
  'react-dom',
  'prop-types',
];

const CanvasLayout = ({
  activeTab,
  handleTabChange,
  generatedCode,
  codeScope,
  inputValue,
  isProcessing,
  searchId,
  initialResponse,
}) => {
  const classes = useStyles();
  const [chatHistories, setChatHistories] = useState({});
  const [promptInput, setPromptInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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

  const getCurrentChatHistory = () => {
    return searchId ? chatHistories[searchId] || [] : [];
  };

  const handlePromptSubmit = async () => {
    if (!promptInput.trim() || !searchId) return;

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
      const response = await fetch(
        'http://localhost:5001/api/ai/generate-page',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: promptInput,
          }),
        },
      );

      const data = await response.json();

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

  return (
    <Box className={classes.canvas}>
      <Box className={classes.progress}>
        <Box className={classes.progressHeader}>
          <Typography variant='h6' gutterBottom>
            AI Assistant
          </Typography>
        </Box>
        <Box className={classes.progressContent}>
          <Box className={classes.progressItem}>
            <Typography variant='subtitle2' color='textSecondary'>
              Prompt Analysis
            </Typography>
            <Typography style={{fontStyle: 'italic'}} variant='body2'>
              "{inputValue}"
            </Typography>
          </Box>

          <List className={classes.chatHistory}>
            {getCurrentChatHistory().map((message, index) => (
              <Box
                key={`${searchId}-${index}`}
                className={classes.messageWrapper}>
                <ListItem
                  className={`${classes.chatMessage} ${message.type} ${message.isError ? 'error' : ''}`}
                  disableGutters>
                  <ListItemText
                    className={classes.messageContent}
                    primary={message.content}
                  />
                </ListItem>
              </Box>
            ))}
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
        <Box className={classes.previewHeader}>
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
                  <Typography variant='body2' color='textSecondary'>
                    No preview available
                  </Typography>
                )
              ) : (
                <LiveProvider
                  code={generatedCode}
                  noInline={true}
                  scope={{
                    React,
                    ...codeScope,
                  }}>
                  <LiveEditor
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
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CanvasLayout;
