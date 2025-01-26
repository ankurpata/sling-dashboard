import React, { useState, useEffect } from 'react';
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  makeStyles,
  Container,
  Grid,
  Divider,
  Snackbar,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
  },
  backButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 500,
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: theme.spacing(2),
  },
  uploadButton: {
    marginTop: theme.spacing(1),
  },
  form: {
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(2),
    },
  },
  saveButton: {
    marginTop: theme.spacing(2),
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 500,
    marginBottom: theme.spacing(2),
  },
  connectionStatus: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    '& .MuiTypography-root': {
      marginLeft: theme.spacing(1),
    },
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#10B981',
  },
}));

const UserProfile = () => {
  const classes = useStyles();
  const router = useRouter();
  const { user, fetchUserInfo } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleBack = () => {
    router.back();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call your API to update user profile
      const response = await fetch('http://localhost:5001/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...formData
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      // Refresh user data
      await fetchUserInfo(user.id);
      
      setSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (!user) return null;

  return (
    <Container maxWidth="md">
      <Box className={classes.root}>
        <Box className={classes.header}>
          <IconButton className={classes.backButton} onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography className={classes.title}>Profile</Typography>
        </Box>

        <Paper className={classes.paper}>
          <Box className={classes.avatarSection}>
            <Avatar 
              className={classes.avatar}
              src={user.avatar}
              alt={user.name}
            />
            <Button
              variant="outlined"
              color="primary"
              size="small"
              className={classes.uploadButton}
            >
              Change Photo
            </Button>
          </Box>

          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>

            <Box mt={3}>
              <Typography className={classes.sectionTitle}>
                Connected Accounts
              </Typography>
              <Box className={classes.connectionStatus}>
                <Box className={classes.connectedDot} />
                <Typography>
                  GitHub {user.isGithubConnected ? '(Connected)' : '(Not Connected)'}
                </Typography>
              </Box>
              <Box className={classes.connectionStatus}>
                <Box className={classes.connectedDot} />
                <Typography>
                  Google {user.isGoogleConnected ? '(Connected)' : '(Not Connected)'}
                </Typography>
              </Box>
            </Box>

            <Box mt={3} display="flex" justifyContent="flex-end">
              {!isEditing ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                    style={{ marginRight: 8 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Save Changes
                  </Button>
                </>
              )}
            </Box>
          </form>
        </Paper>
      </Box>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserProfile;
