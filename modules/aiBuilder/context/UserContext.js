'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';
import userService from '../services/userService';

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserInfo = async (userId) => {
    try {
      setLoading(true);
      console.log('Fetching user info for userId:', userId);
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
        organizations: response.organizations || []
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
      setLoading(false);
      return null;
    }
  };

  // Initialize user from localStorage
  useEffect(() => {
    console.log('Initializing user from localStorage');
    const storedUser = localStorage.getItem('user');
    const storedOrg = localStorage.getItem('selectedOrg');
    
    console.log('Stored user from localStorage:', storedUser);
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('Parsed user data:', userData);
        
        // Set the user state
        setUser(userData);
        
        // If we have a userId, fetch fresh data
        if (userData.id) {
          console.log('Found userId, fetching fresh data:', userData.id);
          fetchUserInfo(userData.id);
        }
        
        // Set organization if available
        if (storedOrg) {
          try {
            setSelectedOrg(JSON.parse(storedOrg));
          } catch (error) {
            console.error('Error parsing stored org:', error);
          }
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    } else {
      console.log('No stored user found');
      setLoading(false);
    }
  }, []);

  // Handle URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    
    if (userId) {
      console.log('Found userId in URL:', userId);
      fetchUserInfo(userId);
    }
  }, [router.query]);

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
      
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile&state=${state}`;
    }
  };

  const logout = () => {
    console.log('Logging out, clearing user data');
    setUser(null);
    setSelectedOrg(null);
    localStorage.removeItem('user');
    localStorage.removeItem('selectedOrg');
    localStorage.removeItem('oauth_state');
    router.push('/');
  };

  const selectOrganization = (org) => {
    setSelectedOrg(org);
    localStorage.setItem('selectedOrg', JSON.stringify(org));
  };

  const value = {
    user,
    loading,
    organizations,
    selectedOrg,
    login,
    logout,
    fetchUserInfo,
    selectOrganization,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

module.exports = {
  UserProvider,
  useUser,
}
