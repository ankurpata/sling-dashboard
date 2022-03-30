import React, {useEffect, useRef} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Box from '@material-ui/core/Box';
import SearchIcon from '@material-ui/icons/Search';
import {Fonts} from '../../../../shared/constants/AppEnums';
import LayoutView from './LayoutEditView';
import {getWidgets} from '../../../../redux/actions';
import {useDispatch, useSelector} from 'react-redux';

const useStyles = makeStyles((theme) => ({
  boxLayoutView: {padding: '1.5em'},
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    marginTop: 5,
    marginBottom: 5,
  },
  textTruncate: {
    padding: '10px 0',
  },
  componentBox: {
    height: '8em',
    width: '100%',
    border: '1px solid #d6d3d3',
    borderRadius: '4px',
    justifyContent: 'center',
    margin: '0.5em',
    flex: '40%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

// fake data generator
const getItems = (count, offset = 0, classes) =>
  Array.from({length: count}, (v, k) => k).map((k) => {
    let content = `Widget ${k + offset}`;
    if (k == 0) {
      content = (
        <>
          <SearchIcon />
          <Box
            component='h6'
            className={classes.textTruncate}
            color='text.primary'
            fontWeight={Fonts.BOLD}>
            {'Search Bar'}
          </Box>
        </>
      );
    }
    return {
      id: `item-${k + offset}`,
      content,
    };
  });

const EditLayout = ({open, setOpen, titleKey, pageKey}) => {
  console.log(pageKey, 'pageKey')
  const classes = useStyles();
  const childRef = useRef();
  const dispatch = useDispatch();
  const {widgets} = useSelector(({widgets}) => widgets);

  useEffect(() => {
    dispatch(getWidgets({}));
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleRootSave = () => {
    childRef.current.saveLayoutConfig();
    handleClose();
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            onClick={handleClose}
            aria-label='close'>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant='h6' className={classes.title}>
            {titleKey} {' / Edit'}
          </Typography>
          <Button autoFocus color='inherit' onClick={handleClose}>
            Cancel
          </Button>
          <Button autoFocus color='inherit' onClick={handleRootSave}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <LayoutView
        getItems={getItems}
        widgets={widgets}
        ref={childRef}
        pageKey={pageKey}
        isEditable={true}
        key={'edit'}
      />
    </Dialog>
  );
};
export default EditLayout;
