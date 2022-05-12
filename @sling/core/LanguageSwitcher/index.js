import React, {useEffect} from 'react';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core';
import {Fonts} from '../../../shared/constants/AppEnums';
import Button from '@material-ui/core/Button';
import orange from '@material-ui/core/colors/orange';
import {useDispatch, useSelector} from 'react-redux';
import {getCompanyInfo} from '../../../redux/actions/AccountAction';

const LanguageSwitcher = (props) => {
  const {account} = useSelector(({account}) => account);
  const {user} = useSelector(({auth}) => auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (account == null || account == '') {
      dispatch(getCompanyInfo(user.email));
    }
  }, [dispatch]);

  const useStyles = makeStyles((theme) => ({
    langBtn: {
      justifyContent: 'flex-start',
      width: '100%',
      height: 56,
      fontSize: 16,
      borderRadius: 0,
      paddingLeft: '0.45rem',
      paddingRight: '1rem',
      paddingTop: '0.25rem',
      paddingBottom: '0.25rem',
      marginTop: '-10px',
      color: theme.palette.text.primary,
      '&:hover, &:focus': {
        color: theme.palette.text.primary,
      },
      [theme.breakpoints.up('sm')]: {
        minHeight: 70,
      },
      [theme.breakpoints.up('md')]: {
        fontWeight: Fonts.MEDIUM,
        justifyContent: 'center',
        width: 'auto',
        borderLeft: 'solid 1px',
        borderLeftColor: theme.palette.grey[200],
        textTransform: 'uppercase',
        marginTop: 0,
        color: theme.palette.text.primary,
        '&:hover, &:focus': {
          color: theme.palette.text.primary,
        },
      },
      [theme.breakpoints.up('lg')]: {
        fontSize: 14,
        paddingLeft: '0.75rem',
        paddingRight: '1.5rem',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
      },
      [theme.breakpoints.up('xl')]: {
        paddingLeft: '1.25rem',
        paddingRight: '2.5rem',
      },
      '&.langIconOnly': {
        paddingLeft: '0.8rem',
        paddingRight: '0.8rem',
        paddingTop: '0.25rem',
        paddingBottom: '0.25rem',
        height: 56,
        borderLeft: '0 none',
        borderRadius: '50%',
        [theme.breakpoints.up('sm')]: {
          height: 70,
        },
        [theme.breakpoints.up('xl')]: {
          paddingLeft: '12px',
          paddingRight: '12px',
          width: '100%',
        },
      },
    },
    overflowHidden: {
      overflow: 'hidden',
    },
    alignMiddle: {
      verticalAlign: 'middle',
      display: 'inline-block',
    },
    textUppercase: {
      textTransform: 'uppercase',
    },
    dashboardBtn: {
      backgroundColor: orange[500],
      color: theme.palette.primary.contrastText,
      fontWeight: Fonts.BOLD,
      paddingRight: 20,
      marginRight: 20,
      paddingLeft: 20,
      '&:hover, &:focus': {
        backgroundColor: orange[700],
        color: theme.palette.primary.contrastText,
      },
    },
  }));

  const classes = useStyles(props);
  console.log(account, '[account]');
  return (
    <Box style={{display: 'flex', alignItems: 'center'}}>
      <a
        target={'_blank'}
        style={{textDecoration: 'none'}}
        href={`${account?.clientUrl || '/'}`}
        rel='noreferrer'>
        <Button className={classes.dashboardBtn} color='primary'>
          Frontend
        </Button>
      </a>
      {/*<IconButton*/}
      {/*  className={clsx(*/}
      {/*    classes.langBtn,*/}
      {/*    {*/}
      {/*      langIconOnly: iconOnly,*/}
      {/*    },*/}
      {/*    'langBtn',*/}
      {/*  )}*/}
      {/*  aria-label='account of current user'*/}
      {/*  aria-controls='language-switcher'*/}
      {/*  aria-haspopup='true'*/}
      {/*  onClick={onClickMenu}*/}
      {/*  color='inherit'>*/}
      {/*  {!iconOnly ? (*/}
      {/*    <>*/}
      {/*      <Box*/}
      {/*        component='span'*/}
      {/*        mr={{xs: 2, md: 3}}*/}
      {/*        height={48}*/}
      {/*        width={48}*/}
      {/*        display='flex'*/}
      {/*        alignItems='center'*/}
      {/*        justifyContent='center'*/}
      {/*        borderRadius='50%'*/}
      {/*        className={classes.overflowHidden}>*/}
      {/*        <i className={`flag flag-24 flag-${locale.icon}`} />*/}
      {/*      </Box>*/}
      {/*      <Box*/}
      {/*        component='span'*/}
      {/*        fontSize={16}*/}
      {/*        fontFamily='Poppins'*/}
      {/*        fontWeight={Fonts.REGULAR}*/}
      {/*        display='inline-block'>*/}
      {/*        {locale.name}*/}
      {/*      </Box>*/}
      {/*    </>*/}
      {/*  ) : (*/}
      {/*    <Box>*/}
      {/*      <i className={`flag flag-24 flag-${locale.icon}`} />*/}
      {/*    </Box>*/}
      {/*  )}*/}
      {/*</IconButton>*/}
      {/*<Menu*/}
      {/*  anchorEl={anchorElLng}*/}
      {/*  id='language-switcher'*/}
      {/*  keepMounted*/}
      {/*  open={Boolean(anchorElLng)}*/}
      {/*  onClose={() => setAnchorElLng(null)}>*/}
      {/*  {languageData.map((language, index) => (*/}
      {/*    <MenuItem key={index} onClick={() => changeLanguage(language)}>*/}
      {/*      <Box*/}
      {/*        width={160}*/}
      {/*        display='flex'*/}
      {/*        flexDirection='row'*/}
      {/*        alignItems='center'>*/}
      {/*        <i className={`flag flag-24 flag-${language.icon}`} />*/}
      {/*        <Box*/}
      {/*          component='h4'*/}
      {/*          ml={4}*/}
      {/*          mb={0}*/}
      {/*          fontSize={{xs: 14, xl: 16}}*/}
      {/*          fontWeight={Fonts.MEDIUM}>*/}
      {/*          {language.name}*/}
      {/*        </Box>*/}
      {/*      </Box>*/}
      {/*    </MenuItem>*/}
      {/*  ))}*/}
      {/*</Menu>*/}
    </Box>
  );
};

export default LanguageSwitcher;

LanguageSwitcher.defaultProps = {
  iconOnly: false,
};

LanguageSwitcher.propTypes = {
  iconOnly: PropTypes.bool,
};
