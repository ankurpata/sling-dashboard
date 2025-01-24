import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiClient, { apiEndpoints } from '../config/api';
import { v4 as uuidv4 } from 'uuid';

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
    // Check localStorage for user data on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (provider) => {
    try {
      const state = uuidv4();
      localStorage.setItem('oauthState', state);

      // Construct OAuth URL based on provider
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const redirectUri = 'http://localhost:5001/auth/google/callback';
      const scope = 'email profile';
      
      let authUrl;
      if (provider === 'google') {
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
      } else if (provider === 'github') {
        authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&state=${state}`;
      }

      window.location.href = authUrl;
    } catch (error) {
      console.error('Login error:', error);
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
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('oauthState');
    localStorage.removeItem('userId');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('repositories');
    localStorage.removeItem('selectedRepository');
    localStorage.removeItem('token');
    // Add any other cleanup needed
    router.push('/');
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  useEffect(() => {
    // Handle OAuth callback
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const userName = params.get('name');
    const userEmail = params.get('email');
    const userPicture = params.get('picture');

    if (userId) {
      const userData = {
        id: userId,
        name: userName,
        email: userEmail,
        picture: userPicture
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, login, logout, handleOAuthCallback, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
