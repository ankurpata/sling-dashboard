import React, {useState, useEffect, useContext, useRef} from 'react';
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
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {makeStyles} from '@material-ui/core/styles';
import {fetchRepositories} from '../services/repositoryService';
import {
  createProject,
  updateEnvironmentVariables,
  updateBuildSettings,
} from '../services/projectService';
import {useProject} from '../context/ProjectContext';

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

const GitHubRepoDialog = ({open, onClose, onSelect, userId, initialRepo}) => {
  const classes = useStyles();
  const {currentProject, setProject} = useProject();
  const [activeStep, setActiveStep] = useState(() => {
    // Initialize from localStorage if exists
    const savedStep = localStorage.getItem(
      `project_step_${currentProject?._id}`,
    );
    return savedStep ? parseInt(savedStep, 10) : 0;
  });
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(initialRepo || null);
  const configEnvRef = useRef();
  const sandboxRef = useRef();
  const [sandboxConfig, setSandboxConfig] = useState(null);
  const [stepErrors, setStepErrors] = useState({
    0: null,
    1: null,
    2: null,
    3: null,
  });
  const [stepWarnings, setStepWarnings] = useState({
    0: null,
    1: null,
    2: null,
    3: null,
  });

  // Reset errors when moving between steps
  const clearStepError = (step) => {
    setStepErrors((prev) => ({...prev, [step]: null}));
  };

  // Set error for current step
  const setStepError = (step, error) => {
    setStepErrors((prev) => ({...prev, [step]: error}));
    setStepWarnings((prev) => ({...prev, [step]: null})); // Clear warning when setting error
  };

  // Set warning for current step
  const setStepWarning = (step, warning) => {
    setStepWarnings((prev) => ({...prev, [step]: warning}));
    setStepErrors((prev) => ({...prev, [step]: null})); // Clear error when setting warning
  };

  // Reset selected repo when dialog opens with initialRepo
  useEffect(() => {
    if (open && initialRepo) {
      setSelectedRepo(initialRepo);
    }
  }, [open, initialRepo]);

  // Load repositories when dialog opens
  useEffect(() => {
    const loadRepositories = async () => {
      try {
        setLoading(true);
        const data = await fetchRepositories(userId);
        if (data && Array.isArray(data)) {
          setRepositories(data);
        } else {
          setStepError(0, 'No repositories found');
        }
      } catch (error) {
        console.error('Error fetching repositories:', error);
        setStepError(0, 'Failed to fetch repositories');
      } finally {
        setLoading(false);
      }
    };

    if (open && userId) {
      loadRepositories();
    }
  }, [open, userId]);

  // Show warning if project exists and opened from home
  useEffect(() => {
    if (open && currentProject?._id && !selectedRepo) {
      setStepWarning(
        0,
        'Warning: You already have an active project. Selecting a new one repo will replace it.',
      );
    } else {
      setStepWarning(0, null);
    }
  }, [open, currentProject, selectedRepo]);

  const handleRepoSelect = async (repo) => {
    if (!repo) {
      setSelectedRepo(null);
      return;
    }

    try {
      setLoading(true);
      setSelectedRepo(repo);

      const createdProject = await createProject({
        repoId: repo.repoId,
        name: repo.name,
        full_name: repo.fullName,
        private: repo.private,
        html_url: repo.htmlUrl,
        language: repo.language,
        default_branch: repo.defaultBranch || 'main',
        organization: repo.organization,
        orgId: repo.orgId,
        userId,
      });

      setProject(createdProject);
      // Remove onSelect call to prevent dialog from closing
    } catch (error) {
      console.error('Error creating project:', error);
      setStepError(0, error.message || 'Failed to create project');
      setSelectedRepo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    clearStepError(activeStep);

    if (activeStep === 0) {
      if (!selectedRepo) {
        setStepError(0, 'Please select a repository');
        return;
      }
      setActiveStep((prevActiveStep) => {
        const newStep = prevActiveStep + 1;
        // Save to localStorage when moving forward
        if (currentProject?._id) {
          localStorage.setItem(
            `project_step_${currentProject._id}`,
            newStep.toString(),
          );
        }
        return newStep;
      });
    } else if (activeStep === 1) {
      if (!currentProject?._id) {
        setStepError(1, 'No active project found');
        return;
      }

      try {
        setLoading(true);
        // Call ConfigureEnvironment's handleSave
        const success = await configEnvRef.current?.handleSave();
        if (success) {
          setActiveStep((prevActiveStep) => {
            const newStep = prevActiveStep + 1;
            localStorage.setItem(
              `project_step_${currentProject._id}`,
              newStep.toString(),
            );
            return newStep;
          });
        }
      } catch (error) {
        console.error('Error updating environment variables:', error);
        setStepError(
          1,
          error.message || 'Failed to update environment variables',
        );
      } finally {
        setLoading(false);
      }
    } else if (activeStep === 2) {
      if (!currentProject?._id) {
        setStepError(2, 'No active project found');
        return;
      }

      try {
        setLoading(true);
        const success = await sandboxRef.current?.handleSave();
        if (success) {
          setActiveStep((prevActiveStep) => {
            const newStep = prevActiveStep + 1;
            localStorage.setItem(
              `project_step_${currentProject._id}`,
              newStep.toString(),
            );
            return newStep;
          });
        }
      } catch (error) {
        console.error('Error updating build settings:', error);
        setStepError(2, error.message || 'Failed to update build settings');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => {
      const newStep = prevStep - 1;
      if (currentProject?._id) {
        localStorage.setItem(
          `project_step_${currentProject._id}`,
          newStep.toString(),
        );
      }
      return newStep;
    });
  };

  const handleClose = () => {
    setActiveStep(0);
    setSelectedRepo(null);
    setSandboxConfig(null);
    setStepErrors({
      0: null,
      1: null,
      2: null,
      3: null,
    });
    setStepWarnings({
      0: null,
      1: null,
      2: null,
      3: null,
    });
    // Clear step from localStorage when closing
    if (currentProject?._id) {
      localStorage.removeItem(`project_step_${currentProject._id}`);
    }
    onClose();
  };

  const handleFinish = () => {
    const config = {
      ...selectedRepo,
      branch: selectedRepo.default_branch || 'main',
      framework: sandboxConfig?.framework || 'Next.js',
    };
    onSelect(config);
    localStorage.setItem('selectedRepository', JSON.stringify(config));
    handleClose();
  };

  const steps = [
    {
      label: 'Select Repository',
      description: selectedRepo ? `Selected Repository: ${selectedRepo.name}` : 'Choose a repository to connect',
      content: (
        <SelectRepository
          repositories={repositories}
          selectedRepo={selectedRepo}
          onSelect={handleRepoSelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          loading={loading}
          error={stepErrors[0]}
        />
      ),
    },
    {
      label: 'Configure Environment',
      description: 'Set up environment variables',
      content: (
        <ConfigureEnvironment ref={configEnvRef} error={stepErrors[1]} />
      ),
    },
    {
      label: 'Sandbox Preview',
      description: 'Configure sandbox settings',
      content: <SandboxPreview ref={sandboxRef} error={stepErrors[2]} />,
    },
    {
      label: 'Review and Save',
      description: 'Review your configuration',
      content: (
        <ReviewAndSave
          repository={selectedRepo}
          sandboxConfig={sandboxConfig}
          error={stepErrors[3]}
        />
      ),
    },
  ];

  const getStepContent = (step) => {
    return steps[step]?.content || null;
  };

  const getStepTitle = (step) => {
    return steps[step]?.label || '';
  };

  const getStepDescription = (step) => {
    return steps[step]?.description || '';
  };

  const getStepButtonText = (step) => {
    if (step === 1) {
      return 'Save and Next';
    } else if (step === 2) {
      return 'Build and Deploy';
    }
    return 'Next';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      classes={{paper: classes.dialogPaper}}
      disableEscapeKeyDown>
      <DialogTitle className={classes.dialogTitle}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>Configure Repository</Typography>
            {activeStep > 0 && (
              <Button
                startIcon={<ArrowBackIcon />}
              onClick={() => {
                setActiveStep(0);
                setStepErrors({
                  0: null,
                  1: null,
                  2: null,
                  3: null,
                });
                setStepWarnings({
                  0: null,
                  1: null,
                  2: null,
                  3: null,
                });
              }}
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
              <StepLabel
                error={!!stepErrors[index]}
                classes={{label: classes.stepLabel}}>
                <Typography variant='subtitle1'>{step.label}</Typography>
                {stepErrors[index] && (
                  <Typography color='error' variant='caption' display='block'>
                    {stepErrors[index]}
                  </Typography>
                )}
                <Typography variant='caption' color='textSecondary'>
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
          <Button onClick={onClose}>Cancel</Button>
          {activeStep === 0 && selectedRepo && (
            <Button
              onClick={() => {
                onSelect(selectedRepo);
                localStorage.setItem(
                  'selectedRepository',
                  JSON.stringify({
                    name: selectedRepo.name,
                    branch: selectedRepo.default_branch || 'main',
                    framework: 'Next.js',
                  }),
                );
                onClose();
              }}
              color='primary'>
              Skip Preview Setup and move to Editing
            </Button>
          )}
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
            color='primary'
            className={classes.nextButton}
            onClick={
              activeStep === steps.length - 1 ? handleFinish : handleNext
            }
            disabled={activeStep === 0 && !selectedRepo}>
            {activeStep === steps.length - 1
              ? 'Finish'
              : getStepButtonText(activeStep)}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default GitHubRepoDialog;
