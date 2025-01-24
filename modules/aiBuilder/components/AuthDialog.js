import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  makeStyles,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiDialog-paper': {
      backgroundColor: '#000',
      color: '#fff',
      minWidth: 400,
      borderRadius: 12,
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: '#fff',
  },
  title: {
    textAlign: 'center',
    '& h2': {
      fontSize: 24,
      fontWeight: 600,
    },
  },
  content: {
    textAlign: 'center',
    paddingBottom: theme.spacing(3),
  },
  subtitle: {
    color: '#666',
    marginBottom: theme.spacing(3),
  },
  actions: {
    padding: theme.spacing(2, 3),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  signInButton: {
    backgroundColor: '#fff',
    color: '#000',
    padding: theme.spacing(1.5),
    borderRadius: 8,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  signUpButton: {
    backgroundColor: 'transparent',
    color: '#fff',
    padding: theme.spacing(1.5),
    borderRadius: 8,
    border: '1px solid #333',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
  },
}));

const AuthDialog = ({ open, onClose }) => {
  const classes = useStyles();
  const router = useRouter();

  const handleSignUp = () => {
    router.push('/signup');
    onClose();
  };

  const handleSignIn = () => {
    router.push('/signin');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={classes.dialog}
      maxWidth="xs"
      fullWidth
    >
      <IconButton className={classes.closeButton} onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <DialogTitle className={classes.title}>Sign in required</DialogTitle>
      <DialogContent className={classes.content}>
        <Typography className={classes.subtitle}>
          Please sign in to continue using Sling Studio
        </Typography>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button
          className={classes.signInButton}
          onClick={handleSignIn}
        >
          Sign in
        </Button>
        <Button
          className={classes.signUpButton}
          onClick={handleSignUp}
        >
          Create an account
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthDialog;
