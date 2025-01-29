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
    color: '#111827',
    textDecoration: 'none',
    fontWeight: 500,
    '& img': {
      height: 20,
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
  },
}));

const Header = ({isCanvasView}) => {
  const classes = useStyles();
  const {user} = useUser();
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <AppBar position='static' className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <a href='/' className={classes.logo}>
          <img
            src='/images/logo.png'
            style={{height: 70, paddingTop: 15}}
            alt='Logo'
          />
          <Typography
            variant='subtitle1'
            style={{
              fontSize: 16,
              color: '#434446',
              fontWeight: 'bold',
              fontFamily: 'Poppins',
              marginLeft: -5,
              marginTop: -7,
            }}>
            Baloon.dev
          </Typography>
        </a>

        <nav className={classes.nav}>
          <a href='/support' className={classes.navLink}>
            Support
          </a>
          <a href='/careers' className={classes.navLink}>
            Careers
          </a>
          <a href='/blog' className={classes.navLink}>
            Blog
          </a>
          <a href='/learn' className={classes.navLink}>
            Learn
          </a>
        </nav>

        <Box className={classes.rightSection}>
          {isCanvasView && (
            <Button
              variant='contained'
              className={classes.publishButton}
              onClick={() => {
                // Add publish logic here
                console.log('Publishing...');
              }}
              startIcon={<Language />}>
              Publish
            </Button>
          )}
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Button className={classes.signInButton} onClick={handleSignIn}>
                Sign in
              </Button>
              <Button className={classes.signUpButton} onClick={handleSignUp}>
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
