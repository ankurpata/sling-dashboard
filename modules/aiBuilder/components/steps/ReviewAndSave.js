import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  IconButton,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { deployProject } from '../../services/projectService';
import { useProject } from '../../context/ProjectContext';

const useStyles = makeStyles((theme) => ({
  section: {
    marginBottom: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    marginTop: theme.spacing(1),
  },
  repoInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  envVarList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: theme.spacing(1),
  },
  envVarItem: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
  codePreview: {
    marginTop: theme.spacing(2),
    '& pre': {
      margin: 0,
      borderRadius: theme.shape.borderRadius,
    },
  },
  root: {
    padding: theme.spacing(2),
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  list: {
    padding: 0,
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  chip: {
    marginRight: theme.spacing(1),
  },
  noEnvVars: {
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
  },
  statusIcon: {
    fontSize: 20,
  },
  statusIconConfigured: {
    color: '#34C759',
  },
  statusIconUnconfigured: {
    color: theme.palette.grey[400],
  },
  deployButton: {
    marginTop: theme.spacing(2),
  },
}));

const ReviewAndSave = ({
  projectId,
  selectedRepo,
  buildSettings = {},
  onDeploySuccess,
  onDeployError,
}) => {
  const classes = useStyles();
  const [isDeploying, setIsDeploying] = useState(false);
  const { currentProject } = useProject();

  const handleDeploy = async () => {
    try {
      setIsDeploying(true);
      const response = await deployProject(projectId);
      if (onDeploySuccess) {
        onDeploySuccess(response.data);
      }
    } catch (error) {
      console.error('Failed to deploy project:', error);
      if (onDeployError) {
        onDeployError(error);
      }
    } finally {
      setIsDeploying(false);
    }
  };

  if (!selectedRepo) {
    return (
      <Box className={classes.root}>
        <Typography color="error">
          No repository selected. Please go back and select a repository.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box className={classes.section}>
        <Typography variant="subtitle1" gutterBottom>
          Selected Repository
        </Typography>
        <Paper className={classes.paper}>
          <Box className={classes.repoInfo}>
            <Typography variant="h6">
              {selectedRepo.name}
            </Typography>
            {selectedRepo.language && (
              <Chip
                label={selectedRepo.language}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            <Tooltip
              title={
                currentProject?.environmentVariables
                  ? 'Deployment configured with environment variables'
                  : 'No deployment configuration'
              }
              placement="left"
            >
              <IconButton size="small">
                {currentProject?.environmentVariables ? (
                  <CheckCircleIcon
                    className={`${classes.statusIcon} ${classes.statusIconConfigured}`}
                  />
                ) : (
                  <RadioButtonUncheckedIcon
                    className={`${classes.statusIcon} ${classes.statusIconUnconfigured}`}
                  />
                )}
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" color="textSecondary">
            {selectedRepo.description || 'No description'}
          </Typography>
        </Paper>
      </Box>

      <Box className={classes.section}>
        <Typography variant="subtitle1" gutterBottom>
          Environment Variables
        </Typography>
        <Paper className={classes.paper}>
          <Box className={classes.envVarList}>
            {currentProject?.environmentVariables
              ? Object.entries(currentProject.environmentVariables).map(([key, value], index) => (
                  <Box key={index} className={classes.envVarItem}>
                    <Typography variant="subtitle2" gutterBottom>
                      {key}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {value.replace(/./g, '*')} // Mask the value for security
                    </Typography>
                  </Box>
                ))
              : (
                <Typography variant="body2" color="textSecondary">
                  No environment variables configured
                </Typography>
              )}
          </Box>
        </Paper>
      </Box>

      <Box className={classes.section}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDeploy}
          disabled={isDeploying}
          className={classes.deployButton}
        >
          {isDeploying ? 'Deploying...' : 'Deploy Project'}
        </Button>
      </Box>
    </Box>
  );
};

export default ReviewAndSave;
