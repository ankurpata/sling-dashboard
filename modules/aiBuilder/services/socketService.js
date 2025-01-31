import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config/api';

let socket = null;
let currentSessionId = null;
let connectionAttempts = 0;
const MAX_RECONNECTION_ATTEMPTS = 5;

const createSocket = (sessionId) => {
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

  console.log('Creating new socket connection to:', socketUrl);
  
  const newSocket = io(socketUrl, {
    query: { sessionId },
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: MAX_RECONNECTION_ATTEMPTS,
    path: '/socket.io',
    autoConnect: false, // We'll manually connect
    withCredentials: true,
    timeout: 20000
  });

  // Add connection event handlers
  newSocket.on('connect', () => {
    console.log('Socket connected successfully:', newSocket.id);
    connectionAttempts = 0;
  });

  newSocket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    connectionAttempts++;
    
    if (connectionAttempts >= MAX_RECONNECTION_ATTEMPTS) {
      console.error('Max reconnection attempts reached, cleaning up socket');
      disconnectSocket();
    }
  });

  newSocket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect' || reason === 'io client disconnect') {
      // Clean up the socket instance on intentional disconnects
      socket = null;
      currentSessionId = null;
    }
  });

  newSocket.io.on("error", (error) => {
    console.error('Socket.io error:', error);
    if (error.message?.includes('authentication')) {
      console.error('Socket authentication failed');
      disconnectSocket();
    }
  });

  newSocket.io.on("reconnect_attempt", (attempt) => {
    console.log('Attempting to reconnect:', attempt);
    // Re-add auth token on reconnection attempts
    newSocket.auth = { token };
  });

  return newSocket;
};

export const initializeSocket = (sessionId) => {
  console.log('Initializing socket with sessionId:', sessionId);
  console.log('Using API_BASE_URL:', API_BASE_URL);
  
  // If we already have a socket for this session, return it
  if (socket && socket.connected && currentSessionId === sessionId) {
    console.log('Reusing existing socket connection:', socket.id);
    return socket;
  }

  // If we have a socket but it's for a different session or disconnected, clean it up
  if (socket) {
    console.log('Cleaning up existing socket before creating new one');
    disconnectSocket();
  }

  try {
    socket = createSocket(sessionId);
    currentSessionId = sessionId;
    
    // Manually connect the socket
    socket.connect();
    
    return socket;
  } catch (error) {
    console.error('Error initializing socket:', error);
    return null;
  }
};

export const disconnectSocket = () => {
  if (socket) {
    console.log('Disconnecting socket:', socket.id);
    socket.disconnect();
    socket = null;
    currentSessionId = null;
    connectionAttempts = 0;
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

  const wrappedCallback = (...args) => {
    console.log(`Event ${eventName} received with args:`, args);
    try {
      callback(...args);
    } catch (error) {
      console.error(`Error in ${eventName} callback:`, error);
    }
  };

  console.log('Subscribing to event:', eventName);
  socket.on(eventName, wrappedCallback);
  
  return () => {
    if (socket) {
      console.log('Unsubscribing from event:', eventName);
      socket.off(eventName, wrappedCallback);
    }
  };
};
