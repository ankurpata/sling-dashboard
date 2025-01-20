import {makeStyles} from '@material-ui/core';
import {ThemeStyle} from '../../../../shared/constants/AppEnums';

const useStyles = makeStyles((theme) => {
  return {
    appMain: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      backgroundColor: '#ffffff',
      paddingTop: 56,
      [theme.breakpoints.up('sm')]: {
        paddingTop: 70,
      },
      '&.appMainFixedFooter': {
        paddingBottom: 48,
        [theme.breakpoints.up('xl')]: {
          paddingBottom: 58,
        },
        '& .scrollAppSidebar': {
          height: (props) =>
            props.themeStyle === ThemeStyle.MODERN
              ? 'calc(100vh - 260px) !important'
              : 'calc(100vh - 198px) !important',
          [theme.breakpoints.up('xl')]: {
            height: (props) =>
              props.themeStyle === ThemeStyle.MODERN
                ? 'calc(100vh - 300px) !important'
                : 'calc(100vh - 236px) !important',
          },
        },
        '& $mainContainer': {
          paddingBottom: 1,
        },
      },
    },
    aiBuilderMain: {
      backgroundColor: '#ffffff !important',
      '& $mainContainer': {
        backgroundColor: '#ffffff !important',
      },
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      [theme.breakpoints.up('lg')]: {
        marginLeft: '4rem',
      },
      [theme.breakpoints.up('xl')]: {
        marginLeft: '5rem',
      },
    },
    mainContainer: {
      width: '100%',
      paddingBottom: (props) => (props.footer ? 0 : 10),
      [theme.breakpoints.up('lg')]: {
        width: 'calc(100vw - 4rem)',
      },
      [theme.breakpoints.up('xl')]: {
        width: 'calc(100vw - 5rem)',
      },
      '& > .scrollbar-container': {
        padding: '20px 20px 0',
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.up('md')]: {
          padding: '30px 32px 0',
        },
      },
    },
    mainContainerFull: {
      width: '100vw',
      paddingBottom: (props) => (props.footer ? 0 : 10),
      '& > .scrollbar-container': {
        padding: '20px 20px 0',
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.up('md')]: {
          padding: '30px 32px 0',
        },
      },
    },
    boxedLayout: {
      [theme.breakpoints.up('lg')]: {
        maxWidth: 1260,
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow: '0px 0px 4px 2px rgba(0,0,0,0.12)',
        '& .app-sidebar': {
          position: 'absolute',
        },
        '& .fixed-footer': {
          position: 'sticky',
          width: '100%',
        },
        '& $mainContent': {
          width: 'calc(100% - 19rem)',
          flex: 'auto',
        },
        '& $mainContainer': {
          width: '100%',
        },
        '& .app-bar': {
          width: '100%',
          position: 'absolute',
          boxShadow: '0px 0px 4px 2px rgba(0,0,0,0.12)',
        },
        '& .grid-btn': {
          fontSize: 11,
        },
        '& .app-header-fixed': {
          position: 'absolute',
        },
      },
      [theme.breakpoints.up('xl')]: {
        maxWidth: 1680,
        '& $mainContent': {
          width: 'calc(100% - 21.6rem)',
        },
      },
    },
  };
});
export default useStyles;
