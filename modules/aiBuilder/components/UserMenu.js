import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  makeStyles,
  Typography,
  Divider,
  Avatar,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useStyles = makeStyles((theme) => ({
  button: {
    color: '#111827',
    textTransform: 'none',
    padding: theme.spacing(0.75, 1.5),
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    border: '1px solid rgba(107, 114, 128, 0.3)',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'rgba(107, 114, 128, 0.1)',
    },
  },
  avatar: {
    width: 28,
    height: 28,
    marginRight: theme.spacing(0.5),
  },
  menu: {
    marginTop: theme.spacing(1),
  },
  menuPaper: {
    backgroundColor: '#111827',
    color: '#fff',
    borderRadius: 8,
    minWidth: 220,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  menuItem: {
    padding: theme.spacing(1.5, 2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '& .MuiSvgIcon-root': {
      fontSize: 20,
    },
  },
  activeMenuItem: {
    backgroundColor: '#2563eb',
    '&:hover': {
      backgroundColor: '#2563eb',
    },
  },
  icon: {
    color: '#9CA3AF',
    marginRight: theme.spacing(1),
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: theme.spacing(1, 0),
  },
  userName: {
    fontWeight: 500,
    fontSize: '0.9rem',
  },
  shortcut: {
    marginLeft: 'auto',
    color: '#9CA3AF',
    fontSize: '0.75rem',
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

  const isProfileActive = router.pathname === '/profile';
  const isSettingsActive = router.pathname === '/settings';

  return (
    <Box>
      <Button
        className={classes.button}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        <Avatar 
          src={user.avatarUrl} 
          alt={user.username}
          className={classes.avatar}
        />
        <Typography className={classes.userName}>{user.username || 'User'}</Typography>
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
        elevation={0}
      >
        <MenuItem 
          onClick={handleProfile} 
          className={`${classes.menuItem} ${isProfileActive ? classes.activeMenuItem : ''}`}
        >
          <AccountCircleIcon className={classes.icon} />
          Profile
          <span className={classes.shortcut}>⌘P</span>
        </MenuItem>
        <MenuItem 
          onClick={handleSettings} 
          className={`${classes.menuItem} ${isSettingsActive ? classes.activeMenuItem : ''}`}
        >
          <SettingsIcon className={classes.icon} />
          Settings
          <span className={classes.shortcut}>⌘,</span>
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
