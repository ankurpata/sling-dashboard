import React, {useEffect, useState} from 'react';
// import AddNewTask from '../AddNewTask';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Hidden,
  makeStyles,
  TextField,
} from '@material-ui/core';
import {grey} from '@material-ui/core/colors';
import {Build, Edit} from '@material-ui/icons';
import AppsHeader from '../../../@sling/core/AppsContainer/AppsHeader';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from 'next/link';
import {useDispatch, useSelector} from 'react-redux';
import orange from '@material-ui/core/colors/orange';
import {Fonts} from '../../../shared/constants/AppEnums';
import Box from '@material-ui/core/Box';
import AppSearch from '../../../@sling/core/SearchBar';
import DialogContentText from '@material-ui/core/DialogContentText';
import {
  deletePageTemplateAction,
  setLayoutConfig,
} from '../../../redux/actions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {FETCH_ERROR} from '../../../shared/constants/ActionTypes';

const useStyles = makeStyles((theme) => ({
  guideList: {display: 'flex', justifyContent: 'space-between'},
  root: {
    padding: theme.spacing(5, 4),
    height: '100%',
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  textField: {
    // paddingLeft: theme.spacing(1),
    // paddingRight: theme.spacing(1),
    // fontSize: 12,
  },
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  pagination: {
    paddingRight: 8,
    paddingLeft: 8,
    borderColor: grey[300],
    borderTopWidth: 1,
  },
  gridTileInfo: {
    // justifyContent: 'center',
    flexDirection: 'row',
    display: 'flex',
  },
  gridItemInfo: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  media: {
    height: 200,
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top',
    'background-position-y': '45%',
  },
  cardDesc: {
    height: '60px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: '3',
    lineClamp: 3,
    WebkitBoxOrient: 'vertical',
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  dashboardBtn: {
    backgroundColor: orange[500],
    color: theme.palette.primary.contrastText,
    fontWeight: Fonts.BOLD,
    paddingRight: 20,
    paddingLeft: 20,
    marginRight: 20,
    '&:hover, &:focus': {
      backgroundColor: orange[700],
      color: theme.palette.primary.contrastText,
    },
  },
  button: {
    color: theme.palette.primary.light,
    fontWeight: Fonts.BOLD,
    paddingRight: 10,
    marginRight: 10,
    paddingLeft: 10,
    '&:hover, &:focus': {
      backgroundColor: orange[700],
      color: theme.palette.primary.contrastText,
    },
  },
}));

const ModalPageTemplate = ({
  setOpen,
  open,
  edit,
  addPageTemplate,
  classes,
  currentTemplate = {},
}) => {
  const {
    description: descriptionInit,
    templateKey: templateKeyInit,
    title: titleInit,
  } = edit ? currentTemplate : {};
  const [templateKey, setTemplateKey] = useState(templateKeyInit);
  const [title, setTitle] = useState(titleInit);
  const [description, setDescription] = useState(descriptionInit);

  useEffect(() => {
    setTemplateKey(templateKeyInit);
    setTitle(titleInit);
    setDescription(descriptionInit);
  }, [templateKeyInit, descriptionInit, titleInit]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setTemplateKey('');
        setTitle('');
        setDescription('');
      }}>
      <DialogTitle>Add Template Id</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add a new page template, please enter a unique template id here.
          This template id will be used for each of the page routes which use
          this page template.
        </DialogContentText>
        <TextField
          autoFocus={true}
          className={classes.textField}
          margin='dense'
          placeholder='newyear-sale'
          id='templateId'
          label='Template Id'
          type='templateId'
          fullWidth
          value={templateKey}
          onChange={(e) => {
            const modifiedKey = e.target.value
              .replace(/[\W_-]/g, '-')
              .replace(/-+/g, '-');
            setTemplateKey(modifiedKey.toLowerCase());
          }}
          variant='standard'
        />
        <Box style={{marginTop: 20}}>
          {/*<Divider style={{marginTop: 15, marginBottom: 15}} />*/}
          <Box>
            {/*<Divider className={classes.divider} orientation='vertical' />*/}
            <Typography style={{fontSize: 14}} variant='h6'>
              Meta Info
            </Typography>
            <Box style={{padding: 5}}>
              <TextField
                className={classes.textField}
                margin='dense'
                placeholder='New Year Sale Template'
                id='title'
                label='Title for Template'
                type='title'
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant='standard'
              />
              <TextField
                className={classes.textField}
                rows={2}
                // error={!description?.length}
                maxRows={4}
                multiline={true}
                margin='dense'
                placeholder='This will be used for all the Promotional Landing Pages from Christmas to New Year'
                id='description'
                label='Small Description'
                type='description'
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant='standard'
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
            setTemplateKey('');
            setTitle('');
            setDescription('');
          }}>
          Cancel
        </Button>
        <Button
          onClick={() => addPageTemplate(templateKey, {title, description})}>
          {edit ? 'Save' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const PageTemplatesList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const layoutData = useSelector(({dashboard}) => dashboard.layoutData);
  const {layoutConfig = {}} = layoutData || {};
  const totalPageTemplates = Object.keys(layoutConfig).length;

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState({});
  const [showDelete, setShowDelete] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // To control delete confirmation dialog
  const [templateToDelete, setTemplateToDelete] = useState(null); // To hold the template being deleted

  const addPageTemplate = (pageKey, meta) => {
    if (!pageKey || !meta?.title || !meta?.description) {
      dispatch({
        type: FETCH_ERROR,
        payload: 'Please add valid values for the new template',
      });
      return;
    }
    setOpen(false);
    const rootObj = !edit ? {root: {header: {}, body: {}, footer: {}}} : {};
    dispatch(setLayoutConfig({pageKey, meta, isNewRecord: !edit, ...rootObj}));
  };

  const handleDeleteConfirm = () => {
    if (!allowDelete) {
      return;
    }
    if (templateToDelete) {
      dispatch(deletePageTemplateAction({pageKey: templateToDelete}));
      setTemplateToDelete(null); // Reset after deletion
    }
    setDeleteDialogOpen(false); // Close the dialog after deletion
  };

  const deletePageTemplate = (pageKey) => {
    setTemplateToDelete(pageKey);
    setDeleteDialogOpen(true); // Open the delete confirmation dialog
  };

  // Make allowDelete to true only if the environment variable is set to true, if not set do not let user delete
  const params = new URLSearchParams(search);
  const isAdmin = params.get('isAdmin');
  const allowDelete =
    isAdmin || process.env.NEXT_PUBLIC_DISABLE_DELETE !== 'true';

  return (
    <>
      <AppsHeader style={{justifyContent: 'space-between'}}>
        <Box>All Page Templates</Box>
        <Box display='flex' alignItems='center'>
          <Button
            className={classes.dashboardBtn}
            aria-label='add'
            onClick={() => {
              setCurrentTemplate({});
              setEdit(false);
              setOpen(true);
            }}>
            Add Template
          </Button>
          <Hidden mdDown>
            <AppSearch
              placeholder='Search templates'
              onChange={(e) => e.target.value}
            />
          </Hidden>
        </Box>
      </AppsHeader>
      <Paper className={classes.root}>
        <ModalPageTemplate
          edit={edit}
          currentTemplate={currentTemplate}
          open={open}
          classes={classes}
          setOpen={setOpen}
          addPageTemplate={addPageTemplate}
        />
        <Grid container className={classes.guideList} spacing={10}>
          <Grid item className={classes.gridItemInfo} sm={12} md={12} lg={12}>
            <Typography
              component='p'
              style={{fontSize: 18, fontWeight: 'bold'}}>
              List of available Page Templates.
            </Typography>
            <Typography component='p'>
              Showing {totalPageTemplates} templates
            </Typography>
          </Grid>
          <Grid container className={classes.gridTileInfo}>
            {Object.keys(layoutConfig)
              .reverse()
              .map((v, k) => {
                const {meta} = layoutConfig[v] || {};
                const {title, description} = meta || {};
                return (
                  <Grid
                    key={k}
                    item
                    sm={12}
                    md={6}
                    lg={4}
                    style={{borderColor: 'black', padding: 10}}
                    onMouseOver={() => setShowDelete({[v]: true})}
                    onMouseOut={() => setShowDelete({})}>
                    <Card className={classes.card}>
                      <CardActionArea>
                        {showDelete[v] && (
                          <IconButton
                            aria-label='delete'
                            onClick={() => deletePageTemplate(v)} // Trigger confirmation dialog
                            style={{
                              position: 'absolute',
                              right: 8,
                              top: 8,
                              color: (theme) => theme.palette.grey[500],
                            }}>
                            <CloseIcon />
                          </IconButton>
                        )}
                        <CardMedia
                          className={classes.media}
                          image={'/images/cards/pagelayout_default.png'}
                          title={title}
                        />
                        <CardContent>
                          <Typography
                            gutterBottom
                            className={classes.templateTitle}
                            variant='h5'
                            component='h2'>
                            {title}
                          </Typography>
                          <Typography
                            variant='body2'
                            className={classes.cardDesc}
                            color='text.secondary'
                            component='p'>
                            {description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions
                        style={{display: 'flex', justifyContent: 'right'}}>
                        <Link
                          href={`/pages/${v}/layout`}
                          passHref
                          legacyBehavior>
                          <Button className={classes.button} aria-label='Edit'>
                            <Build style={{width: '20px', margin: '0 5px'}} />{' '}
                            Configure
                          </Button>
                        </Link>
                        <Button
                          className={classes.button}
                          onClick={() => {
                            setOpen(true);
                            setEdit(true);
                            setCurrentTemplate({
                              templateKey: v,
                              title,
                              description,
                            });
                          }}>
                          <Edit style={{width: '20px', margin: '0 5px'}} />
                          Edit Meta
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </Grid>

        {/* Confirmation Dialog for Delete */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          aria-labelledby='delete-dialog-title'
          aria-describedby='delete-dialog-description'>
          <DialogTitle id='delete-dialog-title'>{'Confirm Delete'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='delete-dialog-description'>
              Are you sure you want to delete this page template? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color='grey'>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={!allowDelete}
              color='secondary'
              autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
};

export default PageTemplatesList;
