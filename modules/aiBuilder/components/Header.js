import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {AppBar, Toolbar, Typography, Box, Button} from '@material-ui/core';
import UserMenu from './UserMenu';
import {useUser} from '../context/UserContext';
import {useRouter} from 'next/router';
import {Language} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: 'transparent',
    color: '#000',
    boxShadow: 'none',
    borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
    backdropFilter: 'blur(8px)',
    '&.darkTheme': {
      backgroundColor: '#1a1a1a',
      color: '#fff',
      borderBottom: '1px solid rgba(64, 64, 64, 0.5)',
    },
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0, 3),
    width: '100%',
    margin: '0 auto',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    textDecoration: 'none',
    '& img': {
      height: 70,
      paddingTop: 15,
    },
    '& .MuiTypography-root': {
      fontSize: 16,
      color: '#434446',
      fontWeight: 'bold',
      fontFamily: 'Poppins',
      marginLeft: -5,
      marginTop: -7,
    },
    '.darkTheme &': {
      '& .MuiTypography-root': {
        color: '#ffffff',
      },
    },
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(6),
  },
  navLink: {
    color: '#6B7280',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    '&:hover': {
      color: '#111827',
    },
    '.darkTheme &': {
      color: '#9ca3af',
      '&:hover': {
        color: '#ffffff',
      },
    },
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  signInButton: {
    backgroundColor: 'transparent',
    color: '#111827',
    borderRadius: 20,
    padding: theme.spacing(0.75, 2),
    textTransform: 'none',
    fontWeight: 500,
    border: '1px solid rgba(107, 114, 128, 0.3)',
    '&:hover': {
      backgroundColor: 'rgba(107, 114, 128, 0.1)',
    },
    '&.darkTheme &': {
      color: '#ffffff',
      border: '1px solid rgba(156, 163, 175, 0.3)',
      '&:hover': {
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
      },
    },
  },
  signUpButton: {
    backgroundColor: '#111827',
    color: '#fff',
    borderRadius: 20,
    padding: theme.spacing(0.75, 2),
    textTransform: 'none',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: '#1f2937',
    },
    '&.darkTheme &': {
      backgroundColor: '#059669',
      '&:hover': {
        backgroundColor: '#047857',
      },
    },
  },
  publishButton: {
    backgroundColor: '#18181b',
    color: '#fff',
    borderRadius: '8px',
    padding: '6px 16px',
    fontSize: '14px',
    textTransform: 'none',
    fontWeight: 500,
    marginRight: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#27272a',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '18px',
      marginRight: theme.spacing(1),
    },
    '&.darkTheme &': {
      backgroundColor: '#059669',
      '&:hover': {
        backgroundColor: '#047857',
      },
    },
  },
}));

const Header = ({isCanvasView}) => {
  const classes = useStyles();
  const {user} = useUser();
  const router = useRouter();

  return (
    <AppBar
      position='static'
      className={`${classes.appBar} ${isCanvasView ? 'darkTheme' : ''}`}>
      <Toolbar className={classes.toolbar}>
        <a href='/' className={classes.logo}>
          <img src='/images/logo.png' alt='Logo' />
          <Typography variant='subtitle1'>Baloon.dev</Typography>
        </a>

        <nav className={classes.nav}>
          <a
            href='https://balloon.dev/support'
            target='_blank'
            rel='noopener noreferrer'
            className={classes.navLink}>
            Support
          </a>
          <a
            href='https://balloon.dev/careers'
            target='_blank'
            rel='noopener noreferrer'
            className={classes.navLink}>
            Careers
          </a>
          <a
            href='https://balloon.dev/blog'
            target='_blank'
            rel='noopener noreferrer'
            className={classes.navLink}>
            Blog
          </a>
          <a
            href='https://balloon.dev/learn'
            target='_blank'
            rel='noopener noreferrer'
            className={classes.navLink}>
            Learn
          </a>
        </nav>

        <Box className={classes.rightSection}>
          {user ? (
            <UserMenu isCanvasView={isCanvasView} />
          ) : (
            <>
              <Button
                className={classes.signInButton}
                onClick={() => router.push('/signin')}>
                Sign in
              </Button>
              <Button
                className={classes.signUpButton}
                onClick={() => router.push('/signup')}>
                Sign up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
