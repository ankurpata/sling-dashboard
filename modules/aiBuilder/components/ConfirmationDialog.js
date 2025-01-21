import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
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
}));

const ConfirmationDialog = ({ open, onClose, onConfirm }) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      PaperProps={{
        className: classes.dialogPaper
      }}
    >
      <DialogContent className={classes.dialogContent}>
        <DialogContentText>
          Do you want to proceed with generating the code?
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button 
          onClick={onClose}
          className={classes.cancelButton}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm}
          className={classes.continueButton}
          variant="contained"
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
