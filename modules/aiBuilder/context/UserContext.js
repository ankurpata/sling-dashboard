import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';
import userService from '../services/userService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserInfo = async (userId) => {
    try {
      setLoading(true);
      const response = await userService.getUserInfo(userId);
      console.log('API Response:', response);
      
      const userData = {
        id: response.googleId || response._id,
        name: response.displayName || response.googleName,
        email: response.email,
        avatar: response.avatarUrl,
        isGithubConnected: response.isGithubConnected,
        isGoogleConnected: response.isGoogleConnected,
        githubUsername: response.githubUsername,
        organizations: response.organizations || []
      };
      
      console.log('Transformed User Data:', userData);
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

  useEffect(() => {
    // Check URL parameters for userId
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    
    if (userId) {
      fetchUserInfo(userId);
    } else {
      // Check localStorage for stored userId
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.id) {
            fetchUserInfo(userData.id);
          } else {
            setLoading(false);
          }
        } catch (error) {
          console.error('Error parsing stored user:', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  }, []);

  const login = async () => {
    const state = uuidv4();
    localStorage.setItem('oauth_state', state);
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = 'http://localhost:5001/auth/google/callback';
    
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile&state=${state}`;
  };

  const logout = () => {
    setUser(null);
    setSelectedOrg(null);
    localStorage.removeItem('user');
    localStorage.removeItem('selectedOrg');
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
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
