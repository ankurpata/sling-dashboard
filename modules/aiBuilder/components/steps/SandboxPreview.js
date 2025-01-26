import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Box,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  Paper,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Tooltip,
  IconButton,
  Tabs,
  Tab,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import {makeStyles} from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import CodeIcon from '@material-ui/icons/Code';
import RefreshIcon from '@material-ui/icons/Refresh';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {tomorrow} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  getFrameworkDefaults,
  supportedFrameworks,
} from '../../utils/frameworkDefaults';
import AuthDialog from '../AuthDialog';
import {useProject} from '../../context/ProjectContext';
import {useUser} from '../../context/UserContext';
import {updateBuildSettings} from '../../services/projectService';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  section: {
    padding: theme.spacing(3),
    margin: '22px 12px',
    borderRadius: theme.shape.borderRadius,
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: 500,
    marginBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  input: {
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
  switchContainer: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    justifyContent: 'space-between',
  },
  formControl: {
    minWidth: 200,
    '& .MuiOutlinedInput-root': {
      fontSize: '1.1rem',
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
      },
      '&:hover fieldset': {
        borderColor: '#000',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#000',
      },
    },
    '& .MuiInputLabel-outlined': {
      fontSize: '1.1rem',
    },
  },
  settingRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    '& .MuiFormControlLabel-root': {
      minWidth: 250,
    },
  },
  settingField: {
    flex: 1,
    marginLeft: theme.spacing(3),
    '& .MuiOutlinedInput-root': {
      fontSize: '1.1rem',
    },
  },
  infoIcon: {
    fontSize: '1.2rem',
    marginLeft: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  jsonEditor: {
    fontFamily: 'monospace',
    fontSize: '14px',
  },
  tabs: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    marginBottom: theme.spacing(3),
    '& .MuiTab-root': {
      fontSize: '1.1rem',
      textTransform: 'none',
      minWidth: 100,
      padding: theme.spacing(2, 3),
    },
    '& .Mui-selected': {
      color: '#000',
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#000',
    },
  },
  previewSection: {
    marginTop: theme.spacing(3),
  },
  codePreview: {
    marginTop: theme.spacing(2),
    '& pre': {
      margin: 0,
      borderRadius: theme.shape.borderRadius,
    },
  },
  select: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      backgroundColor: '#fff',
      height: 60,
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
    },
    '& .MuiSelect-select': {
      padding: '4px 14px',
      height: 40,
      lineHeight: '40px',
    },
    '& .MuiOutlinedInput-input': {
      padding: '4px 14px',
    },
  },
  menuItem: {
    minHeight: 32,
    '&:hover': {
      backgroundColor: 'rgba(37, 99, 235, 0.08)',
    },
    '&.Mui-selected': {
      backgroundColor: 'rgba(37, 99, 235, 0.12)',
      '&:hover': {
        backgroundColor: 'rgba(37, 99, 235, 0.16)',
      },
    },
  },
}));

const frameworks = supportedFrameworks
  .filter((name) =>
    ['Next.js', 'React', 'Angular', 'Vue.js', 'Unsupported Framework'].includes(
      name,
    ),
  )
  .map((name) => ({
    id: name,
    name: name,
  }));

const nodeVersions = [
  '20.x', // Iron (Current)
  '18.x', // Hydrogen (Active LTS)
  '16.x', // Gallium (Maintenance)
  '14.x', // Fermium (End-of-life)
];
const regions = ['all', 'us-east-1', 'eu-west-1', 'ap-southeast-1'];

const SandboxPreview = forwardRef(({error}, ref) => {
  const classes = useStyles();
  const {currentProject} = useProject();
  const [activeTab, setActiveTab] = useState('form');
  const [config, setConfig] = useState({
    framework: '',
    buildCommand: '',
    startCommand: '',
    installCommand: '',
    outputDirectory: '',
    nodeVersion: '18.x',
    overrides: {
      buildCommand: false,
      outputDirectory: false,
      installCommand: false,
      developmentCommand: false,
    },
    rootDirectory: '',
    includeFiles: false,
    skipDeployment: false,
    region: 'all',
  });
  console.log(config, 'coniggg');

  // Initialize config from project's buildSettings
  useEffect(() => {
    if (currentProject?.buildSettings) {
      const settings = currentProject.buildSettings;
      setConfig((prev) => ({
        ...prev,
        framework: settings.framework || '',
        buildCommand: settings.buildCommand || '',
        startCommand: settings.startCommand || '',
        installCommand: settings.installCommand || '',
        outputDirectory: settings.outputDirectory || '',
        nodeVersion: settings.nodeVersion || '18.x',
        rootDirectory: settings.rootDirectory || '',
        includeFiles: settings.includeFiles || false,
        skipDeployment: settings.skipDeployment || false,
        region: settings.region || 'all',
        overrides: {
          buildCommand: !!settings.buildCommand,
          outputDirectory: !!settings.outputDirectory,
          installCommand: !!settings.installCommand,
          developmentCommand: !!settings.startCommand,
        },
      }));
    }
  }, [currentProject?.buildSettings]);

  const [jsonConfig, setJsonConfig] = useState('');
  const [jsonError, setJsonError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [detectedFramework, setDetectedFramework] = useState('');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const {user} = useUser();

  useImperativeHandle(ref, () => ({
    handleSave: async () => {
      if (!currentProject?._id) {
        return false;
      }

      try {
        setLoading(true);

        const settings = {
          framework: config.framework || '',
          buildCommand: config.overrides.buildCommand
            ? config.buildCommand
            : undefined,
          outputDirectory: config.overrides.outputDirectory
            ? config.outputDirectory
            : undefined,
          installCommand: config.overrides.installCommand
            ? config.installCommand
            : undefined,
          developmentCommand: config.overrides.developmentCommand
            ? config.developmentCommand
            : undefined,
          rootDirectory: config.rootDirectory || undefined,
          nodeVersion: config.nodeVersion || '18.x',
          includeFiles: config.includeFiles ? ['**/*'] : undefined,
          skipDeployment: config.skipDeployment,
          region: config.region === 'all' ? undefined : [config.region],
        };

        await updateBuildSettings(currentProject._id, settings);

        // Update project in context with new settings
        setProject({
          ...currentProject,
          buildSettings: settings,
        });

        return true;
      } catch (error) {
        console.error('Error updating build settings:', error);
        return false;
      } finally {
        setLoading(false);
      }
    },
  }));

  useEffect(() => {
    setJsonConfig(generateVercelConfig());
  }, [config]);

  useEffect(() => {
    // Update JSON when form changes
    const newJson = generateVercelConfig();
    if (newJson !== jsonConfig) {
      setJsonConfig(newJson);
    }
  }, [config]);

  const handleFrameworkChange = (frameworkId) => {
    const frameworkName = frameworks.find((f) => f.id === frameworkId)?.name;
    const defaults = getFrameworkDefaults(frameworkName);

    if (defaults) {
      handleConfigChange('framework', frameworkId);
      handleConfigChange('buildCommand', defaults.buildCommand);
      handleConfigChange('outputDirectory', defaults.outputDirectory);
      handleConfigChange('installCommand', defaults.installCommand);
      handleConfigChange('developmentCommand', defaults.devCommand);
      handleConfigChange('nodeVersion', defaults.nodeVersion);
    } else {
      handleConfigChange('framework', frameworkId);
    }
  };

  const handleToggleOverride = (field) => {
    setConfig((prev) => ({
      ...prev,
      overrides: {
        ...prev.overrides,
        [field]: !prev.overrides[field],
      },
    }));
  };

  const handleConfigChange = (field, value) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateVercelConfig = () => {
    const vercelConfig = {
      framework: config.framework || undefined,
      buildCommand: config.overrides.buildCommand
        ? config.buildCommand
        : undefined,
      outputDirectory: config.overrides.outputDirectory
        ? config.outputDirectory
        : undefined,
      installCommand: config.overrides.installCommand
        ? config.installCommand
        : undefined,
      devCommand: config.overrides.developmentCommand
        ? config.developmentCommand
        : undefined,
      rootDirectory: config.rootDirectory || undefined,
      build: {
        env: {
          NODE_VERSION: config.nodeVersion,
        },
      },
      git: {
        deploymentEnabled: !config.skipDeployment,
      },
      regions: config.region === 'all' ? undefined : [config.region],
      includeFiles: config.includeFiles ? ['**/*'] : undefined,
    };

    // Remove undefined values for cleaner JSON
    return JSON.stringify(
      vercelConfig,
      (k, v) => (v === undefined ? undefined : v),
      2,
    );
  };

  const handleJsonChange = (newJson) => {
    try {
      // First validate if it's a valid JSON string
      if (!newJson.trim()) {
        setJsonError('JSON cannot be empty');
        return;
      }

      // Try to parse the JSON
      const parsed = JSON.parse(newJson);

      // Update the form state with the new values
      const updatedConfig = {
        ...config,
        framework: parsed.framework || '',
        buildCommand: parsed.buildCommand || '',
        outputDirectory: parsed.outputDirectory || '',
        installCommand: parsed.installCommand || '',
        developmentCommand: parsed.devCommand || '',
        rootDirectory: parsed.rootDirectory || '',
        nodeVersion: parsed.build?.env?.NODE_VERSION || '18.x',
        includeFiles: Boolean(parsed.includeFiles),
        skipDeployment: !parsed.git?.deploymentEnabled,
        region: parsed.regions?.[0] || 'all',
        overrides: {
          buildCommand: Boolean(parsed.buildCommand),
          outputDirectory: Boolean(parsed.outputDirectory),
          installCommand: Boolean(parsed.installCommand),
          developmentCommand: Boolean(parsed.devCommand),
        },
      };

      setConfig(updatedConfig);
      setJsonConfig(newJson);
      setJsonError(null);
    } catch (error) {
      setJsonError(`Invalid JSON format: ${error.message}`);
    }
  };

  const handleInputSubmit = async (e) => {
    if (e.key === 'Enter') {
      if (!user) {
        setShowAuthDialog(true);
        return;
      }

      // Existing input handling code
      if (inputValue.trim()) {
        setIsProcessing(true);
        setShowCanvas(true);
        // Rest of the code...
      }
    }
  };

  return (
    <Box className={classes.root}>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        className={classes.tabs}>
        <Tab value='form' label='Form View' />
        <Tab value='json' label='JSON View' />
      </Tabs>

      {activeTab === 'form' ? (
        <>
          <Paper className={classes.section}>
            <Typography className={classes.sectionTitle}>
              Framework
              <Tooltip title='Select the framework for your project'>
                <InfoIcon className={classes.infoIcon} />
              </Tooltip>
            </Typography>
            <FormControl className={classes.select} fullWidth>
              <InputLabel>Framework</InputLabel>
              <Select
                value={config.framework}
                onChange={(e) => handleFrameworkChange(e.target.value)}
                variant='outlined'
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                  getContentAnchorEl: null,
                  PaperProps: {
                    elevation: 3,
                    style: {
                      borderRadius: 8,
                      marginTop: 8,
                    },
                  },
                }}>
                {frameworks.map((framework) => (
                  <MenuItem
                    key={framework.id}
                    value={framework.id}
                    className={classes.menuItem}>
                    {framework.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {detectedFramework && (
              <Typography variant='body2' color='textSecondary'>
                Detected Framework: {detectedFramework}
              </Typography>
            )}
          </Paper>

          <Paper className={classes.section}>
            <Typography className={classes.sectionTitle}>
              Build Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box className={classes.row} display="flex" alignItems="center" justifyContent="space-between">
                  <Box className={classes.labelContainer} style={{width: '20%'}}>
                    <Typography variant='subtitle1'>Build Command</Typography>
                    <Typography
                      variant='body2'
                      color='textSecondary'
                      className={classes.description}>
                      Command to build your application
                    </Typography>
                  </Box>
                  <Box style={{width: '50%'}}>
                    <TextField
                      fullWidth
                      className={classes.input}
                      variant='outlined'
                      value={config.buildCommand}
                      onChange={(e) =>
                        handleConfigChange('buildCommand', e.target.value)
                      }
                      placeholder='next build'
                      disabled={!config.overrides.buildCommand}
                      InputLabelProps={{shrink: false}}
                      InputProps={{
                        notched: false,
                      }}
                    />
                  </Box>
                  <Box display="flex" alignItems="center" style={{width: '20%'}}>
                    <Typography variant="body2" color="textSecondary" style={{marginRight: 8}}>
                      Override
                    </Typography>
                    <Switch
                      checked={config.overrides.buildCommand}
                      onChange={() => handleToggleOverride('buildCommand')}
                      color='primary'
                      size='small'
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box className={classes.row} display="flex" alignItems="center" justifyContent="space-between">
                  <Box className={classes.labelContainer} style={{width: '20%'}}>
                    <Typography variant='subtitle1'>Start Command</Typography>
                    <Typography
                      variant='body2'
                      color='textSecondary'
                      className={classes.description}>
                      Command to start your application
                    </Typography>
                  </Box>
                  <Box style={{width: '50%'}}>
                    <TextField
                      fullWidth
                      className={classes.input}
                      variant='outlined'
                      value={config.startCommand}
                      onChange={(e) =>
                        handleConfigChange('startCommand', e.target.value)
                      }
                      placeholder='next start'
                      disabled={!config.overrides.developmentCommand}
                      InputLabelProps={{shrink: false}}
                      InputProps={{
                        notched: false,
                      }}
                    />
                  </Box>
                  <Box display="flex" alignItems="center" style={{width: '20%'}}>
                    <Typography variant="body2" color="textSecondary" style={{marginRight: 8}}>
                      Override
                    </Typography>
                    <Switch
                      checked={config.overrides.developmentCommand}
                      onChange={() => handleToggleOverride('developmentCommand')}
                      color='primary'
                      size='small'
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box className={classes.row} display="flex" alignItems="center" justifyContent="space-between">
                  <Box className={classes.labelContainer} style={{width: '20%'}}>
                    <Typography variant='subtitle1'>Install Command</Typography>
                    <Typography
                      variant='body2'
                      color='textSecondary'
                      className={classes.description}>
                      Command to install dependencies
                    </Typography>
                  </Box>
                  <Box style={{width: '50%'}}>
                    <TextField
                      fullWidth
                      className={classes.input}
                      variant='outlined'
                      value={config.installCommand}
                      onChange={(e) =>
                        handleConfigChange('installCommand', e.target.value)
                      }
                      placeholder='npm install'
                      disabled={!config.overrides.installCommand}
                      InputLabelProps={{shrink: false}}
                      InputProps={{
                        notched: false,
                      }}
                    />
                  </Box>
                  <Box display="flex" alignItems="center" style={{width: '20%'}}>
                    <Typography variant="body2" color="textSecondary" style={{marginRight: 8}}>
                      Override
                    </Typography>
                    <Switch
                      checked={config.overrides.installCommand}
                      onChange={() => handleToggleOverride('installCommand')}
                      color='primary'
                      size='small'
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box className={classes.row} display="flex" alignItems="center" justifyContent="space-between">
                  <Box className={classes.labelContainer} style={{width: '20%'}}>
                    <Typography variant='subtitle1'>Output Directory</Typography>
                    <Typography
                      variant='body2'
                      color='textSecondary'
                      className={classes.description}>
                      Directory containing the build output
                    </Typography>
                  </Box>
                  <Box style={{width: '50%'}}>
                    <TextField
                      fullWidth
                      className={classes.input}
                      variant='outlined'
                      value={config.outputDirectory}
                      onChange={(e) =>
                        handleConfigChange('outputDirectory', e.target.value)
                      }
                      placeholder='.next'
                      disabled={!config.overrides.outputDirectory}
                      InputLabelProps={{shrink: false}}
                      InputProps={{
                        notched: false,
                      }}
                    />
                  </Box>
                  <Box display="flex" alignItems="center" style={{width: '20%'}}>
                    <Typography variant="body2" color="textSecondary" style={{marginRight: 8}}>
                      Override
                    </Typography>
                    <Switch
                      checked={config.overrides.outputDirectory}
                      onChange={() => handleToggleOverride('outputDirectory')}
                      color='primary'
                      size='small'
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper className={classes.section}>
            <Typography variant='h6' gutterBottom>
              Advanced Settings
              <Tooltip title='Configure advanced deployment settings'>
                <InfoIcon className={classes.infoIcon} />
              </Tooltip>
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography variant='subtitle2' gutterBottom>
                  Node.js Version
                </Typography>
                <Select
                  className={classes.select}
                  value={config.nodeVersion}
                  onChange={(e) =>
                    handleConfigChange('nodeVersion', e.target.value)
                  }
                  variant='outlined'
                  fullWidth
                  MenuProps={{
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                    getContentAnchorEl: null,
                    PaperProps: {
                      elevation: 3,
                      style: {
                        borderRadius: 8,
                        marginTop: 8,
                      },
                    },
                  }}>
                  {nodeVersions.map((version) => (
                    <MenuItem
                      key={version}
                      value={version}
                      className={classes.menuItem}>
                      {version}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={6}>
                <Typography variant='subtitle2' gutterBottom>
                  Deployment Region
                </Typography>
                <Select
                  className={classes.select}
                  value={config.region}
                  onChange={(e) => handleConfigChange('region', e.target.value)}
                  disabled={true}
                  variant='outlined'
                  fullWidth
                  MenuProps={{
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                    getContentAnchorEl: null,
                    PaperProps: {
                      elevation: 3,
                      style: {
                        borderRadius: 8,
                        marginTop: 8,
                      },
                    },
                  }}>
                  {regions.map((region) => (
                    <MenuItem
                      key={region}
                      value={region}
                      className={classes.menuItem}>
                      {region === 'all' ? 'All Regions' : region}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle2' gutterBottom>
                  Root Directory
                </Typography>
                <TextField
                  className={classes.input}
                  variant='outlined'
                  fullWidth
                  value={config.rootDirectory || ''}
                  onChange={(e) =>
                    handleConfigChange('rootDirectory', e.target.value)
                  }
                  placeholder='.'
                  InputLabelProps={{shrink: false}}
                  InputProps={{
                    notched: false,
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Box className={classes.previewSection}>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
              mb={2}>
              <Typography variant='h6'>vercel.json Preview</Typography>
              <Button
                startIcon={showPreview ? <CodeIcon /> : <CodeIcon />}
                onClick={() => setShowPreview(!showPreview)}
                color='primary'>
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </Box>
            {showPreview && (
              <Box className={classes.codePreview}>
                <SyntaxHighlighter
                  language='json'
                  style={tomorrow}
                  customStyle={{
                    backgroundColor: '#1a1a1a',
                  }}>
                  {generateVercelConfig()}
                </SyntaxHighlighter>
              </Box>
            )}
          </Box>
        </>
      ) : (
        <Paper className={classes.section}>
          <Typography variant='subtitle1' gutterBottom>
            Edit vercel.json Configuration
          </Typography>
          <Typography variant='body2' color='textSecondary' gutterBottom>
            You can directly edit the vercel.json configuration here. Changes
            will be reflected in the form view.
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={20}
            maxRows={20}
            variant='outlined'
            value={jsonConfig}
            onChange={(e) => handleJsonChange(e.target.value)}
            error={Boolean(jsonError)}
            helperText={jsonError}
            InputProps={{
              className: classes.jsonEditor,
              spellCheck: false,
            }}
          />
          {jsonError && (
            <Box mt={1}>
              <Alert severity='error'>{jsonError}</Alert>
            </Box>
          )}
          <Box mt={2}>
            <Button
              variant='outlined'
              color='primary'
              onClick={() => {
                try {
                  const formatted = JSON.stringify(
                    JSON.parse(jsonConfig),
                    null,
                    2,
                  );
                  handleJsonChange(formatted);
                } catch (error) {
                  setJsonError(`Could not format JSON: ${error.message}`);
                }
              }}>
              Format JSON
            </Button>
          </Box>
        </Paper>
      )}
      <AuthDialog
        open={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />
    </Box>
  );
});

export default SandboxPreview;
