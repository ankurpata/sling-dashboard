import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import Header from '../../modules/aiBuilder/components/Header';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
  },
  content: {
    paddingTop: theme.spacing(8),
  },
}));

const MainLayout = ({ children }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Header />
      <Box className={classes.content}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
