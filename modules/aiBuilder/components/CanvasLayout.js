import React, {useEffect, useState, useRef} from 'react';
import {
  Box,
  Typography,
  IconButton,
  ListItem,
  TextField,
  Button,
} from '@material-ui/core';
import Send from '@material-ui/icons/Send';
import {Tabs, Tab, Slide} from '@material-ui/core';
import {OpenInNew, Refresh} from '@material-ui/icons';
import {useProject} from '../context/ProjectContext';
import CodeDiffViewer from './CodeDiffViewer';
import CommitDialog from './CommitDialog';
import ReviewNotification from './ReviewNotification';
import History from './History';
import {
  initializeSocket,
  disconnectSocket,
  emitMessage,
  subscribeToEvent,
} from '../services/socketService';

import canvasStyles from '../styles/canvas.styles';
import {
  getFileChanges,
  discardFileChanges,
} from '../services/fileChangesService';
import {useUser} from '../context/UserContext';

// CanvasLayout component
const CanvasLayout = ({
  sessionId,
  initialChatHistory = [],
  conversationId,
  allConversations,
  onConversationChange,
}) => {
  const classes = canvasStyles();
  const {currentProject} = useProject();
  const {user} = useUser();
  const [chatHistories, setChatHistories] = useState({});
  const [promptInput, setPromptInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentView, setCurrentView] = useState('editor');
  const [fileChanges, setFileChanges] = useState([]);
  const [isCommitDialogOpen, setIsCommitDialogOpen] = useState(false);
  const [activeTabState, setActiveTabState] = useState('chat');
  const [previewTab, setPreviewTab] = useState('preview');
  const [conversations, setConversations] = useState([]);
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(
    currentProject?.development?.previewUrl || 'No preview URL available',
  );
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleIframeNavigation = (event) => {
      if (event.data?.type === 'URL_UPDATE') {
        setPreviewUrl(event.data.url);
      }
    };

    window.addEventListener('message', handleIframeNavigation);
    return () => {
      window.removeEventListener('message', handleIframeNavigation);
    };
  }, []);

  // Helper function to scroll to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
      });
    }
  };

  useEffect(() => {
    handleFileChanges();
  }, [sessionId, initialChatHistory]);

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

  useEffect(() => {
    // Process conversations to get the first user message from each conversation
    const conversationFirstMessages = allConversations.map((conversation) => {
      const firstUserMessage = conversation.messages.find(
        (msg) => msg.role === 'user',
      );
      return {
        id: conversation.conversationId,
        title: firstUserMessage?.message || 'Untitled Conversation',
        timestamp: firstUserMessage?.timestamp || new Date().toISOString(),
      };
    });

    setConversations(conversationFirstMessages);
  }, [allConversations, activeTabState]);

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
      const cleanupFunctions = [];

      // Wait for socket to be connected before subscribing to events
      const setupSocketEvents = () => {
        console.log('Setting up socket event listeners...');

        // Subscribe to events and store cleanup functions
        cleanupFunctions.push(
          subscribeToEvent('analyze-query-progress', (data) => {
            console.log('Progress update received:', data);
            handleProgressUpdate(data);
          }),
          subscribeToEvent('analyze-query-success', (data) => {
            console.log('Success update received:', data);
            handleSuccessUpdate(data);
            if (data.fileChanges) {
              setFileChanges(data.fileChanges);
            }
          }),
          subscribeToEvent('analyze-query-error', (error) => {
            console.log('Analysis error received:', error);
            handleAnalysisError(error);
          }),
          subscribeToEvent('file-changes', (data) => {
            console.log('File changes event received:', data);
            handleFileChanges(data);
          }),
        );
      };

      const connectHandler = () => {
        console.log('Socket connected, setting up events');
        setupSocketEvents();
      };

      socketInstance.on('connect', connectHandler);
      if (socketInstance.connected) {
        console.log('Socket already connected, setting up events immediately');
        setupSocketEvents();
      }

      // Send initial prompt through socket if available and it's from user
      if (currentProject?._id && initialChatHistory.length > 0) {
        const lastMessage = initialChatHistory[initialChatHistory.length - 1];
        const isLastMessageFromUser = lastMessage.role === 'user';

        if (isLastMessageFromUser) {
          // console.log(
          //   'Sending initial prompt through socket:',
          //   lastMessage.message,
          // );
          // emitMessage('analyze-query', {
          //   projectId: currentProject._id,
          //   sessionId,
          //   conversationId,
          //   query: lastMessage.message,
          //   newConversation: true,
          // });
        } else {
          console.log(
            'Skipping initial analyze-query as last message was not from user',
          );
        }
      }

      // Cleanup function
      return () => {
        console.log('Cleaning up socket connections...');
        // Clean up all event subscriptions
        cleanupFunctions.forEach((cleanup) => cleanup());
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

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to hide "Thinking..." after 2 minutes
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 120000); // 2 minutes

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
    // Clear typing timeout when we get a response
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Check if this message already exists
    setChatHistories((prev) => {
      const currentMessages = prev[sessionId] || [];
      const lastMessage = currentMessages[currentMessages.length - 1];

      // If the last message is the same as the new one, don't add it
      if (
        lastMessage &&
        lastMessage.role === 'progress' &&
        lastMessage.message === data.message
      ) {
        return prev;
      }

      return {
        ...prev,
        [sessionId]: [
          ...currentMessages,
          {
            role: 'progress',
            message: data.message,
            progress: data.progress,
            timestamp: new Date().toISOString(),
          },
        ],
      };
    });
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

  const handleFileChanges = async (data) => {
    const totalChanges = await getFileChanges(currentProject._id);
    setFileChanges(totalChanges);
  };

  const handleReviewClick = () => {
    setIsCommitDialogOpen(true);
  };

  const handleRejectAll = () => {
    setFileChanges([]);
    //TODO : ADd api call to clear all file changes from local folder.
    discardFileChanges(currentProject._id, user.id);
  };

  const handleAcceptAll = () => {
    setIsCommitDialogOpen(true);
  };

  const handleConversationClick = (conversationId) => {
    if (onConversationChange) {
      onConversationChange(conversationId);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    // Add delete conversation logic here
    try {
      // await deleteConversation(currentProject.id, conversationId);
      setConversations(
        conversations.filter((conv) => conv.id !== conversationId),
      );
    } catch (error) {
      console.error('Failed to delete conversation:', error);
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
        className={`${classes.messageWrapper} ${message.role} ${
          fileChanges?.length > 0 &&
          index === chatHistories[sessionId]?.length - 1
            ? 'lastMessage'
            : ''
        }`}>
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
            <Box className={classes.chatContainer} ref={chatContainerRef}>
              {activeTabState === 'chat' ? (
                <>
                  <Box className={classes.messageList}>
                    {(chatHistories[sessionId] || []).map((message, index) =>
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
                        <ListItem
                          className={`${classes.chatMessage} ai typing`}>
                          <Typography>Thinking...</Typography>
                        </ListItem>
                      </Box>
                    )}
                    <div ref={messagesEndRef} />
                  </Box>
                  {fileChanges?.length > 0 && (
                    <Box className={classes.reviewNotificationContainer}>
                      <ReviewNotification
                        fileCount={fileChanges.length}
                        onReject={handleRejectAll}
                        onPushForReview={handleAcceptAll}
                      />
                    </Box>
                  )}
                  <Box className={classes.inputContainer}>
                    <Box className={classes.inputWrapper}>
                      <TextField
                        fullWidth
                        placeholder='Ask a follow up...'
                        value={promptInput}
                        onChange={(e) => setPromptInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(promptInput);
                          }
                        }}
                        variant='standard'
                        InputProps={{
                          disableUnderline: true,
                          className: classes.input,
                        }}
                      />
                      <IconButton
                        onClick={() => handleSendMessage(promptInput)}
                        disabled={!promptInput.trim() || isTyping}>
                        <Send />
                      </IconButton>
                    </Box>
                  </Box>
                </>
              ) : (
                <History
                  conversations={conversations}
                  onConversationClick={handleConversationClick}
                  currentConversationId={conversationId}
                  onDeleteConversation={handleDeleteConversation}
                />
              )}
            </Box>
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
                      {previewUrl || 'No preview URL available'}
                    </Typography>
                  </Box>
                  <Box className={classes.urlActions}>
                    <IconButton
                      size='small'
                      onClick={() => window.open(previewUrl, '_blank')}>
                      <OpenInNew fontSize='small' />
                    </IconButton>
                    <IconButton
                      size='small'
                      onClick={() =>
                        iframeRef.current?.contentWindow?.location.reload()
                      }>
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
                    previewUrl ? (
                      <Box className={classes.livePreview}>
                        <iframe
                          ref={iframeRef}
                          src={previewUrl}
                          className={classes.previewFrame}
                          title='Preview'
                          sandbox='allow-same-origin allow-scripts allow-popups allow-forms'
                          onLoad={() => {
                            iframeRef.current.contentWindow.postMessage(
                              {type: 'INIT_LISTENER'},
                              '*',
                            );
                          }}
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
      <CommitDialog
        open={isCommitDialogOpen}
        projectId={currentProject?._id}
        onClose={() => setIsCommitDialogOpen(false)}
        setFileChanges={setFileChanges}
        files={fileChanges}
        conversationId={conversationId}
      />
    </Box>
  );
};

export default CanvasLayout;
