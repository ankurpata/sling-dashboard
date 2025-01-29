import React from 'react';
import { useRouter } from 'next/router';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    color: '#fff',
    padding: theme.spacing(2),
  },
  logo: {
    height: 240,
    marginBottom: theme.spacing(4),
    filter: 'brightness(0) invert(1)', // Makes the logo white
  },
  title: {
    fontSize: '8rem',
    fontWeight: 700,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      fontSize: '6rem',
    },
  },
  subtitle: {
    fontSize: '1.5rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
  button: {
    textTransform: 'none',
    fontSize: '1.1rem',
    padding: theme.spacing(1, 4),
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    color: '#fff',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  backIcon: {
    marginRight: theme.spacing(1),
  },
}));

const Error404 = () => {
  const classes = useStyles();
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <Box className={classes.root}>
      <img
        src="/images/logo.png"
        alt="Baloon.dev Logo"
        className={classes.logo}
      />
      <Typography variant="h1" className={classes.title}>
        404
      </Typography>
      <Typography variant="h2" className={classes.subtitle}>
        Oops! This page has floated away.
      </Typography>
      <Button
        variant="contained"
        className={classes.button}
        onClick={handleGoHome}
      >
        <ArrowBack className={classes.backIcon} />
        Back to Home
      </Button>
    </Box>
  );
};

import AppPage from '../@sling/hoc/AppPage';

export default Error404;
