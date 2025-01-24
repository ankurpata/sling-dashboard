import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import { useUser } from '../context/UserContext';

const useStyles = makeStyles((theme) => ({
  profile: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  avatar: {
    width: 32,
    height: 32,
    marginRight: theme.spacing(1),
  },
  name: {
    fontSize: '14px',
    fontWeight: 500,
  },
  menu: {
    marginTop: theme.spacing(1),
  },
  menuItem: {
    fontSize: '14px',
    minWidth: 150,
  },
  logoutItem: {
    color: theme.palette.error.main,
  },
}));

const UserProfile = () => {
  const classes = useStyles();
  const { user, logout } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  if (!user) return null;

  return (
    <>
      <Box className={classes.profile} onClick={handleClick}>
        <Avatar 
          className={classes.avatar}
          src={user.avatar_url || user.photoURL}
          alt={user.name || user.displayName}
        />
        <Typography className={classes.name}>
          {user.name || user.displayName}
        </Typography>
      </Box>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className={classes.menu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem className={classes.menuItem} onClick={handleClose}>
          Profile
        </MenuItem>
        <MenuItem className={classes.menuItem} onClick={handleClose}>
          Settings
        </MenuItem>
        <MenuItem 
          className={`${classes.menuItem} ${classes.logoutItem}`} 
          onClick={handleLogout}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserProfile;
