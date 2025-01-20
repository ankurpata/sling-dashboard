import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  makeStyles,
  Button,
} from '@material-ui/core';
import {LiveProvider, LivePreview, LiveError} from 'react-live';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
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
  previewContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: '16px',
    borderRadius: '12px',
    minHeight: '500px',
    overflow: 'auto',
  },
  livePreview: {
    padding: theme.spacing(2),
    height: '100%',
  },
  liveError: {
    color: 'red',
    margin: theme.spacing(2, 0),
    padding: theme.spacing(1),
    backgroundColor: '#ffebee',
    borderRadius: theme.spacing(1),
  },
  noPreview: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    height: '100%',
    minHeight: 400,
  },
  loadingIcon: {
    width: 48,
    height: 48,
    opacity: 0.5,
  },
  backButton: {
    color: '#098fdc',
    border: 'none',
    padding: '6px 16px',
    position: 'relative',
    // clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 15% 100%, 0 50%)',
    fontSize: '1rem',
    minWidth: '120px',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
    fontWeight: 500,
    borderRadius: '10px',
    paddingLeft: '24px',
    textTransform: 'none',
    backgroundColor: 'white',
    marginRight: theme.spacing(2),
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: '#f0f7fc',
      transform: 'translateX(-4px)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    },
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  saveButton: {
    color: 'white',
    border: 'none',
    padding: '6px 16px',
    position: 'relative',
    // clipPath: 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)',
    fontSize: '1rem',
    minWidth: '120px',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
    fontWeight: 500,
    borderRadius: '10px',
    paddingRight: '24px',
    textTransform: 'none',
    backgroundColor: '#098fdc',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: '#0076c6',
      transform: 'translateX(4px)',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    },
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    zIndex: 10,
  },
  overlayText: {
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

const PreviewLayout = ({
  generatedCode,
  codeScope,
  isProcessing,
  onBack,
  onSave,
  isBreakingWidgets,
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.headerSection}>
        <Box className={classes.headerLeft}>
          <Typography variant='h5' color='primary'>
            Customize Layout
          </Typography>
          <Typography variant='subtitle1' color='textSecondary'>
            The preview shows layout with widgets. Click a widget to edit its
            props which can be used to edit from the Studio.
          </Typography>
        </Box>
        <Box className={classes.buttonGroup}>
          <Button
            variant='contained'
            className={classes.backButton}
            onClick={onBack}
            disableElevation>
            Back
          </Button>
          <Button
            variant='contained'
            className={classes.saveButton}
            onClick={onSave}
            disableElevation>
            Save 
          </Button>
        </Box>
      </Box>

      <Box className={classes.previewContainer} style={{ position: 'relative' }}>
        {isBreakingWidgets && (
          <Box className={classes.previewOverlay}>
            <CircularProgress size={40} />
            <Typography className={classes.overlayText}>
              Breaking down UI into reusable widgets...
            </Typography>
          </Box>
        )}
        {isProcessing ? (
          <Box className={classes.noPreview}>
            <Typography variant='body2' color='textSecondary'>
              Generating code...
            </Typography>
            <CircularProgress size={24} />
          </Box>
        ) : generatedCode ? (
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
            <img src='/favicon.ico' alt='AI' className={classes.loadingIcon} />
            <CircularProgress size={24} />
            <Typography>is thinking...</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PreviewLayout;
