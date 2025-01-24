import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  makeStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
} from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SecurityIcon from '@material-ui/icons/Security';
import VisibilityIcon from '@material-ui/icons/Visibility';
import StorageIcon from '@material-ui/icons/Storage';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: '#000',
    color: '#fff',
    paddingTop: theme.spacing(4),
  },
  paper: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
  },
  listItem: {
    padding: theme.spacing(2, 3),
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
  },
  icon: {
    color: '#666',
  },
  divider: {
    backgroundColor: '#333',
  },
  switch: {
    '& .MuiSwitch-track': {
      backgroundColor: '#666',
    },
    '& .MuiSwitch-colorSecondary.Mui-checked': {
      color: '#fff',
    },
    '& .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#666',
    },
  },
}));

const Settings = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Paper className={classes.paper}>
          <List>
            <ListItem className={classes.listItem}>
              <ListItemIcon>
                <NotificationsIcon className={classes.icon} />
              </ListItemIcon>
              <ListItemText 
                primary="Email Notifications"
                secondary="Receive email updates about your activity"
              />
              <ListItemSecondaryAction>
                <Switch className={classes.switch} />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider className={classes.divider} />
            <ListItem className={classes.listItem}>
              <ListItemIcon>
                <SecurityIcon className={classes.icon} />
              </ListItemIcon>
              <ListItemText 
                primary="Two-Factor Authentication"
                secondary="Add an extra layer of security to your account"
              />
              <ListItemSecondaryAction>
                <Switch className={classes.switch} />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider className={classes.divider} />
            <ListItem className={classes.listItem}>
              <ListItemIcon>
                <VisibilityIcon className={classes.icon} />
              </ListItemIcon>
              <ListItemText 
                primary="Profile Visibility"
                secondary="Make your profile visible to other users"
              />
              <ListItemSecondaryAction>
                <Switch className={classes.switch} />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider className={classes.divider} />
            <ListItem className={classes.listItem}>
              <ListItemIcon>
                <StorageIcon className={classes.icon} />
              </ListItemIcon>
              <ListItemText 
                primary="Data Usage"
                secondary="Allow us to collect usage data to improve our service"
              />
              <ListItemSecondaryAction>
                <Switch className={classes.switch} />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>
      </Container>
    </Box>
  );
};

export default Settings;
