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
    backgroundColor: 'transparent',
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
    background: 'linear-gradient(45deg, rgba(44, 24, 16, 0.05), rgba(31, 28, 24, 0.05))',
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
    color: '#111827',
  },
  subtitle: {
    color: '#6B7280',
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
    border: '1px solid rgba(107, 114, 128, 0.3)',
    color: '#111827',
    textTransform: 'none',
    marginBottom: theme.spacing(2),
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'rgba(107, 114, 128, 0.1)',
    },
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    color: '#6B7280',
    margin: theme.spacing(2, 0),
    '&::before, &::after': {
      content: '""',
      flex: 1,
      borderBottom: '1px solid rgba(107, 114, 128, 0.3)',
    },
    '& span': {
      padding: theme.spacing(0, 2),
    },
  },
  input: {
    '& .MuiOutlinedInput-root': {
      color: '#111827',
      '& fieldset': {
        borderColor: 'rgba(107, 114, 128, 0.3)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(107, 114, 128, 0.5)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#111827',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#6B7280',
    },
  },
  signUpButton: {
    backgroundColor: '#111827',
    color: '#fff',
    padding: theme.spacing(1.5),
    borderRadius: 8,
    textTransform: 'none',
    marginTop: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#1f2937',
    },
  },
  link: {
    color: '#111827',
    textDecoration: 'underline',
  },
  terms: {
    color: '#6B7280',
    fontSize: '0.875rem',
    marginTop: theme.spacing(2),
    '& a': {
      color: '#111827',
      textDecoration: 'underline',
    },
  },
  rightTitle: {
    fontSize: 32,
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    color: '#111827',
  },
  rightSubtitle: {
    color: '#6B7280',
  },
  error: {
    color: '#ef4444',
    marginBottom: theme.spacing(2),
  },
}));

const SignUp = () => {
  const classes = useStyles();
  const {login} = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const {error} = router.query;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle email/password sign up (if needed)
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.leftSection}>
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            src='/images/logo.png'
            alt='Logo'
            width={120}
            height={32}
            className={classes.logo}
            onClick={handleLogoClick}
          />
        </Box>
        <Typography className={classes.title}>Create an account</Typography>
        <Typography className={classes.subtitle}>
          Already have an account?{' '}
          <Link href='/signin' className={classes.link}>
            Sign in
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
          Sign up with GitHub
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
          Sign up with Google
        </Button>

        <div className={classes.divider}>
          <span>OR</span>
        </div>

        <form onSubmit={handleSubmit} className={classes.form}>
          <TextField
            label='Name'
            variant='outlined'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={classes.input}
            fullWidth
          />
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
          <Button type='submit' className={classes.signUpButton}>
            Create account
          </Button>
          <Typography className={classes.terms}>
            By signing up, you agree to our{' '}
            <Link href='/terms'>Terms of Service</Link> and{' '}
            <Link href='/privacy'>Privacy Policy</Link>
          </Typography>
        </form>
      </Box>

      <Box className={classes.rightSection}>
        <Typography className={classes.rightTitle}>
          Join Baloon.dev
        </Typography>
        <Typography className={classes.rightSubtitle}>
          Build and deploy your applications with AI assistance
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUp;
