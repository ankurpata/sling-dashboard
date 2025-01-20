import React, {useContext} from 'react';
import Avatar from '@material-ui/core/Avatar';
import {useDispatch} from 'react-redux';
import {
  onCognitoUserSignOut,
  onJwtAuthSignout,
  onSignOutAuth0User,
  onSignOutFirebaseUser,
} from '../../../redux/actions';
import {useAuthUser} from '../../../@sling/utility/AppHooks';
import AppContext from '../../../@sling/utility/AppContext';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Box from '@material-ui/core/Box';
import {orange} from '@material-ui/core/colors';
import {AuthType, Fonts} from '../../constants/AppEnums';

const useStyles = makeStyles((theme) => {
  return {
    slUserInfo: {
      backgroundColor: 'rgba(0,0,0,.08)',
      paddingTop: 9,
      paddingBottom: 9,
      minHeight: 56,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      [theme.breakpoints.up('sm')]: {
        paddingTop: 10,
        paddingBottom: 10,
        minHeight: 70,
      },
    },
    profilePic: {
      fontSize: 24,
      backgroundColor: orange[500],
    },
    userInfo: {
      width: 'calc(100% - 75px)',
    },
    userName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontSize: 16,
      fontWeight: Fonts.MEDIUM,
      color: (props) => (props.themeMode === 'light' ? '#313541' : 'white'),
    },
    designation: {
      marginTop: -2,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: theme.palette.text.secondary,
    },
    pointer: {
      cursor: 'pointer',
    },
  };
});

const UserInfo = (props) => {
  const {themeMode} = useContext(AppContext);
  const dispatch = useDispatch();
  const user = useAuthUser();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getUserAvatar = () => {
    if (user.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
  };

  const classes = useStyles({themeMode});

  return (
    <Box
      px={{xs: 4, xl: 7}}
      className={clsx(classes.slUserInfo, 'sl-user-info')}>
      <Box display='flex' alignItems='center'>
        {user.photoURL ? (
          <Avatar className={classes.profilePic} src={user.photoURL} />
        ) : (
          <Avatar className={classes.profilePic}>{getUserAvatar()}</Avatar>
        )}
        <Box ml={4} className={clsx(classes.userInfo, 'user-info')}>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'>
            <Box mb={0} className={clsx(classes.userName)}>
              {user.displayName ? user.displayName : 'Admin User '}
            </Box>
            <Box
              ml={3}
              className={classes.pointer}
              color={themeMode === 'light' ? '#313541' : 'white'}>
              <ExpandMoreIcon onClick={handleClick} />
              <Menu
                id='simple-menu'
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                <MenuItem>My account</MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(onJwtAuthSignout());
                  }}>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          <Box className={classes.designation}>Admin</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserInfo;
