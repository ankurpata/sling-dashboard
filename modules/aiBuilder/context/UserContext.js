import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiClient, { apiEndpoints } from '../config/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const userId = localStorage.getItem('userId');
    const userProfile = localStorage.getItem('userProfile');
    if (userId && userProfile) {
      setUser(JSON.parse(userProfile));
    }
    setLoading(false);
  }, []);

  const login = async (provider) => {
    try {
      if (provider === 'google') {
        // Google OAuth flow
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) {
          throw new Error('Google client ID not configured');
        }

        // Generate random state for security
        const state = Math.random().toString(36).substring(7);
        localStorage.setItem('oauthState', state);

        // Construct Google OAuth URL
        const redirectUri = 'http://localhost:5001/auth/google/callback';
        const scope = 'email profile';
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;

        // Redirect to Google
        window.location.href = googleAuthUrl;
      } else if (provider === 'github') {
        // GitHub OAuth flow (similar to Google)
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
        if (!clientId) {
          throw new Error('GitHub client ID not configured');
        }

        const state = Math.random().toString(36).substring(7);
        localStorage.setItem('oauthState', state);

        const redirectUri = `${window.location.origin}/auth/callback`;
        const scope = 'read:user user:email repo';
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

        window.location.href = githubAuthUrl;
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle error (show notification, etc.)
    }
  };

  const handleOAuthCallback = async (code, state, provider) => {
    try {
      // Verify state to prevent CSRF
      const savedState = localStorage.getItem('oauthState');
      if (state !== savedState) {
        throw new Error('Invalid OAuth state');
      }

      // Exchange code for tokens
      const response = await apiClient.post(`/api/auth/${provider}/callback`, {
        code,
        redirectUri: `${window.location.origin}/auth/callback`
      });

      const { user: userData, token } = response.data;

      // Save auth data
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userProfile', JSON.stringify(userData));
      
      // Update state
      setUser(userData);

      // Clear OAuth state
      localStorage.removeItem('oauthState');

      // Redirect back to home
      router.push('/');
    } catch (error) {
      console.error('OAuth callback error:', error);
      router.push('/signin?error=auth_failed');
    }
  };

  const logout = () => {
    // Clear user-related data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('repositories');
    localStorage.removeItem('selectedRepository');
    localStorage.removeItem('token');
    localStorage.removeItem('oauthState');
    
    // Clear user state
    setUser(null);
    
    // Navigate to home page
    router.push('/');
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, handleOAuthCallback }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
