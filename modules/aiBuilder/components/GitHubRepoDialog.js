import React, {useState, useEffect} from 'react';
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
  CircularProgress,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {fetchRepositories} from '../services/repositoryService';

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
    minHeight: '70vh',
    maxHeight: '90vh',
  },
  stepper: {
    backgroundColor: 'transparent',
    padding: 0,
    '& .MuiStepConnector-line': {
      minHeight: 50,
      // marginLeft: 16,
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
    '& .MuiStepContent-root': {
      borderLeft: `none`,
      marginLeft: 22,
      paddingLeft: theme.spacing(3),
    },
    '& .MuiStepLabel-root': {
      padding: theme.spacing(1, 0),
    },
    '& .MuiStepIcon-root': {
      color: theme.palette.grey[300],
      '&.MuiStepIcon-active': {
        color: 'black',
      },
      '&.MuiStepIcon-completed': {
        color: theme.palette.success.main,
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
    '& .MuiTypography-root': {
      margin: 0,
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
    marginRight: theme.spacing(1),
  },
  nextButton: {
    backgroundColor: '#000',
    color: '#fff',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    marginLeft: theme.spacing(1),
  },
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: 0,
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

const GitHubRepoDialog = ({
  open,
  onClose,
  onSelect,
  userId,
  initialRepo,
}) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(initialRepo || null);
  const [envVars, setEnvVars] = useState([{key: '', value: ''}]);
  const [sandboxConfig, setSandboxConfig] = useState(null);
  const [errors, setErrors] = useState({});

  // Reset selected repo when dialog opens with initialRepo
  useEffect(() => {
    if (open && initialRepo) {
      setSelectedRepo(initialRepo);
    }
  }, [open, initialRepo]);

  useEffect(() => {
    const loadRepositories = async () => {
      try {
        setLoading(true);
        const data = await fetchRepositories(userId);
        setRepositories(data);
      } catch (error) {
        console.error('Error fetching repositories:', error);
        setErrors({fetch: error.message || 'Failed to fetch repositories'});
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadRepositories();
    }
  }, [open, userId]);

  const handleNext = async () => {
    if (activeStep === 0) {
      if (!selectedRepo) {
        setErrors({repo: 'Please select a repository'});
        return;
      }

      // Store selected repo in localStorage but keep dialog open
      try {
        const repoConfig = {
          name: selectedRepo.name,
          branch: selectedRepo.defaultBranch || 'main',
          framework: sandboxConfig?.framework || 'Next.js',
        };
        localStorage.setItem('selectedRepository', JSON.stringify(repoConfig));
        // Don't close dialog, just move to next step
        setActiveStep((prevStep) => prevStep + 1);
      } catch (error) {
        console.error('Error storing repository selection:', error);
        setErrors({
          save: 'Failed to store repository selection',
        });
      }
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setErrors({});
  };

  const handleClose = () => {
    setActiveStep(0);
    setSearchQuery('');
    setSelectedRepo(null);
    setEnvVars([{key: '', value: ''}]);
    setSandboxConfig(null);
    setErrors({});
    onClose();
  };

  const handleFinish = () => {
    // Pass the complete configuration including env vars
    const config = {
      ...selectedRepo,
      branch: selectedRepo.defaultBranch || 'main',
      framework: sandboxConfig?.framework || 'Next.js',
      environmentVariables: envVars.filter(env => env.key && env.value),
    };
    onSelect(config);
    localStorage.setItem('selectedRepository', JSON.stringify(config));
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
            repositories={repositories}
            selectedRepo={selectedRepo}
            onRepoSelect={setSelectedRepo}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            loading={loading}
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
            envVars={envVars.filter(env => env.key && env.value)}
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
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: classes.dialogPaper,
      }}>
      <DialogTitle className={classes.dialogTitle}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Configure Repository</Typography>
          {activeStep > 0 && (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                setActiveStep(0);
                setErrors({});
              }}
              color="primary">
              Back to Repositories
            </Button>
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          className={classes.stepper}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel classes={{label: classes.stepLabel}}>
                <Typography variant="subtitle1">{step.label}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {step.description}
                </Typography>
              </StepLabel>
              <StepContent>{getStepContent(index)}</StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>
      <DialogActions style={{justifyContent: 'space-between'}}>
        <Box>
          <Button onClick={handleClose}>Cancel</Button>
          {activeStep === 0 && selectedRepo && (
            <Button
              onClick={() => {
                onSelect(selectedRepo);
                localStorage.setItem('selectedRepository', JSON.stringify({
                  name: selectedRepo.name,
                  branch: selectedRepo.defaultBranch || 'main',
                  framework: 'Next.js',
                }));
                handleClose();
              }}
              color="primary">
              Skip Preview Setup and move to Editing
            </Button>
          )}
        </Box>
        <Box>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            className={classes.backButton}>
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.nextButton}
            onClick={activeStep === steps.length - 1 ? handleFinish : handleNext}
            disabled={activeStep === 0 && !selectedRepo}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default GitHubRepoDialog;
