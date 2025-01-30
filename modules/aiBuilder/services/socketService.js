import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config/api';

let socket = null;

export const initializeSocket = (sessionId) => {
  console.log('Initializing socket with sessionId:', sessionId);
  console.log('Using API_BASE_URL:', API_BASE_URL);
  
  if (!socket) {
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        throw new Error('Authentication required');
      }

      // For development, use ws://localhost:5001
      const socketUrl = process.env.NODE_ENV === 'development' 
        ? 'ws://localhost:5001'
        : API_BASE_URL.replace(/^http/, 'ws');

      console.log('Connecting to socket URL:', socketUrl);
      
      socket = io(socketUrl, {
        query: { sessionId },
        auth: { token }, // Add token to auth object
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        path: '/socket.io',
        autoConnect: true,
        withCredentials: true,
        forceNew: true,
        timeout: 10000
      });

      socket.io.on("error", (error) => {
        console.error('Socket.io error:', error);
        if (error.message?.includes('authentication')) {
          // Handle authentication errors
          console.error('Socket authentication failed');
          disconnectSocket();
        }
      });

      socket.io.on("reconnect_attempt", (attempt) => {
        // Re-add auth token on reconnection attempts
        socket.auth = { token: localStorage.getItem('token') };
        console.log('Socket reconnection attempt:', attempt);
      });

      socket.io.on("reconnect_failed", () => {
        console.error('Socket reconnection failed');
      });

      socket.on('connect', () => {
        console.log('Socket connected with ID:', socket.id);
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected, reason:', reason);
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, possibly due to authentication
          disconnectSocket();
        }
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        if (error.message?.includes('authentication')) {
          // Handle authentication errors
          console.error('Socket authentication failed');
          disconnectSocket();
        }
      });

      // Force connect if not auto-connecting
      if (!socket.connected) {
        console.log('Forcing socket connection...');
        socket.connect();
      }
    } catch (error) {
      console.error('Error creating socket:', error);
      throw error;
    }
  } else {
    // Verify token is still valid when reusing connection
    const currentToken = localStorage.getItem('token');
    if (currentToken && socket.auth?.token !== currentToken) {
      console.log('Token changed, reconnecting socket...');
      disconnectSocket();
      return initializeSocket(sessionId);
    }
    console.log('Reusing existing socket connection, ID:', socket.id);
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    console.log('Disconnecting socket:', socket.id);
    socket.disconnect();
    socket = null;
  }
};

export const emitMessage = (eventName, data) => {
  if (!socket) {
    console.error('No socket connection available');
    return;
  }

  if (!socket.connected) {
    console.warn('Socket not connected, attempting to reconnect...');
    socket.connect();
  }

  try {
    console.log('Emitting event:', eventName, 'with data:', data);
    socket.emit(eventName, data);
  } catch (error) {
    console.error('Error emitting message:', error);
  }
};

export const subscribeToEvent = (eventName, callback) => {
  if (!socket) {
    console.error('No socket connection available for event:', eventName);
    return () => {};
  }

  console.log('Subscribing to event:', eventName);
  socket.on(eventName, callback);
  
  return () => {
    console.log('Unsubscribing from event:', eventName);
    socket.off(eventName, callback);
  };
};
