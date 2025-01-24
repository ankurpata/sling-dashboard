import React, {useState} from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import Link from 'next/link';
import Image from 'next/image';
import {useRouter} from 'next/router';
import GitHubIcon from '@material-ui/icons/GitHub';
import {useUser} from '../modules/aiBuilder/context/UserContext';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    backgroundColor: '#000',
    color: '#fff',
  },
  leftSection: {
    flex: 1,
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 480,
    margin: '0 auto',
  },
  rightSection: {
    flex: 1,
    background: 'linear-gradient(45deg, #2C1810, #1F1C18)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(8),
  },
  logo: {
    height: '100%',
    marginBottom: theme.spacing(6),
    cursor: 'pointer',
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    color: '#666',
    marginBottom: theme.spacing(4),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  socialButton: {
    padding: theme.spacing(1.5),
    borderRadius: 8,
    border: '1px solid #333',
    color: '#fff',
    textTransform: 'none',
    marginBottom: theme.spacing(2),
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    color: '#666',
    margin: theme.spacing(2, 0),
    '&::before, &::after': {
      content: '""',
      flex: 1,
      borderBottom: '1px solid #333',
    },
    '& span': {
      padding: theme.spacing(0, 2),
    },
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
  signInButton: {
    backgroundColor: '#fff',
    color: '#000',
    padding: theme.spacing(1.5),
    borderRadius: 8,
    textTransform: 'none',
    marginTop: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  link: {
    color: '#fff',
    textDecoration: 'underline',
  },
  forgotPassword: {
    color: '#666',
    textAlign: 'right',
    marginTop: theme.spacing(1),
    cursor: 'pointer',
    '&:hover': {
      color: '#fff',
    },
  },
  rightTitle: {
    fontSize: 32,
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  rightSubtitle: {
    color: '#999',
  },
  footer: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    color: '#666',
  },
  error: {
    color: '#ff4444',
    marginBottom: theme.spacing(2),
  },
}));

const SignIn = () => {
  const classes = useStyles();
  const {login} = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const {error} = router.query;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle email/password sign in (if needed)
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.leftSection}>
        <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Image
            src='/images/logo.png'
            alt='Logo'
            width={120}
            height={32}
            className={classes.logo}
            onClick={handleLogoClick}
          />
        </Box>
        <Typography className={classes.title}>Sign in</Typography>
        <Typography className={classes.subtitle}>
          Don't have an account?{' '}
          <Link href='/signup' className={classes.link}>
            Create one
          </Link>
        </Typography>

        {error && (
          <Typography className={classes.error}>
            {error === 'auth_failed'
              ? 'Authentication failed. Please try again.'
              : error}
          </Typography>
        )}

        <Button
          startIcon={<GitHubIcon />}
          className={classes.socialButton}
          onClick={() => login('github')}>
          Sign in with GitHub
        </Button>
        <Button
          startIcon={
            <Image
              src='/images/google.svg'
              alt='Google'
              width={20}
              height={20}
            />
          }
          className={classes.socialButton}
          onClick={() => login('google')}>
          Sign in with Google
        </Button>

        <div className={classes.divider}>
          <span>OR</span>
        </div>

        <form onSubmit={handleSubmit} className={classes.form}>
          <TextField
            label='Email'
            variant='outlined'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={classes.input}
            fullWidth
          />
          <TextField
            label='Password'
            variant='outlined'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={classes.input}
            fullWidth
          />
          <Typography className={classes.forgotPassword}>
            Forgot password?
          </Typography>
          <Button type='submit' className={classes.signInButton}>
            Sign in
          </Button>
        </form>
      </Box>

      <Box className={classes.rightSection}>
        <Typography className={classes.rightTitle}>
          Welcome back to Baloon.dev
        </Typography>
        <Typography className={classes.rightSubtitle}>
          Build and deploy your applications with AI assistance
        </Typography>
      </Box>
    </Box>
  );
};

export default SignIn;
