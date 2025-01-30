'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';
import userService from '../services/userService';

const UserContext = createContext();

const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Basic JWT validation
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) return false;
    
    // Check expiration if token is JWT
    const decodedPayload = JSON.parse(atob(payload));
    if (decodedPayload.exp) {
      return decodedPayload.exp * 1000 > Date.now();
    }
    return true;
  } catch {
    return false;
  }
};

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleAuthentication = async (userId, token) => {
    try {
      if (!userId || !token || !isTokenValid(token)) {
        console.error('Invalid authentication data');
        return null;
      }

      // Store authentication data
      localStorage.setItem('userId', userId);
      localStorage.setItem('token', token);

      // Fetch user data with the new token
      return await fetchUserInfo(userId);
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  };

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedOrg');
    localStorage.removeItem('oauth_state');
    
    // Reset state
    setUser(null);
    setOrganizations([]);
    setSelectedOrg(null);
    
    // Redirect to home
    router.push('/');
  };

  const login = async (provider = 'google') => {
    const state = {
      provider,
      nonce: uuidv4(),
      timestamp: Date.now()
    };
    const stateStr = JSON.stringify(state);
    localStorage.setItem('oauth_state', stateStr);
    
    if (provider === 'github') {
      const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
      const redirectUri = 'http://localhost:5001/auth/github/callback';
      const scope = 'repo read:user user:email read:org';
      const encodedState = encodeURIComponent(stateStr);
      
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${encodedState}`;
    } else {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      const redirectUri = 'http://localhost:5001/auth/google/callback';
      const scope = 'email profile';
      const encodedState = encodeURIComponent(stateStr);
      
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${encodedState}`;
    }
  };

  const fetchUserInfo = async (userId) => {
    try {
      setLoading(true);
      console.log('Fetching user info for userId:', userId);
      
      // Check token validity before making request
      const token = localStorage.getItem('token');
      if (!isTokenValid(token)) {
        console.error('Invalid or expired token');
        logout();
        return null;
      }

      const response = await userService.getUserInfo(userId);
      console.log('API Response:', response);
      
      const userData = {
        id: response._id,
        name: response.displayName || response.googleName,
        email: response.email,
        avatar: response.avatarUrl,
        isGithubConnected: response.isGithubConnected,
        isGoogleConnected: response.isGoogleConnected,
        githubUsername: response.githubUsername,
        organizations: response.organizations || [],
        isAuthenticated: true
      };
      
      console.log('Setting user data:', userData);
      setUser(userData);
      setOrganizations(response.organizations || []);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      if (response.organizations?.length > 0 && !selectedOrg) {
        const defaultOrg = response.organizations[0];
        setSelectedOrg(defaultOrg);
        localStorage.setItem('selectedOrg', JSON.stringify(defaultOrg));
      }
      
      setLoading(false);
      return userData;
    } catch (error) {
      console.error('Error fetching user info:', error);
      if (error.response?.status === 401) {
        // Handle unauthorized error
        logout();
      }
      setLoading(false);
      return null;
    }
  };

  // Check authentication status on mount and router changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const storedUser = localStorage.getItem('user');
        
        console.log('Checking auth - Token:', !!token, 'UserId:', userId);
        
        if (token && userId && isTokenValid(token)) {
          // If we have stored user data, set it immediately while we fetch fresh data
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
            } catch (error) {
              console.error('Error parsing stored user:', error);
            }
          }
          
          // Always fetch fresh data if we have valid credentials
          await fetchUserInfo(userId);
        } else if (token || userId) {
          // Clear invalid auth data
          console.log('Invalid auth data found, logging out');
          logout();
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router.asPath]); // Re-run on route changes to handle auth redirects

  // Handle URL authentication parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isAuthenticated = params.get('authenticated');
    const userIdParam = params.get('userId');
    const token = params.get('token');

    if (isAuthenticated && userIdParam && token) {
      handleAuthentication(userIdParam, token).then(() => {
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    }
  }, [router.query]);

  const value = {
    user,
    setUser,
    organizations,
    setOrganizations,
    selectedOrg,
    setSelectedOrg,
    loading,
    logout,
    login,
    handleAuthentication,
    fetchUserInfo
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

module.exports = {
  UserProvider,
  useUser,
};
