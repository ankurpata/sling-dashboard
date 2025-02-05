import React, {useState} from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  makeStyles,
  Typography,
  Divider,
  Avatar,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {useRouter} from 'next/router';
import {useUser} from '../context/UserContext';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import BusinessIcon from '@material-ui/icons/Business';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
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
    '.darkTheme &': {
      color: '#ffffff',
      border: '1px solid rgba(156, 163, 175, 0.3)',
      '&:hover': {
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
      },
    },
  },
  orgButton: {
    fontSize: '0.875rem',
    color: '#4B5563',
    padding: theme.spacing(0.5, 1.5),
    borderRadius: 16,
    border: '1px solid rgba(107, 114, 128, 0.2)',
    backgroundColor: 'rgba(107, 114, 128, 0.05)',
    '&:hover': {
      backgroundColor: 'rgba(107, 114, 128, 0.1)',
    },
    '.darkTheme &': {
      color: '#9ca3af',
      border: '1px solid rgba(156, 163, 175, 0.2)',
      backgroundColor: 'rgba(156, 163, 175, 0.05)',
      '&:hover': {
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
      },
    },
  },
  menu: {
    '& .MuiPaper-root': {
      marginTop: theme.spacing(1),
      minWidth: 180,
      borderRadius: 12,
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    '.darkTheme &': {
      '& .MuiPaper-root': {
        backgroundColor: '#262626',
        border: '1px solid #404040',
      },
      '& .MuiMenuItem-root': {
        color: '#ffffff',
        '&:hover': {
          backgroundColor: 'rgba(156, 163, 175, 0.1)',
        },
      },
      '& .MuiListItemIcon-root': {
        color: '#9ca3af',
      },
      '& .MuiDivider-root': {
        backgroundColor: '#404040',
      },
    },
  },
  menuItem: {
    padding: theme.spacing(1, 2),
    '& .MuiListItemIcon-root': {
      minWidth: 32,
    },
  },
  avatar: {
    width: 28,
    height: 28,
    marginRight: theme.spacing(0.5),
  },
  userName: {
    fontWeight: 500,
    fontSize: '0.9rem',
    paddingLeft: 5,
    color: '#111827',
    '.darkTheme &': {
      color: '#ffffff',
    },
  },
  orgName: {
    fontSize: '0.875rem',
    color: '#9CA3AF',
  },
  orgIcon: {
    fontSize: 16,
    marginRight: theme.spacing(1),
    color: '#9CA3AF',
  },
  orgMenuItem: {
    fontSize: '0.875rem',
  },
  divider: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: theme.spacing(1, 0),
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
  const [orgAnchorEl, setOrgAnchorEl] = useState(null);
  const {user, organizations, selectedOrg, selectOrganization, logout} =
    useUser();
  const router = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOrgClick = (event) => {
    event.stopPropagation();
    setOrgAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOrgClose = () => {
    setOrgAnchorEl(null);
  };

  const handleOrgSelect = (org) => {
    selectOrganization(org);
    handleOrgClose();
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

  console.log('UserMenu - Current user:', user);

  return (
    <Box className={classes.container}>
      {organizations?.length > 0 && (
        <>
          <Button
            className={classes.orgButton}
            onClick={handleOrgClick}
            endIcon={<KeyboardArrowDownIcon />}>
            <BusinessIcon className={classes.orgIcon} />
            {selectedOrg?.name || 'Select Organization'}
          </Button>
          <Menu
            anchorEl={orgAnchorEl}
            keepMounted
            open={Boolean(orgAnchorEl)}
            onClose={handleOrgClose}
            className={classes.menu}
            PaperProps={{
              className: classes.menuPaper,
            }}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}>
            {organizations.map((org) => (
              <MenuItem
                key={org.id}
                onClick={() => handleOrgSelect(org)}
                selected={selectedOrg?.id === org.id}>
                {org.name}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
      <Button
        className={classes.button}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}>
        {user.avatar ? (
          <Avatar
            src={user.avatar}
            alt={user.name || user.email}
            className={classes.avatar}
          />
        ) : (
          <AccountCircleIcon className={classes.avatar} />
        )}
        <Typography variant='body2' className={classes.userName}>
          {user.name || user.email}
        </Typography>
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
        }}>
        <MenuItem onClick={handleProfile} selected={isProfileActive}>
          <ListItemIcon>
            <AccountCircleIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='Profile' />
        </MenuItem>
        <MenuItem onClick={handleSettings} selected={isSettingsActive}>
          <ListItemIcon>
            <SettingsIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='Settings' />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon fontSize='small' />
          </ListItemIcon>
          <ListItemText primary='Logout' />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;
