import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GoogleIcon from '@material-ui/icons/AccountCircle';
import GitHubIcon from '@material-ui/icons/GitHub';
import { useUser } from '../context/UserContext';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    textTransform: 'none',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

const LoginButton = ({ provider, onClick, disabled }) => {
  const classes = useStyles();
  const { login } = useUser();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      login(provider);
    }
  };

  const getIcon = () => {
    switch (provider) {
      case 'google':
        return <GoogleIcon className={classes.icon} />;
      case 'github':
        return <GitHubIcon className={classes.icon} />;
      default:
        return null;
    }
  };

  const getButtonText = () => {
    switch (provider) {
      case 'google':
        return 'Sign in with Google';
      case 'github':
        return 'Connect GitHub';
      default:
        return 'Sign in';
    }
  };

  return (
    <Button
      variant="contained"
      color="default"
      className={classes.button}
      startIcon={getIcon()}
      onClick={handleClick}
      disabled={disabled}
    >
      {getButtonText()}
    </Button>
  );
};

export default LoginButton;
