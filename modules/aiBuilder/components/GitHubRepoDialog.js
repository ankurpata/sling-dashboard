import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import SelectRepository from './steps/SelectRepository';
import ConfigureEnvironment from './steps/ConfigureEnvironment';
import SandboxPreview from './steps/SandboxPreview';
import ReviewAndSave from './steps/ReviewAndSave';

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    borderRadius: 8,
    padding: theme.spacing(3),
    maxWidth: '1000px',
    width: '90vw',
  },
  stepper: {
    backgroundColor: 'transparent',
    '& .MuiStepConnector-line': {
      minHeight: 50,
      marginLeft: 16,
      borderLeftWidth: 2,
    },
    '& .MuiStepIcon-root': {
      width: 32,
      height: 32,
      color: '#000',
      '&.MuiStepIcon-active': {
        color: '#000',
      },
      '&.MuiStepIcon-completed': {
        color: '#000',
      },
    },
    '& .MuiStepLabel-label': {
      fontSize: '1.1rem',
      '&.MuiStepLabel-active': {
        color: '#000',
      },
      '&.MuiStepLabel-completed': {
        color: '#000',
      },
    },
  },
  stepContent: {
    marginTop: 16,
    marginLeft: '28px',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    borderLeft: `2px solid #000`,
  },
  stepLabel: {
    '& .MuiStepLabel-iconContainer': {
      paddingRight: theme.spacing(3),
    },
    '& .MuiTypography-subtitle1': {
      fontSize: '1.2rem',
      fontWeight: 500,
      marginBottom: theme.spacing(1),
    },
    '& .MuiTypography-caption': {
      fontSize: '1rem',
      color: theme.palette.text.secondary,
    },
  },
  backButton: {
    marginRight: theme.spacing(2),
    color: '#000',
    borderColor: '#000',
    '&:hover': {
      borderColor: '#000',
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  nextButton: {
    backgroundColor: '#000',
    color: '#fff',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
  },
  dialogTitle: {
    '& .MuiTypography-h6': {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
  },
}));

const steps = [
  {
    label: 'Select Repository',
    description: 'Choose a repository to connect',
  },
  {
    label: 'Configure Environment',
    description: 'Set up environment variables',
  },
  {
    label: 'Sandbox Preview',
    description: 'Configure build and development settings',
  },
  {
    label: 'Review and Save',
    description: 'Review your selections and save',
  },
];

const GitHubRepoDialog = ({open, onClose, onSelect}) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [repositories, setRepositories] = useState(() => {
    const savedRepos = localStorage.getItem('repositories');
    return savedRepos ? JSON.parse(savedRepos) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [envVars, setEnvVars] = useState([{key: '', value: ''}]);
  const [sandboxConfig, setSandboxConfig] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchRepositories = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/github/repositories');
        setRepositories(response.data);
        localStorage.setItem('repositories', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
      setLoading(false);
    };

    if (open && repositories.length === 0) {
      fetchRepositories();
    }
  }, [open]);

  const handleClose = () => {
    setActiveStep(0);
    setSearchQuery('');
    setSelectedRepo(null);
    setEnvVars([{key: '', value: ''}]);
    setSandboxConfig(null);
    setErrors({});
    onClose();
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedRepo) {
      setErrors({repo: 'Please select a repository'});
      return;
    }

    if (activeStep === 1) {
      const newErrors = {};
      envVars.forEach((env, index) => {
        if (env.key && !env.value) {
          newErrors[`env_${index}_value`] = 'Value is required';
        }
        if (env.value && !env.key) {
          newErrors[`env_${index}_key`] = 'Key is required';
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    setErrors({});
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFinish = () => {
    const validEnvVars = envVars.filter((env) => env.key && env.value);
    onSelect({
      ...selectedRepo,
      environmentVariables: validEnvVars,
      sandboxConfig,
    });
    handleClose();
  };

  const handleEnvVarChange = (index, field, value) => {
    const newEnvVars = [...envVars];
    newEnvVars[index] = {...newEnvVars[index], [field]: value};
    setEnvVars(newEnvVars);
  };

  const handleEnvVarAdd = () => {
    setEnvVars([...envVars, {key: '', value: ''}]);
  };

  const handleEnvVarRemove = (index) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const handleEnvFileUpload = (content) => {
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

  const handleSandboxConfigChange = (config) => {
    setSandboxConfig(config);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <SelectRepository
            loading={loading}
            repositories={repositories}
            selectedRepo={selectedRepo}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRepoSelect={setSelectedRepo}
            error={errors.repo}
          />
        );
      case 1:
        return (
          <ConfigureEnvironment
            envVars={envVars}
            onEnvVarChange={handleEnvVarChange}
            onEnvVarAdd={handleEnvVarAdd}
            onEnvVarRemove={handleEnvVarRemove}
            onEnvFileUpload={handleEnvFileUpload}
            errors={errors}
          />
        );
      case 2:
        return (
          <SandboxPreview
            repository={selectedRepo}
            onConfigChange={handleSandboxConfigChange}
          />
        );
      case 3:
        return (
          <ReviewAndSave
            selectedRepo={selectedRepo}
            envVars={envVars}
            sandboxConfig={sandboxConfig}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='md'
      fullWidth
      PaperProps={{
        className: classes.dialogPaper,
      }}>
      <DialogTitle className={classes.dialogTitle}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>Configure Repository</Typography>
          {activeStep > 0 && (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setActiveStep(0)}
              color='primary'>
              Back to Repositories
            </Button>
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stepper
          activeStep={activeStep}
          orientation='vertical'
          className={classes.stepper}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel classes={{label: classes.stepLabel}}>
                <Typography variant='subtitle1'>{step.label}</Typography>
                <Typography variant='caption' color='textSecondary'>
                  {step.description}
                </Typography>
              </StepLabel>
              <StepContent className={classes.stepContent}>
                {getStepContent(index)}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>
      <DialogActions style={{justifyContent: 'space-between'}}>
        <Box>
          <Button onClick={handleClose}>Cancel</Button>
        </Box>
        <Box>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant='outlined'
            className={classes.backButton}>
            Back
          </Button>
          <Button
            variant='contained'
            className={classes.nextButton}
            onClick={
              activeStep === steps.length - 1 ? handleFinish : handleNext
            }>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>{' '}
      </DialogActions>
    </Dialog>
  );
};

export default GitHubRepoDialog;
