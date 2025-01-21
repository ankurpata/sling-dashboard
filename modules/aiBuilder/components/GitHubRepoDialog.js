import React, { useState, useEffect } from 'react';
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
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import SelectRepository from './steps/SelectRepository';
import ConfigureEnvironment from './steps/ConfigureEnvironment';
import ReviewAndSave from './steps/ReviewAndSave';

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    borderRadius: 8,
    padding: theme.spacing(2),
    minHeight: 600,
  },
  stepper: {
    backgroundColor: 'transparent',
    '& .MuiStepConnector-line': {
      minHeight: 40,
      marginLeft: 12,
    },
  },
  stepContent: {
    marginTop: 8,
    marginLeft: theme.spacing(4),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    borderLeft: `1px solid ${theme.palette.divider}`,
  },
  stepLabel: {
    '& .MuiStepLabel-iconContainer': {
      paddingRight: theme.spacing(2),
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
    label: 'Review and Save',
    description: 'Review your selections and save',
  },
];

const GitHubRepoDialog = ({ open, onClose, onSelect }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [repositories, setRepositories] = useState(() => {
    const savedRepos = localStorage.getItem('repositories');
    return savedRepos ? JSON.parse(savedRepos) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [envVars, setEnvVars] = useState([{ key: '', value: '' }]);
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
    setEnvVars([{ key: '', value: '' }]);
    setErrors({});
    onClose();
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedRepo) {
      setErrors({ repo: 'Please select a repository' });
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
    const validEnvVars = envVars.filter(env => env.key && env.value);
    onSelect({
      ...selectedRepo,
      environmentVariables: validEnvVars,
    });
    handleClose();
  };

  const handleEnvVarChange = (index, field, value) => {
    const newEnvVars = [...envVars];
    newEnvVars[index] = { ...newEnvVars[index], [field]: value };
    setEnvVars(newEnvVars);
  };

  const handleEnvVarAdd = () => {
    setEnvVars([...envVars, { key: '', value: '' }]);
  };

  const handleEnvVarRemove = (index) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const handleEnvFileUpload = (content) => {
    const vars = content
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .map(line => {
        const [key, ...valueParts] = line.split('=');
        return {
          key: key.trim(),
          value: valueParts.join('=').trim(),
        };
      });
    setEnvVars(vars.length > 0 ? vars : [{ key: '', value: '' }]);
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
          <ReviewAndSave
            selectedRepo={selectedRepo}
            envVars={envVars}
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
        className: classes.dialogPaper
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Configure Repository</Typography>
          {activeStep > 0 && (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setActiveStep(0)}
              color="primary"
            >
              Back to Repositories
            </Button>
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical" className={classes.stepper}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel classes={{ label: classes.stepLabel }}>
                <Typography variant="subtitle1">{step.label}</Typography>
                <Typography variant="caption" color="textSecondary">
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
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack}>
            Back
          </Button>
        )}
        {activeStep === steps.length - 1 ? (
          <Button
            onClick={handleFinish}
            variant="contained"
            color="primary"
          >
            Finish
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            variant="contained"
            color="primary"
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default GitHubRepoDialog;
