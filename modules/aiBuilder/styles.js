import {makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  container: {
    margin: '0 auto',
    paddingTop: theme.spacing(8),
    maxWidth: 800,
  },
  searchWrapper: {
    position: 'relative',
    marginBottom: theme.spacing(6),
  },
  searchInput: {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1, 2),
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'box-shadow 0.2s ease-in-out',
      '&:hover': {
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      },
      '&.Mui-focused': {
        boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
      },
      '& textarea': {
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(2),
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      '& .MuiOutlinedInput-inputMultiline': {
        padding: '12px 14px',
        marginTop: 15,
        marginRight: 25,
      },
    },
  },
  actionButtons: {
    position: 'absolute',
    right: theme.spacing(1),
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    gap: theme.spacing(1),
    padding: theme.spacing(0.5),
    '& .MuiIconButton-root': {
      padding: theme.spacing(1),
      transition: 'all 0.2s',
      color: theme.palette.text.secondary,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
        transform: 'scale(1.1)',
        color: theme.palette.primary.main,
      },
    },
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },
  cardMedia: {
    height: 160,
    backgroundColor: theme.palette.grey[800],
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    fontWeight: 500,
    color: theme.palette.text.primary,
    fontSize: '2.5rem',
    lineHeight: 1.2,
  },
  sectionTitle: {
    marginBottom: theme.spacing(3),
  },
  canvas: {
    display: 'flex',
    gap: theme.spacing(3),
    // marginTop: theme.spacing(3),
    height: 'calc(100vh - 250px)',
    minHeight: '600px',
  },
  progress: {
    flex: '0 0 30%',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  preview: {
    flex: '0 0 70%',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  previewHeader: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  progressItem: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  processingView: {
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  tabRoot: {
    minWidth: 'auto',
    padding: '6px 12px',
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: '0.875rem',
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    },
  },
  tabsRoot: {
    minHeight: 'auto',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  tabsIndicator: {
    backgroundColor: theme.palette.primary.main,
  },
  liveProvider: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  livePreview: {
    flex: 1,
    padding: theme.spacing(2),
    backgroundColor: '#fff',
    borderRadius: theme.shape.borderRadius,
    minHeight: '500px',
  },
  liveEditor: {
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
  },
  liveError: {
    padding: theme.spacing(2),
    color: theme.palette.error.main,
    backgroundColor: theme.palette.error.light,
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2),
  },
}));
