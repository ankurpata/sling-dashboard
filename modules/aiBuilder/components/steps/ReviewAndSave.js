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
import {
  deployProject,
  getDevelopmentStatus,
} from '../../services/projectService';
import {useProject} from '../../context/ProjectContext';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  overviewSection: {
    display: 'flex',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  previewPane: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    minHeight: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #e0e0e0',
  },
  detailsPane: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
  },
  detailsHeader: {
    marginBottom: theme.spacing(3),
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    '&:last-child': {
      marginBottom: 0,
    },
  },
  detailLabel: {
    color: theme.palette.text.secondary,
    width: 120,
  },
  detailValue: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  previewUrl: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    backgroundColor: '#f8f9fa',
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(1),
  },
  statusChip: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 1.5),
    borderRadius: 16,
    fontSize: '0.875rem',
    gap: theme.spacing(1),
    backgroundColor: '#f0f0f0',
    '&.running': {
      backgroundColor: '#e6f4ea',
      color: '#1e7e34',
    },
    '&.error': {
      backgroundColor: '#fdecea',
      color: '#d32f2f',
    },
    '&.not_started': {
      backgroundColor: '#f5f5f5',
      color: '#666666',
    },
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    display: 'inline-block',
    '&.running': {
      backgroundColor: '#1e7e34',
    },
    '&.error': {
      backgroundColor: '#d32f2f',
    },
    '&.not_started': {
      backgroundColor: '#666666',
    },
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  logsContainer: {
    maxHeight: 400,
    overflow: 'auto',
    backgroundColor: '#1e1e1e',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    fontFamily: 'monospace',
    fontSize: '0.875rem',
  },
  logLine: {
    margin: 0,
    color: '#fff',
    whiteSpace: 'pre-wrap',
    '&[data-error="true"]': {
      color: '#ff6b6b',
    },
  },
}));

const POLL_INTERVAL = 5000; // 5 seconds
const MAX_POLL_TIME = 5 * 60 * 1000; // 5 minutes

const ReviewAndSave = () => {
  const classes = useStyles();
  const {currentProject} = useProject();
  const [deploymentStatus, setDeploymentStatus] = useState('not_started');
  const [previewUrl, setPreviewUrl] = useState('');
  const [buildLogs, setBuildLogs] = useState([]);
  const pollTimeoutRef = useRef(null);
  const startTimeRef = useRef(null);

  const stopPolling = () => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  };

  const pollDeploymentStatus = async () => {
    try {
      const now = Date.now();
      if (now - startTimeRef.current > MAX_POLL_TIME) {
        console.log('Polling timeout reached');
        stopPolling();
        return;
      }

      const response = await getDevelopmentStatus(currentProject._id);

      if (response) {
        const {status, logs, previewUrl, error, step} = response;
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
            error,
          );
        }

        setBuildLogs(updatedLogs);

        if (previewUrl) {
          setPreviewUrl(previewUrl);
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
    console.log('Starting development status polling');
    startTimeRef.current = Date.now();
    pollDeploymentStatus();

    return () => {
      stopPolling();
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'running';
      case 'error':
        return 'error';
      case 'not_started':
      default:
        return 'not_started';
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(previewUrl);
  };

  return (
    <div className={classes.root}>
      <Box className={classes.overviewSection}>
        <Paper className={classes.previewPane}>
          {previewUrl ? (
            // Change this to previewUrl once proxy issue is resolved
            <iframe
              src={previewUrl}
              title='Preview'
              style={{width: '100%', height: '100%', border: 'none'}}
            />
          ) : (
            <Typography variant='body1' color='textSecondary'>
              Preview will be available once deployment is complete
            </Typography>
          )}
        </Paper>

        <Paper className={classes.detailsPane}>
          <Box className={classes.detailsHeader}>
            <Typography variant='h6' gutterBottom>
              Project Details
            </Typography>
          </Box>

          <Box className={classes.detailRow}>
            <Typography className={classes.detailLabel}>Status</Typography>
            <Box className={classes.detailValue}>
              <Box className={`${classes.statusChip} ${deploymentStatus}`}>
                <span
                  className={`${classes.statusDot} ${getStatusColor(deploymentStatus)}`}
                />
                <span>
                  {deploymentStatus.charAt(0).toUpperCase() +
                    deploymentStatus.slice(1)}
                </span>
              </Box>
            </Box>
          </Box>

          <Box className={classes.detailRow}>
            <Typography className={classes.detailLabel}>Preview URL</Typography>
            <Box className={classes.detailValue}>
              {previewUrl ? (
                <Box className={classes.previewUrl}>
                  <Typography variant='body2' style={{flex: 1}}>
                    {previewUrl}
                  </Typography>
                  <Tooltip title='Copy URL'>
                    <IconButton size='small' onClick={handleCopyUrl}>
                      <FileCopyIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Visit'>
                    <IconButton
                      size='small'
                      component='a'
                      href={previewUrl}
                      target='_blank'
                      rel='noopener noreferrer'>
                      <LaunchIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <Typography variant='body2' color='textSecondary'>
                  Not available yet
                </Typography>
              )}
            </Box>
          </Box>

          <Box className={classes.detailRow}>
            <Typography className={classes.detailLabel}>Source</Typography>
            <Box className={classes.detailValue}>
              <Typography>
                {currentProject?.repository?.name || 'N/A'}
              </Typography>
            </Box>
          </Box>

          <Box className={classes.detailRow}>
            <Typography className={classes.detailLabel}>Branch</Typography>
            <Box className={classes.detailValue}>
              <Typography>master</Typography>
            </Box>
          </Box>

          <Box className={classes.detailRow}>
            <Typography className={classes.detailLabel}>Version</Typography>
            <Box className={classes.detailValue}>
              <Typography>{currentProject?.version || '1.0.0'}</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Paper className={classes.paper}>
        <Typography variant='h6' gutterBottom>
          Runtime Logs
        </Typography>
        <Box className={classes.logsContainer}>
          {buildLogs.map((log, index) => (
            <pre
              key={index}
              className={classes.logLine}
              data-error={log.startsWith('[ERROR]')}>
              {log}
            </pre>
          ))}
        </Box>
      </Paper>
    </div>
  );
};

export default ReviewAndSave;
