import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  FormControlLabel,
  Switch,
  makeStyles,
  MenuItem,
} from '@material-ui/core';
import { saveBuildSettings } from '../../services/projectService';

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
  formField: {
    marginBottom: theme.spacing(3),
  },
  switch: {
    marginBottom: theme.spacing(2),
  },
}));

const NODE_VERSIONS = ['14.x', '16.x', '18.x', '20.x'];

const BuildSettings = ({ projectId, initialSettings = {}, onSave }) => {
  const classes = useStyles();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    buildCommand: initialSettings.buildCommand || 'npm run build',
    outputDirectory: initialSettings.outputDirectory || 'dist',
    installCommand: initialSettings.installCommand || 'npm install',
    devCommand: initialSettings.devCommand || 'npm run dev',
    rootDirectory: initialSettings.rootDirectory || '',
    includeFilesOutsideRoot: initialSettings.includeFilesOutsideRoot || false,
    nodeVersion: initialSettings.nodeVersion || '18.x',
  });

  const handleChange = (field) => (event) => {
    setSettings({
      ...settings,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await saveBuildSettings({
        projectId,
        buildSettings: settings,
      });
      if (onSave) {
        onSave(response.data);
      }
    } catch (error) {
      console.error('Failed to save build settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={classes.root}>
      <Box className={classes.header}>
        <Typography className={classes.title}>Build Settings</Typography>
        <Typography className={classes.description}>
          Configure how your project should be built and deployed
        </Typography>
      </Box>

      <TextField
        className={classes.formField}
        fullWidth
        label="Build Command"
        variant="outlined"
        value={settings.buildCommand}
        onChange={handleChange('buildCommand')}
        placeholder="npm run build"
      />

      <TextField
        className={classes.formField}
        fullWidth
        label="Output Directory"
        variant="outlined"
        value={settings.outputDirectory}
        onChange={handleChange('outputDirectory')}
        placeholder="dist"
      />

      <TextField
        className={classes.formField}
        fullWidth
        label="Install Command"
        variant="outlined"
        value={settings.installCommand}
        onChange={handleChange('installCommand')}
        placeholder="npm install"
      />

      <TextField
        className={classes.formField}
        fullWidth
        label="Development Command"
        variant="outlined"
        value={settings.devCommand}
        onChange={handleChange('devCommand')}
        placeholder="npm run dev"
      />

      <TextField
        className={classes.formField}
        fullWidth
        label="Root Directory"
        variant="outlined"
        value={settings.rootDirectory}
        onChange={handleChange('rootDirectory')}
        placeholder="/"
      />

      <TextField
        className={classes.formField}
        fullWidth
        select
        label="Node.js Version"
        variant="outlined"
        value={settings.nodeVersion}
        onChange={handleChange('nodeVersion')}
      >
        {NODE_VERSIONS.map((version) => (
          <MenuItem key={version} value={version}>
            {version}
          </MenuItem>
        ))}
      </TextField>

      <FormControlLabel
        className={classes.switch}
        control={
          <Switch
            checked={settings.includeFilesOutsideRoot}
            onChange={handleChange('includeFilesOutsideRoot')}
            color="primary"
          />
        }
        label="Include files outside root directory"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        disabled={isSaving}
      >
        Save Build Settings
      </Button>
    </div>
  );
};

export default BuildSettings;
