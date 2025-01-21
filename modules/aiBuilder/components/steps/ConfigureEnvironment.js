import React from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const useStyles = makeStyles((theme) => ({
  envVarContainer: {
    marginTop: theme.spacing(2),
  },
  envVarPair: {
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    alignItems: 'center',
  },
  envVarField: {
    flex: 1,
  },
  uploadSection: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
  },
  hiddenInput: {
    display: 'none',
  },
}));

const ConfigureEnvironment = ({
  envVars,
  onEnvVarChange,
  onEnvVarAdd,
  onEnvVarRemove,
  onEnvFileUpload,
  errors,
}) => {
  const classes = useStyles();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onEnvFileUpload(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Environment Variables
      </Typography>
      
      <Box className={classes.envVarContainer}>
        {envVars.map((envVar, index) => (
          <Box key={index} className={classes.envVarPair}>
            <TextField
              className={classes.envVarField}
              label="Key"
              variant="outlined"
              size="small"
              value={envVar.key}
              onChange={(e) => onEnvVarChange(index, 'key', e.target.value)}
              error={Boolean(errors?.[`env_${index}_key`])}
              helperText={errors?.[`env_${index}_key`]}
            />
            <TextField
              className={classes.envVarField}
              label="Value"
              variant="outlined"
              size="small"
              value={envVar.value}
              onChange={(e) => onEnvVarChange(index, 'value', e.target.value)}
              error={Boolean(errors?.[`env_${index}_value`])}
              helperText={errors?.[`env_${index}_value`]}
            />
            <IconButton 
              onClick={() => onEnvVarRemove(index)}
              disabled={envVars.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        
        <Button
          variant="outlined"
          color="primary"
          onClick={onEnvVarAdd}
          style={{ marginTop: 8 }}
        >
          Add Variable
        </Button>
      </Box>

      <Paper className={classes.uploadSection}>
        <Typography variant="subtitle2" gutterBottom>
          Upload .env File
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          You can upload an existing .env file to automatically populate the variables.
        </Typography>
        <input
          accept=".env"
          className={classes.hiddenInput}
          id="env-file-upload"
          type="file"
          onChange={handleFileUpload}
        />
        <label htmlFor="env-file-upload">
          <Button
            variant="contained"
            color="primary"
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            Upload .env File
          </Button>
        </label>
      </Paper>
    </Box>
  );
};

export default ConfigureEnvironment;
