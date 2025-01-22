import React, { useState, useEffect } from 'react';
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
  Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import CodeIcon from '@material-ui/icons/Code';
import RefreshIcon from '@material-ui/icons/Refresh';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginBottom: theme.spacing(3),
    },
  },
  section: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  formControl: {
    minWidth: 200,
    marginBottom: theme.spacing(2),
  },
  settingRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    gap: theme.spacing(2),
  },
  settingField: {
    flex: 1,
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
  infoIcon: {
    marginLeft: theme.spacing(1),
    fontSize: 20,
    color: theme.palette.text.secondary,
  },
  toggleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
}));

const frameworks = [
  { id: 'nextjs', name: 'Next.js', buildCmd: 'next build', devCmd: 'next dev', installCmd: 'npm install', outputDir: '.next' },
  { id: 'react', name: 'React', buildCmd: 'react-scripts build', devCmd: 'react-scripts start', installCmd: 'npm install', outputDir: 'build' },
  { id: 'angular', name: 'Angular', buildCmd: 'ng build', devCmd: 'ng serve', installCmd: 'npm install', outputDir: 'dist' },
  { id: 'vue', name: 'Vue.js', buildCmd: 'vue-cli-service build', devCmd: 'vue-cli-service serve', installCmd: 'npm install', outputDir: 'dist' },
];

const nodeVersions = ['18.x', '16.x', '14.x', '12.x'];
const regions = ['all', 'us-east-1', 'eu-west-1', 'ap-southeast-1'];

const SandboxPreview = ({ repository, onConfigChange }) => {
  const classes = useStyles();
  const [config, setConfig] = useState({
    framework: '',
    buildCommand: '',
    outputDirectory: '',
    installCommand: '',
    developmentCommand: '',
    rootDirectory: '',
    nodeVersion: '18.x',
    includeFiles: false,
    skipDeployment: false,
    buildCache: true,
    region: 'all',
    overrides: {
      buildCommand: false,
      outputDirectory: false,
      installCommand: false,
      developmentCommand: false,
    },
  });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Detect framework based on repository content
    detectFramework(repository);
  }, [repository]);

  const detectFramework = async (repo) => {
    // TODO: Implement framework detection logic
    // For now, default to Next.js
    const defaultFramework = frameworks[0];
    handleFrameworkChange(defaultFramework.id);
  };

  const handleFrameworkChange = (frameworkId) => {
    const framework = frameworks.find(f => f.id === frameworkId);
    setConfig(prev => ({
      ...prev,
      framework: frameworkId,
      buildCommand: framework.buildCmd,
      outputDirectory: framework.outputDir,
      installCommand: framework.installCmd,
      developmentCommand: framework.devCmd,
    }));
  };

  const handleToggleOverride = (field) => {
    setConfig(prev => ({
      ...prev,
      overrides: {
        ...prev.overrides,
        [field]: !prev.overrides[field],
      },
    }));
  };

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value,
    }));
    onConfigChange({ ...config, [field]: value });
  };

  const generateVercelConfig = () => {
    const vercelConfig = {
      version: 2,
      framework: config.framework,
      buildCommand: config.overrides.buildCommand ? config.buildCommand : null,
      outputDirectory: config.overrides.outputDirectory ? config.outputDirectory : null,
      installCommand: config.overrides.installCommand ? config.installCommand : null,
      devCommand: config.overrides.developmentCommand ? config.developmentCommand : null,
      rootDirectory: config.rootDirectory || '.',
      includeFiles: config.includeFiles ? ['**/*'] : undefined,
      git: {
        deploymentEnabled: !config.skipDeployment,
      },
      build: {
        env: {
          NODE_VERSION: config.nodeVersion,
        },
      },
      regions: config.region === 'all' ? undefined : [config.region],
    };

    // Remove null or undefined values
    return JSON.stringify(vercelConfig, (k, v) => v == null ? undefined : v, 2);
  };

  return (
    <Box className={classes.root}>
      <Paper className={classes.section}>
        <Typography variant="h6" gutterBottom>
          Framework
          <Tooltip title="Select the framework for your project">
            <IconButton size="small">
              <InfoIcon className={classes.infoIcon} />
            </IconButton>
          </Tooltip>
        </Typography>
        <FormControl className={classes.formControl}>
          <InputLabel>Framework</InputLabel>
          <Select
            value={config.framework}
            onChange={(e) => handleFrameworkChange(e.target.value)}
          >
            {frameworks.map(framework => (
              <MenuItem key={framework.id} value={framework.id}>
                {framework.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      <Paper className={classes.section}>
        <Typography variant="h6" gutterBottom>
          Build Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box className={classes.settingRow}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.overrides.buildCommand}
                    onChange={() => handleToggleOverride('buildCommand')}
                  />
                }
                label="Override Build Command"
              />
              <TextField
                className={classes.settingField}
                label="Build Command"
                value={config.buildCommand}
                onChange={(e) => handleConfigChange('buildCommand', e.target.value)}
                disabled={!config.overrides.buildCommand}
                variant="outlined"
                size="small"
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box className={classes.settingRow}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.overrides.outputDirectory}
                    onChange={() => handleToggleOverride('outputDirectory')}
                  />
                }
                label="Override Output Directory"
              />
              <TextField
                className={classes.settingField}
                label="Output Directory"
                value={config.outputDirectory}
                onChange={(e) => handleConfigChange('outputDirectory', e.target.value)}
                disabled={!config.overrides.outputDirectory}
                variant="outlined"
                size="small"
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box className={classes.settingRow}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.overrides.installCommand}
                    onChange={() => handleToggleOverride('installCommand')}
                  />
                }
                label="Override Install Command"
              />
              <TextField
                className={classes.settingField}
                label="Install Command"
                value={config.installCommand}
                onChange={(e) => handleConfigChange('installCommand', e.target.value)}
                disabled={!config.overrides.installCommand}
                variant="outlined"
                size="small"
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box className={classes.settingRow}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.overrides.developmentCommand}
                    onChange={() => handleToggleOverride('developmentCommand')}
                  />
                }
                label="Override Development Command"
              />
              <TextField
                className={classes.settingField}
                label="Development Command"
                value={config.developmentCommand}
                onChange={(e) => handleConfigChange('developmentCommand', e.target.value)}
                disabled={!config.overrides.developmentCommand}
                variant="outlined"
                size="small"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper className={classes.section}>
        <Typography variant="h6" gutterBottom>
          Advanced Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Node.js Version</InputLabel>
              <Select
                value={config.nodeVersion}
                onChange={(e) => handleConfigChange('nodeVersion', e.target.value)}
              >
                {nodeVersions.map(version => (
                  <MenuItem key={version} value={version}>
                    {version}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Deployment Region</InputLabel>
              <Select
                value={config.region}
                onChange={(e) => handleConfigChange('region', e.target.value)}
              >
                {regions.map(region => (
                  <MenuItem key={region} value={region}>
                    {region === 'all' ? 'All Regions' : region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Root Directory"
              value={config.rootDirectory}
              onChange={(e) => handleConfigChange('rootDirectory', e.target.value)}
              variant="outlined"
              size="small"
              placeholder="."
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={config.includeFiles}
                  onChange={(e) => handleConfigChange('includeFiles', e.target.checked)}
                />
              }
              label="Include files outside root directory"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={config.skipDeployment}
                  onChange={(e) => handleConfigChange('skipDeployment', e.target.checked)}
                />
              }
              label="Skip deployments if only ignored files are changed"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={config.buildCache}
                  onChange={(e) => handleConfigChange('buildCache', e.target.checked)}
                />
              }
              label="Enable build cache"
            />
          </Grid>
        </Grid>
      </Paper>

      <Box className={classes.previewSection}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">
            vercel.json Preview
          </Typography>
          <Button
            startIcon={showPreview ? <CodeIcon /> : <CodeIcon />}
            onClick={() => setShowPreview(!showPreview)}
            color="primary"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
        </Box>
        {showPreview && (
          <Box className={classes.codePreview}>
            <SyntaxHighlighter
              language="json"
              style={tomorrow}
              customStyle={{
                backgroundColor: '#1a1a1a',
              }}
            >
              {generateVercelConfig()}
            </SyntaxHighlighter>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SandboxPreview;
