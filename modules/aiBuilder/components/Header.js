import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, Typography, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    padding: theme.spacing(2, 0),
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 1200,
    margin: '0 auto',
    padding: theme.spacing(0, 3),
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 500,
    '& img': {
      height: 24,
    },
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(4),
  },
  navLink: {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: 14,
    '&:hover': {
      color: '#fff',
    },
  },
  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    borderRadius: 20,
    padding: theme.spacing(0.5, 2),
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
  },
}));

const Header = () => {
  const classes = useStyles();

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
          <Button variant="contained" className={classes.actionButton}>
            Ankur Patanaik
          </Button>
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
