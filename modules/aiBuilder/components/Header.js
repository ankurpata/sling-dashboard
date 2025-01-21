import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, Typography, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
    padding: theme.spacing(1, 0),
    height: 64,
    backdropFilter: 'blur(8px)',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    // maxWidth: 1200,
    margin: '0 auto',
    padding: theme.spacing(4, 4),
    minHeight: 64,
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
