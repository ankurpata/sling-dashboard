import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Switch,
  makeStyles,
  FormControlLabel,
  IconButton,
  Grid,
  Divider,
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { useUser } from '../modules/aiBuilder/context/UserContext';
import MainLayout from '../components/layout/MainLayout';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  backButton: {
    marginRight: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(4),
    borderRadius: 12,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  title: {
    fontWeight: 500,
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  sectionTitle: {
    fontWeight: 500,
    marginBottom: theme.spacing(2),
  },
  formControl: {
    marginBottom: theme.spacing(2),
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    color: theme.palette.text.primary,
  },
  description: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    marginTop: theme.spacing(0.5),
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

const Settings = () => {
  const classes = useStyles();
  const router = useRouter();
  const { user } = useUser();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    twoFactorAuth: false,
    publicProfile: true,
    dataUsage: true,
  });

  const handleChange = (event) => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.checked,
    });
  };

  const handleBack = () => {
    router.push('/');
  };

  if (!user) return null;

  return (
    <MainLayout>
      <Container maxWidth="md" className={classes.container}>
        <div className={classes.header}>
          <IconButton 
            onClick={handleBack} 
            className={classes.backButton}
            size="small"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" className={classes.title}>
            Settings
          </Typography>
        </div>

        <Paper className={classes.paper}>
          <div className={classes.section}>
            <Typography variant="h6" className={classes.sectionTitle}>
              Notifications
            </Typography>
            <FormControlLabel
              className={classes.formControl}
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  name="emailNotifications"
                  color="primary"
                />
              }
              label={
                <div>
                  <Typography className={classes.switchLabel}>
                    Email Notifications
                  </Typography>
                  <Typography className={classes.description}>
                    Receive email updates about your projects and account activity
                  </Typography>
                </div>
              }
              labelPlacement="start"
            />
          </div>

          <Divider className={classes.divider} />

          <div className={classes.section}>
            <Typography variant="h6" className={classes.sectionTitle}>
              Security
            </Typography>
            <FormControlLabel
              className={classes.formControl}
              control={
                <Switch
                  checked={settings.twoFactorAuth}
                  onChange={handleChange}
                  name="twoFactorAuth"
                  color="primary"
                />
              }
              label={
                <div>
                  <Typography className={classes.switchLabel}>
                    Two-Factor Authentication
                  </Typography>
                  <Typography className={classes.description}>
                    Add an extra layer of security to your account
                  </Typography>
                </div>
              }
              labelPlacement="start"
            />
          </div>

          <Divider className={classes.divider} />

          <div className={classes.section}>
            <Typography variant="h6" className={classes.sectionTitle}>
              Privacy
            </Typography>
            <FormControlLabel
              className={classes.formControl}
              control={
                <Switch
                  checked={settings.publicProfile}
                  onChange={handleChange}
                  name="publicProfile"
                  color="primary"
                />
              }
              label={
                <div>
                  <Typography className={classes.switchLabel}>
                    Public Profile
                  </Typography>
                  <Typography className={classes.description}>
                    Make your profile visible to other users
                  </Typography>
                </div>
              }
              labelPlacement="start"
            />
          </div>

          <Divider className={classes.divider} />

          <div className={classes.section}>
            <Typography variant="h6" className={classes.sectionTitle}>
              Data
            </Typography>
            <FormControlLabel
              className={classes.formControl}
              control={
                <Switch
                  checked={settings.dataUsage}
                  onChange={handleChange}
                  name="dataUsage"
                  color="primary"
                />
              }
              label={
                <div>
                  <Typography className={classes.switchLabel}>
                    Data Usage
                  </Typography>
                  <Typography className={classes.description}>
                    Allow us to collect anonymous usage data to improve our services
                  </Typography>
                </div>
              }
              labelPlacement="start"
            />
          </div>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default Settings;
