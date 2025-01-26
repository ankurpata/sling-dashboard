import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  makeStyles,
  Avatar,
  IconButton,
  Grid,
  Box,
  CircularProgress,
  Divider,
} from '@material-ui/core';
import { ArrowBack, Edit as EditIcon } from '@material-ui/icons';
import { useRouter } from 'next/router';
import { useUser } from '../modules/aiBuilder/context/UserContext';
import MainLayout from '../components/layout/MainLayout';

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 800,
    margin: '0 auto',
    padding: theme.spacing(3),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    '& .MuiIconButton-root': {
      padding: 8,
      marginRight: theme.spacing(2),
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
      },
    },
  },
  paper: {
    padding: theme.spacing(4),
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 500,
    flex: 1,
  },
  form: {
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(2),
    },
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
  },
  avatar: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing(2),
    border: '4px solid #fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  changePhotoButton: {
    marginTop: theme.spacing(1),
    textTransform: 'none',
    borderRadius: 20,
    padding: '4px 16px',
    color: '#fff',
    backgroundColor: '#111827',
    '&:hover': {
      backgroundColor: '#374151',
    },
    '&.Mui-disabled': {
      backgroundColor: 'rgba(17, 24, 39, 0.12)',
      color: 'rgba(17, 24, 39, 0.26)',
    },
  },
  fieldLabel: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    marginBottom: theme.spacing(0.5),
    fontWeight: 500,
  },
  fieldValue: {
    fontSize: '1rem',
    color: theme.palette.text.primary,
    minHeight: 24,
  },
  fieldContainer: {
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 500,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  connectionStatus: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    '& .MuiTypography-root': {
      marginLeft: theme.spacing(1),
      fontSize: '0.875rem',
    },
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#10B981',
  },
  editButton: {
    borderRadius: 20,
    padding: '6px 16px',
    textTransform: 'none',
    fontWeight: 500,
    color: '#fff',
    backgroundColor: '#111827',
    '&:hover': {
      backgroundColor: '#374151',
    },
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#fff',
      borderRadius: 8,
    },
  },
  divider: {
    margin: theme.spacing(4, 0),
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  actions: {
    marginTop: theme.spacing(4),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
    '& .MuiButton-root': {
      borderRadius: 20,
      padding: '6px 20px',
      textTransform: 'none',
      fontWeight: 500,
    },
  },
}));

const Profile = () => {
  const classes = useStyles();
  const router = useRouter();
  const { user, updateUser, loading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    company: '',
    location: '',
    website: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
      return;
    }
    if (user) {
      setFormData({
        name: user.name || user.displayName || '',
        email: user.email || '',
        bio: user.bio || '',
        company: user.company || '',
        location: user.location || '',
        website: user.website || '',
      });
    }
  }, [user, loading, router]);

  const handleBack = () => {
    router.back();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return null;

  return (
    <MainLayout>
      <Container className={classes.container}>
        <Box className={classes.header}>
          <IconButton className={classes.backButton} onClick={handleBack}>
            <ArrowBack />
          </IconButton>
          <Typography className={classes.title}>Profile</Typography>
          {!isEditing ? (
            <Button
              className={classes.editButton}
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <Box className={classes.actions}>
              <Button
                variant="outlined"
                onClick={() => setIsEditing(false)}
                style={{ 
                  marginRight: 8,
                  borderColor: '#111827',
                  color: '#111827',
                  '&:hover': {
                    backgroundColor: 'rgba(17, 24, 39, 0.04)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                style={{ 
                  backgroundColor: '#111827',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#374151',
                  },
                }}
                type="submit"
              >
                Save Changes
              </Button>
            </Box>
          )}
        </Box>

        <Paper className={classes.paper}>
          <form onSubmit={handleSubmit}>
            <Box className={classes.avatarSection}>
              <Avatar 
                className={classes.avatar}
                src={user.photoURL || user.avatar}
                alt={formData.name}
              />
              <Button
                variant="outlined"
                color="primary"
                size="small"
                className={classes.changePhotoButton}
                disabled={true}
              >
                Change Photo
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box className={classes.fieldContainer}>
                  <Typography className={classes.fieldLabel}>Name</Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      className={classes.textField}
                    />
                  ) : (
                    <Typography className={classes.fieldValue}>{formData.name}</Typography>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box className={classes.fieldContainer}>
                  <Typography className={classes.fieldLabel}>Email</Typography>
                  <Typography className={classes.fieldValue}>{formData.email}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box className={classes.fieldContainer}>
                  <Typography className={classes.fieldLabel}>Bio</Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      variant="outlined"
                      multiline
                      rows={4}
                      className={classes.textField}
                    />
                  ) : (
                    <Typography className={classes.fieldValue}>
                      {formData.bio || 'No bio added yet'}
                    </Typography>
                  )}
                </Box>
              </Grid>

              {(formData.company || isEditing) && (
                <Grid item xs={12} sm={6}>
                  <Box className={classes.fieldContainer}>
                    <Typography className={classes.fieldLabel}>Company</Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        className={classes.textField}
                      />
                    ) : (
                      <Typography className={classes.fieldValue}>{formData.company}</Typography>
                    )}
                  </Box>
                </Grid>
              )}

              {(formData.location || isEditing) && (
                <Grid item xs={12} sm={6}>
                  <Box className={classes.fieldContainer}>
                    <Typography className={classes.fieldLabel}>Location</Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        className={classes.textField}
                      />
                    ) : (
                      <Typography className={classes.fieldValue}>{formData.location}</Typography>
                    )}
                  </Box>
                </Grid>
              )}

              {(formData.website || isEditing) && (
                <Grid item xs={12} sm={6}>
                  <Box className={classes.fieldContainer}>
                    <Typography className={classes.fieldLabel}>Website</Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        className={classes.textField}
                      />
                    ) : (
                      <Typography className={classes.fieldValue}>
                        {formData.website}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>

            <Divider className={classes.divider} />

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

            {isEditing && (
              <Box className={classes.actions}>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                  style={{ 
                    marginRight: 8,
                    borderColor: '#111827',
                    color: '#111827',
                    '&:hover': {
                      backgroundColor: 'rgba(17, 24, 39, 0.04)',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  style={{ 
                    backgroundColor: '#111827',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#374151',
                    },
                  }}
                  type="submit"
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </form>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default Profile;
