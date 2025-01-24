import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  makeStyles,
  Typography,
  Divider,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useStyles = makeStyles((theme) => ({
  button: {
    color: '#fff',
    textTransform: 'none',
    padding: theme.spacing(0.5, 1),
    borderRadius: 8,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  menu: {
    marginTop: theme.spacing(1),
  },
  menuPaper: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 8,
    minWidth: 200,
  },
  menuItem: {
    padding: theme.spacing(1.5, 2),
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  icon: {
    marginRight: theme.spacing(1.5),
    color: '#666',
  },
  divider: {
    backgroundColor: '#333',
  },
  userName: {
    marginRight: theme.spacing(0.5),
  },
}));

const UserMenu = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useUser();
  const router = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    router.push('/profile');
    handleClose();
  };

  const handleSettings = () => {
    router.push('/settings');
    handleClose();
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  if (!user) return null;

  return (
    <Box>
      <Button
        className={classes.button}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        <Typography className={classes.userName}>{user.name || 'User'}</Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className={classes.menu}
        PaperProps={{
          className: classes.menuPaper,
        }}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleProfile} className={classes.menuItem}>
          <AccountCircleIcon className={classes.icon} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleSettings} className={classes.menuItem}>
          <SettingsIcon className={classes.icon} />
          Settings
        </MenuItem>
        <Divider className={classes.divider} />
        <MenuItem onClick={handleLogout} className={classes.menuItem}>
          <ExitToAppIcon className={classes.icon} />
          Sign out
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;
