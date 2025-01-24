import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Box, Button } from '@material-ui/core';
import UserProfile from './UserProfile';
import { useUser } from '../context/UserContext';

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
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  actionButton: {
    backgroundColor: '#F3F4F6',
    color: '#111827',
    borderRadius: 20,
    padding: theme.spacing(0.75, 2),
    marginLeft: theme.spacing(4),
    textTransform: 'none',
    fontWeight: 500,
    '&:hover': {
      backgroundColor: '#E5E7EB',
    },
  },
}));

const Header = () => {
  const classes = useStyles();
  const { user } = useUser();

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <a href="/" className={classes.logo}>
          <img src="/images/sling-fe.png" alt="Logo" />
          <Typography variant="subtitle1">dev</Typography>
        </a>
        
        <nav className={classes.nav}>
          <a href="/support" className={classes.navLink}>Support</a>
          <a href="/careers" className={classes.navLink}>Careers</a>
          <a href="/blog" className={classes.navLink}>Blog</a>
          <a href="/learn" className={classes.navLink}>Learn</a>
          
          <Box className={classes.actions}>
            {user && <UserProfile />}
          </Box>
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
