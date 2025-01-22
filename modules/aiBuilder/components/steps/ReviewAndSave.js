import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
}));

const ReviewAndSave = ({ selectedRepo, envVars = [], sandboxConfig }) => {
  const classes = useStyles();

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
            {envVars
              .filter((env) => env.key && env.value)
              .map((envVar, index) => (
                <Box key={index} className={classes.envVarItem}>
                  <Typography variant="subtitle2" gutterBottom>
                    {envVar.key}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {envVar.value.length > 20
                      ? `${envVar.value.substring(0, 20)}...`
                      : envVar.value}
                  </Typography>
                </Box>
              ))}
          </Box>
          {envVars.filter((env) => env.key && env.value).length === 0 && (
            <Typography variant="body2" color="textSecondary">
              No environment variables configured
            </Typography>
          )}
        </Paper>
      </Box>

      {sandboxConfig && (
        <Box className={classes.section}>
          <Typography variant="subtitle1" gutterBottom>
            Sandbox Configuration
          </Typography>
          <Paper className={classes.paper}>
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Framework: {sandboxConfig.framework}
              </Typography>
              {sandboxConfig.overrides.buildCommand && (
                <Typography variant="body2">
                  Build Command: {sandboxConfig.buildCommand}
                </Typography>
              )}
              {sandboxConfig.overrides.outputDirectory && (
                <Typography variant="body2">
                  Output Directory: {sandboxConfig.outputDirectory}
                </Typography>
              )}
              {sandboxConfig.overrides.installCommand && (
                <Typography variant="body2">
                  Install Command: {sandboxConfig.installCommand}
                </Typography>
              )}
              {sandboxConfig.overrides.developmentCommand && (
                <Typography variant="body2">
                  Development Command: {sandboxConfig.developmentCommand}
                </Typography>
              )}
            </Box>
            <Divider className={classes.divider} />
            <Typography variant="subtitle2" gutterBottom>
              vercel.json Configuration
            </Typography>
            <Box className={classes.codePreview}>
              <SyntaxHighlighter
                language="json"
                style={tomorrow}
                customStyle={{
                  backgroundColor: '#1a1a1a',
                }}
              >
                {JSON.stringify(sandboxConfig, null, 2)}
              </SyntaxHighlighter>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default ReviewAndSave;
