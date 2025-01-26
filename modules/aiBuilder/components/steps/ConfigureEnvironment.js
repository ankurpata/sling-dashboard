import React, {useState, forwardRef, useImperativeHandle} from 'react';
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
import {sanitizeEnvKey, isValidEnvKey} from '../../utils/validation';
import {updateEnvironmentVariables} from '../../services/projectService';
import {useProject} from '../../context/ProjectContext';

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
        borderWidth: '1px',
        top: 0,
      },
      '&:hover fieldset': {
        borderColor: '#B0B9C5',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2563EB',
      },
      '& input::placeholder': {
        opacity: 0.7,
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
        borderWidth: '1px',
        top: 0,
      },
      '&:hover fieldset': {
        borderColor: '#B0B9C5',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2563EB',
      },
      '& input::placeholder': {
        opacity: 0.7,
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
  errorMessage: {
    marginBottom: theme.spacing(2),
  },
}));

const ConfigureEnvironment = forwardRef(({error}, ref) => {
  const classes = useStyles();
  const {currentProject, setProject} = useProject();
  const [envVars, setEnvVars] = useState([{key: '', value: ''}]);
  const [loading, setLoading] = useState(false);
  const [localErrors, setLocalErrors] = useState({});

  useImperativeHandle(ref, () => ({
    handleSave: async () => {
      if (!currentProject?._id) {
        setLocalErrors((prev) => ({...prev, general: 'No active project found'}));
        return false;
      }

      try {
        setLoading(true);
        setLocalErrors({});

        // Validate env vars
        const invalidVars = envVars.filter(
          (env) => (env.key && !env.value) || (!env.key && env.value),
        );
        if (invalidVars.length > 0) {
          setLocalErrors((prev) => ({
            ...prev,
            general: 'All environment variables must have both key and value',
          }));
          return false;
        }

        // Convert env vars to object format
        const variables = envVars.reduce((acc, env) => {
          if (env.key && env.value) {
            acc[env.key] = env.value;
          }
          return acc;
        }, {});

        await updateEnvironmentVariables(currentProject._id, variables);
        
        // Update project in context with new env vars
        setProject({
          ...currentProject,
          environmentVariables: variables
        });
        
        return true;
      } catch (error) {
        setLocalErrors((prev) => ({
          ...prev,
          general: error.message || 'Failed to update environment variables',
        }));
        return false;
      } finally {
        setLoading(false);
      }
    }
  }));

  const handleKeyChange = (index) => (event) => {
    const rawValue = event.target.value;
    const sanitizedValue = sanitizeEnvKey(rawValue);

    // Only update if the sanitized value is different from the raw value
    if (sanitizedValue !== rawValue) {
      event.target.value = sanitizedValue;
    }

    // Update validation error
    setLocalErrors((prev) => ({
      ...prev,
      [index]: !isValidEnvKey(sanitizedValue) ? 'Invalid key format' : '',
    }));

    const newEnvVars = [...envVars];
    newEnvVars[index] = {...newEnvVars[index], key: sanitizedValue};
    setEnvVars(newEnvVars);
  };

  const handleValueChange = (index) => (event) => {
    const newEnvVars = [...envVars];
    newEnvVars[index] = {...newEnvVars[index], value: event.target.value};
    setEnvVars(newEnvVars);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const vars = content
          .split('\n')
          .filter((line) => line.trim() && !line.startsWith('#'))
          .map((line) => {
            const [key, ...valueParts] = line.split('=');
            return {
              key: key.trim(),
              value: valueParts.join('=').trim(),
            };
          });
        setEnvVars(vars.length > 0 ? vars : [{key: '', value: ''}]);
      };
      reader.readAsText(file);
    }
  };

  const handleAddEnvVar = () => {
    setEnvVars([...envVars, {key: '', value: ''}]);
  };

  const handleRemoveEnvVar = (index) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  return (
    <div className={classes.root}>
      {localErrors.general && (
        <Typography color='error' className={classes.errorMessage}>
          {localErrors.general}
        </Typography>
      )}
      <Box className={classes.header}></Box>

      <div className={classes.envVarContainer}>
        {envVars.map((env, index) => (
          <Box key={index} className={classes.envVarPair}>
            <TextField
              className={classes.keyInput}
              variant='outlined'
              value={env.key}
              onChange={handleKeyChange(index)}
              error={!!localErrors[index]}
              helperText={localErrors[index]}
              placeholder='e.g. CLIENT_KEY'
              InputLabelProps={{shrink: false}}
              InputProps={{
                endAdornment: (
                  <Tooltip title='Only letters, digits, and underscores allowed. Cannot start with a digit.'>
                    <InfoIcon color='action' fontSize='small' />
                  </Tooltip>
                ),
                notched: false,
              }}
            />
            <TextField
              className={classes.valueInput}
              variant='outlined'
              value={env.value}
              onChange={handleValueChange(index)}
              placeholder='Value'
              InputLabelProps={{shrink: false}}
              InputProps={{
                notched: false,
              }}
            />
            {envVars.length > 1 && (
              <IconButton
                className={classes.deleteButton}
                onClick={() => handleRemoveEnvVar(index)}
                size='small'
                disableRipple>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}
      </div>

      <Box
        className={classes.addButton}
        onClick={handleAddEnvVar}
        role='button'
        tabIndex={0}>
        <AddIcon className={classes.addIcon} />
        <Typography className={classes.addText}>
          Add Environment Variable
        </Typography>
      </Box>

      <Box className={classes.uploadSection}>
        <Typography variant='h6' gutterBottom>
          Upload .env File
        </Typography>
        <Typography variant='body1' color='textSecondary' gutterBottom>
          Or upload an existing .env file to automatically populate the
          variables
        </Typography>
        <Button
          variant='outlined'
          component='label'
          startIcon={<CloudUploadIcon />}
          className={classes.uploadButton}
          disabled={loading}>
          Select File
          <input type='file' hidden accept='.env' onChange={handleFileUpload} />
        </Button>
      </Box>
    </div>
  );
});

export default ConfigureEnvironment;
