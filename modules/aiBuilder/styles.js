import {makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.4em',
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
      outline: '1px solid slategrey',
    },
    body: {
      margin: 0,
      padding: 0,
      minHeight: '100vh',
    },
  },
  root: {
    minHeight: '100vh',
    position: 'relative',
    color: '#111827',
    display: 'flex',
    flexDirection: 'column',
    transition: 'background 0.3s ease-in-out',
    background: (props) => !props.showCanvas ? 
      'radial-gradient(circle at center, #ffffff 0%, #f0f9ff 35%, #e0f2fe 50%, #f0f9ff 65%, #ffffff 100%)' : 
      '#ffffff',
    '&::before': (props) => !props.showCanvas ? {
      content: '""',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 1,
      transition: 'opacity 0.3s ease-in-out',
      background:
        'radial-gradient(circle at center, rgba(255,255,255,0) 0%, rgba(240,249,255,0.15) 35%, rgba(224,242,254,0.15) 50%, rgba(240,249,255,0.15) 65%, rgba(255,255,255,0) 100%)',
      pointerEvents: 'none',
      zIndex: 0,
    } : {
      opacity: 0,
      content: '""',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
    },
  },
  main: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 'calc(100vh - 64px)',
    textAlign: 'center',
    padding: theme.spacing(20, 4),
  },
  heartLogo: {
    marginBottom: theme.spacing(8),
    zIndex: 1,
    '& img': {
      height: 100,
    },
  },
  title: {
    fontSize: '5.6rem',
    fontWeight: 300,
    marginBottom: theme.spacing(3),
    letterSpacing: '-0.02em',
    lineHeight: 1,
    minHeight: '1.2em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#111827',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: '0.875rem',
    marginBottom: theme.spacing(8),
    maxWidth: 600,
    opacity: 0.9,
  },
  fadeIn: {
    animation: '$fadeIn 0.5s ease-in',
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  searchInput: {
    width: '100%',
    maxWidth: 700,
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(6),
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'white',
      borderRadius: 12,
      height: 64,
      '& fieldset': {
        borderColor: '#E5E7EB',
      },
      '&:hover fieldset': {
        borderColor: '#D1D5DB',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#4ECDC4',
      },
    },
    '& .MuiOutlinedInput-input': {
      color: '#111827',
      fontSize: '1.1rem',
      '&::placeholder': {
        color: '#6B7280',
        opacity: 1,
      },
    },
  },
  templates: {
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(8),
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
    '& button': {
      backgroundColor: 'rgba(255,255,255,0.9)',
      color: '#111827',
      borderRadius: 24,
      padding: theme.spacing(1.5, 3),
      fontSize: '0.95rem',
      textTransform: 'none',
      border: '1px solid rgba(0,0,0,0.1)',
      backdropFilter: 'blur(8px)',
      fontWeight: 500,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: 'rgba(255,255,255,1)',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
    },
  },
  projectTabs: {
    display: 'flex',
    gap: theme.spacing(4),
    marginBottom: theme.spacing(4),
    '& button': {
      color: '#6B7280',
      padding: theme.spacing(1, 0),
      minWidth: 'auto',
      textTransform: 'none',
      fontSize: '0.95rem',
      '&:hover': {
        color: '#111827',
        backgroundColor: 'transparent',
      },
    },
  },
  inputContainer: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
  },
  repoButton: {
    color: "#fff",
    height: "62px",
    marginTop: "9px",
    padding: "0px 12px",
    fontSize: "1rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    fontWeight: 500,
    whiteSpace: "nowrap",
    borderRadius: "8px",
    textTransform: "none",
    backgroundColor: "#0b111e",
    border: "none",
    transition: "all 0.2s ease-in-out",
    '&:hover': {
      backgroundColor: "#1a1f2e",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
    '& .MuiSvgIcon-root': {
      marginRight: theme.spacing(1),
      fontSize: '1.2rem',
    },
  },
  // Dialog styles
  dialogPaper: {
    borderRadius: 8,
    padding: 8,
  },
  dialogContent: {
    '& .MuiDialogContentText-root': {
      color: '#4b5563',
    },
  },
  dialogActions: {
    padding: theme.spacing(2),
  },
  cancelButton: {
    textTransform: 'none',
    color: '#6b7280',
  },
  continueButton: {
    backgroundColor: '#0b111e',
    color: '#fff',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#1a1f2e',
    },
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
    padding: theme.spacing(2.5, 3),
    // borderRadius: theme.shape.borderRadius,
    borderBottom: `1px solid ${theme.palette.divider}`,
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
