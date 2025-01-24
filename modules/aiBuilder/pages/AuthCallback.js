import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Box, CircularProgress, Typography } from '@material-ui/core';

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleOAuthCallback } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/signin?error=auth_failed');
      return;
    }

    if (!code || !state) {
      navigate('/signin?error=invalid_response');
      return;
    }

    // Determine the provider from state or URL path
    const provider = state.includes('github') ? 'github' : 'google';
    
    // Handle the OAuth callback
    handleOAuthCallback(code, state, provider);
  }, [location, handleOAuthCallback, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#000"
      color="#fff"
    >
      <CircularProgress color="inherit" />
      <Typography style={{ marginTop: 16 }}>
        Completing sign in...
      </Typography>
    </Box>
  );
};

export default AuthCallback;
