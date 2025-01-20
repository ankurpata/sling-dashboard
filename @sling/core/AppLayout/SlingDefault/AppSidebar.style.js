import {makeStyles} from '@material-ui/core';
import {ThemeMode} from '../../../../shared/constants/AppEnums';

const useStyles = makeStyles((theme) => {
  return {
    miniSidebar: {
      zIndex: 1109,
      width: '19rem',
      height: `calc(100vh - 70px)`,
      transition: 'all 0.5s ease',

      [theme.breakpoints.up('lg')]: {
        width: '4rem',
        position: 'fixed',
        left: 0,

        '& .nav-item-text, & .nav-item-icon-arrow': {
          opecity: 0,
          visibility: 'hidden',
        },

        '& .nav-item-header, & .user-info, & .collapse-children': {
          display: 'none',
        },
      },

      [theme.breakpoints.up('xl')]: {
        width: '5rem',
      },

      '& .sl-user-info': {
        paddingLeft: '10px !important',
        paddingRight: '10px !important',
        transition: 'all 0.5s ease',

        [theme.breakpoints.up('xl')]: {
          paddingLeft: '12px !important',
          paddingRight: '12px !important',
        },
      },

      '& .nav-item-icon': {
        transition: 'all 0.5s ease',
        display: 'block',

        [theme.breakpoints.up('lg')]: {
          marginRight: '5px !important',
          marginLeft: '5px !important',
        },

        [theme.breakpoints.up('xl')]: {
          marginRight: '0 !important',
          marginLeft: '0 !important',
        },
      },

      '& .nav-item': {
        // width: 48,
        paddingLeft: 17,
        // marginLeft: ,

        // borderRadius: '50%',

        [theme.breakpoints.up('xl')]: {
          height: 48,
          paddingLeft: 13,
          marginLeft: 12,
        },
      },

      '&:hover': {
        [theme.breakpoints.up('lg')]: {
          width: '14.6rem',

          '& .nav-item-text, & .nav-item-icon-arrow': {
            opecity: 1,
            visibility: 'visible',
          },

          '& .nav-item-header, & .user-info, & .collapse-children': {
            display: 'block',
          },

          '& .nav-item-icon': {
            marginLeft: '0 !important',
          },

          '& .nav-item': {
            width: 'calc(100% - 16px)',
            paddingLeft: 17,
            marginLeft: 0,
            borderRadius: '0 30px 30px 0',
          },
          '& .collapse-children .nav-item': {
            paddingLeft: 67,
          },
          '& .collapse-children .collapse-children .nav-item': {
            paddingLeft: 117,
          },
          '& .collapse-children .collapse-children .collapse-children .nav-item': {
            paddingLeft: 167,
          },
        },

        [theme.breakpoints.up('xl')]: {
          '& .nav-item': {
            paddingLeft: 24,
            marginLeft: 0,
          },
          '& .collapse-children .nav-item': {
            paddingLeft: 74,
          },
          '& .collapse-children .collapse-children .nav-item': {
            paddingLeft: 124,
          },
          '& .collapse-children .collapse-children .collapse-children .nav-item': {
            paddingLeft: 174,
          },
        },
      },
    },
    sidebarBg: {
      backgroundColor: (props) =>
        props.themeMode === ThemeMode.SEMI_DARK
          ? theme.palette.sidebar.bgColor
          : props.themeMode === ThemeMode.LIGHT
          ? 'white'
          : '#313541',
    },
    scrollAppSidebar: {
      borderRight: '1px solid #eae8e8',
      paddingTop: 8,
      paddingBottom: 20,
    },
    drawerScrollAppSidebar: {
      paddingTop: 8,
      paddingBottom: 20,
    },
    sidebarStandard: {
      height: '100%',
      width: '100%',
      color: 'white',
      overflow: 'hidden',
    },
  };
});
export default useStyles;
