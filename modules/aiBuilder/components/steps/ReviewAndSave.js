import React, {useState, useEffect} from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import LaunchIcon from '@material-ui/icons/Launch';
import {deployProject} from '../../services/projectService';
import {useProject} from '../../context/ProjectContext';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  section: {
    marginBottom: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    marginRight: theme.spacing(1),
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  statusPending: {
    backgroundColor: '#FFC107',
  },
  statusInProgress: {
    backgroundColor: '#2196F3',
  },
  statusCompleted: {
    backgroundColor: '#4CAF50',
  },
  statusFailed: {
    backgroundColor: '#F44336',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  infoItem: {
    '& > h6': {
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(0.5),
    },
  },
  logsContainer: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    fontFamily: 'monospace',
    height: 300,
    overflowY: 'auto',
    marginTop: theme.spacing(2),
  },
  logLine: {
    margin: 0,
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  actions: {
    display: 'flex',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  urlContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

const ReviewAndSave = () => {
  const classes = useStyles();
  const {currentProject} = useProject();
  const [deploymentStatus, setDeploymentStatus] = useState('pending');
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    const initiateDeployment = async () => {
      try {
        const response = await deployProject(currentProject._id);
        // Update status based on response
        if (response?.deploymentUrl) {
          setPreviewUrl(response.deploymentUrl);
        }
        if (response?.status) {
          setDeploymentStatus(response.status);
        }
      } catch (error) {
        console.error('Deployment failed:', error);
        setDeploymentStatus('failed');
      }
    };

    initiateDeployment();
  }, [currentProject._id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return classes.statusPending;
      case 'in_progress':
        return classes.statusInProgress;
      case 'completed':
        return classes.statusCompleted;
      case 'failed':
        return classes.statusFailed;
      default:
        return classes.statusPending;
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(previewUrl);
  };

  // Sample build logs - will be replaced with real-time logs
  const buildLogs = [
    '23:25:20.995 ○ /profile           4.72 kB     328 kB',
    '23:25:20.995 ○ /routes           3.22 kB     481 kB',
    '23:25:20.996 ○ /routes/[...all]  3.23 kB     481 kB',
    '23:25:20.996 ○ /settings         3.21 kB     481 kB',
    '23:25:20.996 ○ /settings/[...all] 3.21 kB    481 kB',
    '23:25:20.996 ○ /signup           1.69 kB     326 kB',
  ];

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Box className={classes.statusContainer}>
          <span
            className={`${classes.statusDot} ${getStatusColor(deploymentStatus)}`}
          />
          <Typography variant="body1">
            {deploymentStatus.charAt(0).toUpperCase() + deploymentStatus.slice(1)}
          </Typography>
        </Box>
        <Box className={classes.urlContainer}>
          {previewUrl && (
            <>
              <Typography variant="body2">{previewUrl}</Typography>
              <Tooltip title="Copy URL">
                <IconButton size="small" onClick={handleCopyUrl}>
                  <FileCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Visit">
                <IconButton
                  size="small"
                  component="a"
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LaunchIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>

      <Box className={classes.infoGrid}>
        <Paper className={classes.paper}>
          <Box className={classes.infoItem}>
            <Typography variant="h6">Environment</Typography>
            <Typography>Preview</Typography>
          </Box>
        </Paper>
        <Paper className={classes.paper}>
          <Box className={classes.infoItem}>
            <Typography variant="h6">Source</Typography>
            <Typography>{currentProject?.repository?.name || 'N/A'}</Typography>
          </Box>
        </Paper>
        <Paper className={classes.paper}>
          <Box className={classes.infoItem}>
            <Typography variant="h6">Duration</Typography>
            <Typography>2m 12s</Typography>
          </Box>
        </Paper>
      </Box>

      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom>
          Build Logs
        </Typography>
        <Box className={classes.logsContainer}>
          {buildLogs.map((log, index) => (
            <pre key={index} className={classes.logLine}>
              {log}
            </pre>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default ReviewAndSave;
