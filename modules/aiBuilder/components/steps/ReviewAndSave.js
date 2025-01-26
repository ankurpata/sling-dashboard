import React, {useState, useEffect, useRef} from 'react';
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
import {deployProject, getDeploymentStatus} from '../../services/projectService';
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
    padding: '4px 8px',
    fontFamily: 'monospace',
    fontSize: '0.9rem',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    '&[data-error="true"]': {
      color: theme.palette.error.main,
      backgroundColor: theme.palette.error.light + '20',
    },
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

const POLL_INTERVAL = 5000; // 5 seconds
const MAX_POLL_TIME = 5 * 60 * 1000; // 5 minutes

const ReviewAndSave = () => {
  const classes = useStyles();
  const {currentProject} = useProject();
  const [deploymentStatus, setDeploymentStatus] = useState('pending');
  const [previewUrl, setPreviewUrl] = useState('');
  const [buildLogs, setBuildLogs] = useState([]);
  const [deploymentId, setDeploymentId] = useState(null);
  const pollTimeoutRef = useRef(null);
  const startTimeRef = useRef(null);

  const stopPolling = () => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  };

  const pollDeploymentStatus = async () => {
    if (!deploymentId) {
      console.error('No deployment ID available');
      stopPolling();
      return;
    }

    try {
      const now = Date.now();
      if (now - startTimeRef.current > MAX_POLL_TIME) {
        console.log('Polling timeout reached');
        stopPolling();
        return;
      }

      console.log('Polling deployment status...', { deploymentId, projectId: currentProject._id });
      const response = await getDeploymentStatus(currentProject._id, deploymentId);
      
      if (response) {
        const {status, logs, deploymentUrl, error, step} = response;
        console.log('Received status:', status);
        setDeploymentStatus(status);
        
        // Update logs array with any new logs
        const updatedLogs = [...buildLogs];
        if (logs && logs.length > 0) {
          updatedLogs.push(...logs);
        }
        
        // If there's an error, add it to the logs with error formatting
        if (error) {
          updatedLogs.push(
            `\n[ERROR] Deployment failed during ${step || 'deployment'} step:`,
            error
          );
        }
        
        setBuildLogs(updatedLogs);
        
        if (deploymentUrl) {
          setPreviewUrl(deploymentUrl);
        }

        // Stop polling if deployment is complete or failed
        if (status === 'completed' || status === 'failed') {
          console.log('Deployment finished, stopping poll');
          stopPolling();
          return;
        }
      }

      // Schedule next poll
      pollTimeoutRef.current = setTimeout(pollDeploymentStatus, POLL_INTERVAL);
    } catch (error) {
      console.error('Error polling deployment status:', error);
      stopPolling();
    }
  };

  useEffect(() => {
    if (deploymentId) {
      console.log('Starting deployment status polling');
      startTimeRef.current = Date.now();
      pollDeploymentStatus();
    }

    return () => {
      stopPolling();
    };
  }, [deploymentId]);

  useEffect(() => {
    const initiateDeployment = async () => {
      try {
        console.log('Initiating deployment...');
        const response = await deployProject(currentProject._id);
        if (response?.deploymentUrl) {
          setPreviewUrl(response.deploymentUrl);
        }
        if (response?.status) {
          setDeploymentStatus(response.status);
        }
        if (response?.deploymentId) {
          console.log('Received deployment ID:', response.deploymentId);
          setDeploymentId(response.deploymentId);
        } else {
          console.error('No deployment ID received from deploy API');
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
            <pre 
              key={index} 
              className={classes.logLine}
              data-error={log.startsWith('[ERROR]')}
            >
              {log}
            </pre>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default ReviewAndSave;
