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

  useEffect(() => {
    // Check localStorage for user data on mount
    const storedUser = localStorage.getItem('user');
    const storedOrg = localStorage.getItem('selectedOrg');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    if (storedOrg) {
      try {
        setSelectedOrg(JSON.parse(storedOrg));
      } catch (error) {
        console.error('Error parsing stored org:', error);
      }
    }
    setLoading(false);
  }, []);

  const fetchUserInfo = async (userId) => {
    try {
      const userInfo = await userService.getUserInfo(userId);
      if (userInfo) {
        setUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));

        // Handle organizations if present in response
        if (userInfo.organizations) {
          setOrganizations(userInfo.organizations);
          // If no org is selected, select the first one
          if (!selectedOrg && userInfo.organizations.length > 0) {
            const defaultOrg = userInfo.organizations[0];
            setSelectedOrg(defaultOrg);
            localStorage.setItem('selectedOrg', JSON.stringify(defaultOrg));
          }
        }
      }
      return userInfo;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  const selectOrganization = (org) => {
    setSelectedOrg(org);
    localStorage.setItem('selectedOrg', JSON.stringify(org));
  };

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

  const logout = () => {
    setUser(null);
    setOrganizations([]);
    setSelectedOrg(null);
    localStorage.removeItem('user');
    localStorage.removeItem('selectedOrg');
    localStorage.removeItem('oauthState');
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
      // First set the user data from URL params
      const userData = {
        id: userId,
        username: userName,
        email: userEmail,
        avatarUrl: userPicture
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Then fetch complete user info including organizations
      fetchUserInfo(userId).then(userInfo => {
        if (userInfo) {
          setUser(userInfo);
          localStorage.setItem('user', JSON.stringify(userInfo));
        }
      }).catch(console.error);
    }
  }, []);

  return (
    <UserContext.Provider value={{ 
      user, 
      loading,
      organizations,
      selectedOrg,
      selectOrganization,
      login, 
      logout, 
      updateUser,
      fetchUserInfo,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
