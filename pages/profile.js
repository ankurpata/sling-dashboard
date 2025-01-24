import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  makeStyles,
  Avatar,
  Grid,
  TextField,
  Button,
} from '@material-ui/core';
import { useUser } from '../modules/aiBuilder/context/UserContext';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: '#000',
    color: '#fff',
    paddingTop: theme.spacing(4),
  },
  paper: {
    backgroundColor: '#1a1a1a',
    padding: theme.spacing(4),
    borderRadius: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    marginBottom: theme.spacing(2),
  },
  input: {
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      '& fieldset': {
        borderColor: '#333',
      },
      '&:hover fieldset': {
        borderColor: '#444',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#666',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#666',
    },
  },
  saveButton: {
    backgroundColor: '#fff',
    color: '#000',
    padding: theme.spacing(1.5, 3),
    borderRadius: 8,
    textTransform: 'none',
    marginTop: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
}));

const Profile = () => {
  const classes = useStyles();
  const { user } = useUser();

  if (!user) return null;

  return (
    <Box className={classes.root}>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Paper className={classes.paper}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4} style={{ textAlign: 'center' }}>
              <Avatar 
                src={user.picture} 
                alt={user.name} 
                className={classes.avatar}
              />
              <Typography variant="h6">{user.name}</Typography>
              <Typography color="textSecondary">{user.email}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    defaultValue={user.name}
                    className={classes.input}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    defaultValue={user.email}
                    disabled
                    className={classes.input}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Bio"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    defaultValue={user.bio}
                    className={classes.input}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button className={classes.saveButton}>
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;
