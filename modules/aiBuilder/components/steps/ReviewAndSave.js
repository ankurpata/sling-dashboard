import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
}));

const ReviewAndSave = ({ selectedRepo, envVars }) => {
  const classes = useStyles();

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
            {envVars.filter(env => env.key || env.value).map((envVar, index) => (
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
          {envVars.filter(env => env.key || env.value).length === 0 && (
            <Typography variant="body2" color="textSecondary">
              No environment variables configured
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ReviewAndSave;
