import React from 'react';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import {useIntl} from 'react-intl';
import {Fonts} from '../../../../shared/constants/AppEnums';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import ApiCheckList from './ApiCheckList';
import orange from '@material-ui/core/colors/orange';
import AppsHeader from '../../../../@sling/core/AppsContainer/AppsHeader';
import {SHOW_MESSAGE} from '../../../../shared/constants/ActionTypes';
import {useDispatch} from "react-redux";

const DataSource = (props) => {
  const useStyles = makeStyles((theme) => ({
    divider: {
      marginTop: 20,
      marginBottom: 20,
    },
    dataSourceLabel: {
      width: '100%',
      margin: theme.spacing(3),
    },
    fullWidth: '100%',
    apiCard: {
      width: '100%',
      background: '#f1f1f1',
      border: '1px solid #eae8e8',
      borderRadius: '5px',
      padding: 15,
    },
    formControl: {
      margin: theme.spacing(3),
    },
    button: {
      backgroundColor: orange[500],
      color: theme.palette.primary.contrastText,
      fontWeight: Fonts.BOLD,
      paddingRight: 20,
      paddingLeft: 20,
      '&:hover, &:focus': {
        backgroundColor: orange[700],
        color: theme.palette.secondary.contrastText,
      },
    },
    disabledOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgb(205 203 203 / 70%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    disabledMessage: {
      color: 'white',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: '16px 32px',
      borderRadius: '4px',
      fontWeight: 500,
      fontSize: '1.2rem',
      textAlign: 'center',
    },
    root: {
      position: 'relative',
      height: '100%',
    },
    boxSection: {
      background: '#f1f1f1',
      border: '1px solid #eae8e8',
      borderRadius: '5px',
      padding: 15,
    }
  }));

  const classes = useStyles(props);

  const {messages} = useIntl();
  const {titleKey} = props;
  const dispatch = useDispatch();

  return (
    <Box className={classes.root}>
      <div className={classes.disabledOverlay}>
        <div className={classes.disabledMessage}>
          Coming Soon: Advanced Data Integration Features
        </div>
      </div>
      <AppsHeader>
        <Box fontWeight={Fonts.BOLD} component='h3'>
          Data Source
        </Box>
      </AppsHeader>
      <Box px={6} py={8}>
        <Box fontWeight={Fonts.MEDIUM} component='h5' mb={2}>
          Pick list of your Headless Data Apis to be fetched in the server side
          rendered page.
        </Box>
        <Box p={6} mb={0} className={classes.boxSection}>
          <ApiCheckList classes={classes} />
        </Box>
        <Box p={6} pt={0} pb={0} mb={0} className={classes.boxSection}>
          <FormControlLabel
            control={<Switch value='checkedC' />}
            label='Cache Api response'
          />
        </Box>

        <Divider className={classes.divider} />

        <Button
          className={classes.button}
          onClick={() => {
            dispatch({
              type: SHOW_MESSAGE,
              payload: `Sling is running in read-only mode. Changes will not be saved.`,
            });
          }}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default DataSource;
