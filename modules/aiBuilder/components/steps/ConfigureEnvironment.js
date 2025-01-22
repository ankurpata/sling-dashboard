import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  Paper,
  makeStyles,
  Tooltip,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  header: {
    marginBottom: theme.spacing(3),
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  description: {
    fontSize: '1rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
  },
  envVarContainer: {
    marginBottom: theme.spacing(2),
  },
  envVarPair: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  keyInput: {
    flex: 1,
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      backgroundColor: '#fff',
      '& fieldset': {
        borderColor: '#E5E7EB',
      },
      '&:hover fieldset': {
        borderColor: '#B0B9C5',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2563EB',
      },
    },
  },
  valueInput: {
    flex: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      backgroundColor: '#fff',
      '& fieldset': {
        borderColor: '#E5E7EB',
      },
      '&:hover fieldset': {
        borderColor: '#B0B9C5',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2563EB',
      },
    },
  },
  deleteButton: {
    padding: 4,
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '50%',
    color: theme.palette.text.secondary,
    width: 24,
    height: 24,
    minWidth: 24,
    '&:hover': {
      backgroundColor: '#e5e7eb',
    },
    '& .MuiSvgIcon-root': {
      fontSize: 16,
    },
  },
  addButton: {
    marginTop: theme.spacing(1),
    color: theme.palette.primary.main,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },
  addIcon: {
    fontSize: 20,
  },
  addText: {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  uploadSection: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(3),
    border: '2px dashed rgba(0, 0, 0, 0.12)',
    borderRadius: theme.shape.borderRadius,
    textAlign: 'center',
  },
  uploadButton: {
    color: '#000',
    borderColor: '#000',
    marginTop: theme.spacing(2),
    fontSize: '1.1rem',
    '&:hover': {
      borderColor: '#000',
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  infoIcon: {
    fontSize: '1.2rem',
    marginLeft: theme.spacing(1),
    color: theme.palette.text.secondary,
    verticalAlign: 'middle',
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

  const handleEnvVarChange = (index, field, value) => {
    onEnvVarChange(index, field, value);
  };

  const handleAddEnvVar = () => {
    onEnvVarAdd();
  };

  const handleRemoveEnvVar = (index) => {
    onEnvVarRemove(index);
  };

  return (
    <div className={classes.root}>
      <Box className={classes.header}>
        {/* <Typography variant="h6" className={classes.title}>
          Configure Environment
          <Tooltip title="Environment variables will be securely stored and available during build and runtime">
            <InfoIcon className={classes.infoIcon} />
          </Tooltip>
        </Typography>
        <Typography className={classes.description}>
          Add environment variables for your project
        </Typography> */}
      </Box>

      <div className={classes.envVarContainer}>
        {envVars.map((envVar, index) => (
          <Box key={index} className={classes.envVarPair}>
            <TextField
              className={classes.keyInput}
              placeholder="e.g. CLIENT_KEY"
              variant="outlined"
              size="small"
              value={envVar.key}
              onChange={(e) => handleEnvVarChange(index, 'key', e.target.value)}
              error={Boolean(errors?.[`env_${index}_key`])}
              helperText={errors?.[`env_${index}_key`]}
            />
            <TextField
              className={classes.valueInput}
              placeholder="Value"
              variant="outlined"
              size="small"
              value={envVar.value}
              onChange={(e) => handleEnvVarChange(index, 'value', e.target.value)}
              error={Boolean(errors?.[`env_${index}_value`])}
              helperText={errors?.[`env_${index}_value`]}
            />
            {envVars.length > 1 && (
              <IconButton
                className={classes.deleteButton}
                onClick={() => handleRemoveEnvVar(index)}
                size="small"
                disableRipple
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}
      </div>

      <Box
        className={classes.addButton}
        onClick={handleAddEnvVar}
        role="button"
        tabIndex={0}
      >
        <AddIcon className={classes.addIcon} />
        <Typography className={classes.addText}>Add Environment Variable</Typography>
      </Box>

      <Box className={classes.uploadSection}>
        <Typography variant="h6" gutterBottom>
          Upload .env File
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Or upload an existing .env file to automatically populate the variables
        </Typography>
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
          className={classes.uploadButton}
        >
          Upload .env File
          <input
            type="file"
            hidden
            accept=".env"
            onChange={handleFileUpload}
          />
        </Button>
      </Box>
    </div>
  );
};

export default ConfigureEnvironment;
