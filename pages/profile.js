import React, { useState } from 'react';
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: theme.spacing(1),
  },
  email: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
  },
  input: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#fff',
    },
  },
  bioField: {
    '& .MuiOutlinedInput-root': {
      minHeight: '120px',
    },
  },
  saveButton: {
    marginTop: theme.spacing(2),
    alignSelf: 'flex-start',
    padding: theme.spacing(1, 3),
  },
}));

const Profile = () => {
  const classes = useStyles();
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsEditing(true);
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
            Profile
          </Typography>
        </div>

        <Paper className={classes.paper}>
          <form onSubmit={handleSubmit} className={classes.form}>
            <div className={classes.avatarSection}>
              <Avatar 
                src={user.avatarUrl} 
                alt={user.username}
                className={classes.avatar}
              />
              <Typography variant="subtitle1" className={classes.email}>
                {user.email}
              </Typography>
            </div>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={classes.input}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  value={user.email}
                  disabled
                  className={classes.input}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  variant="outlined"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  className={`${classes.input} ${classes.bioField}`}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.saveButton}
              disabled={!isEditing}
            >
              Save Changes
            </Button>
          </form>
        </Paper>
      </Container>
    </MainLayout>
  );
};

export default Profile;
