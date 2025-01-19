import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
} from 'react';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {useRouter} from 'next/router';
import {useIntl} from 'react-intl';
import {useDispatch, useSelector} from 'react-redux';
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live';

import {
  Grid,
  Container,
  Box,
  Typography,
  TextField,
  IconButton,
} from '@material-ui/core/';

import AttachFile from '@material-ui/icons/AttachFile';
import Send from '@material-ui/icons/Send';

import {ALLOWED_LIBRARIES} from './config';
import {useStyles} from './styles';
import CodeUtils from './utils';
import CanvasLayout from './components/CanvasLayout';
import ProcessingView from './components/ProcessingView';
import StarterTemplates from './components/StarterTemplates';

const AIBuilder = () => {
  const classes = useStyles();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeScope, setCodeScope] = useState({});
  const [activeTab, setActiveTab] = useState('preview');
  const [searchId, setSearchId] = useState(null);
  const [initialResponse, setInitialResponse] = useState(null);
  const processingTimeoutRef = useRef(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      event.preventDefault();
      if (!inputValue.trim()) return;

      setIsProcessing(true);

      // Set timeout to show canvas after 4 seconds
      processingTimeoutRef.current = setTimeout(() => {
        setIsProcessing(false);
        setShowCanvas(true);
      }, 4000);

      try {
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

        const data = await response.json();
        setShowCanvas(true);

        // Update searchId from conversationId
        setSearchId(data.conversationId);

        // Store initial response for chat
        setInitialResponse(data.summary);

        const cleaned = CodeUtils.cleanCode(data);
        const transformed = CodeUtils.transformCode(cleaned.code);
        setGeneratedCode(transformed);
        setCodeScope(cleaned.scope);
        setIsProcessing(false);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        // Clear timeout in case of error
        if (processingTimeoutRef.current) {
          clearTimeout(processingTimeoutRef.current);
        }
        setIsProcessing(false);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        {!showCanvas && (
          <Container className={classes.container}>
            <Box className={classes.searchWrapper}>
              <Typography variant='h4' className={classes.title}>
                Ready to create something new?{' '}
              </Typography>
              <TextField
                className={classes.searchInput}
                variant='outlined'
                multiline
                rows={2}
                placeholder='Describe what you want to build...'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleSubmit}
                InputProps={{
                  endAdornment: (
                    <Box className={classes.actionButtons}>
                      <IconButton>
                        <AttachFile />
                      </IconButton>
                      <IconButton onClick={handleSubmit}>
                        <Send />
                      </IconButton>
                    </Box>
                  ),
                }}
              />
            </Box>
            {!isProcessing && !showCanvas && (
              <Container className={classes.container}>
                <StarterTemplates />
              </Container>
            )}
          </Container>
        )}
        {isProcessing && !showCanvas && (
          <Box>
            <ProcessingView />
          </Box>
        )}

        {showCanvas && (
          <Box>
            <CanvasLayout
              searchId={searchId}
              inputValue={inputValue}
              isProcessing={isProcessing}
              initialResponse={initialResponse}
              activeTab={activeTab}
              handleTabChange={handleTabChange}
              generatedCode={generatedCode}
              codeScope={codeScope}
              setGeneratedCode={setGeneratedCode}
              setCodeScope={setCodeScope}
            />
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default AIBuilder;
