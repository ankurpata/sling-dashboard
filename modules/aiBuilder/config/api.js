const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

export const apiEndpoints = {
  repository: {
    save: `${API_BASE_URL}/project/repository`,
    list: `${API_BASE_URL}/github/repos`,
  },
  project: {
    create: `${API_BASE_URL}/project`,
    detail: `${API_BASE_URL}/project/detail`,
    env: `${API_BASE_URL}/project/env`,
    buildSettings: `${API_BASE_URL}/project/build-settings`,
    deploy: `${API_BASE_URL}/project/deploy`,
    deploymentStatus: `${API_BASE_URL}/project/deployment/status`,
    developmentStatus: `${API_BASE_URL}/project/development/status`,
    detect: `${API_BASE_URL}/project/detect-framework`,
    chat: {
      sessions: `${API_BASE_URL}/project/chat/sessions`,
      session: (sessionId) =>
        `${API_BASE_URL}/project/chat/sessions/${sessionId}`,
    },
    fileChanges: `${API_BASE_URL}/file/changes`,
  },
  chat: {
    prompt: `${API_BASE_URL}/chat/prompt`,
    history: (projectId, conversationId = '') => `${API_BASE_URL}/chat/history/${projectId}/${conversationId}`,
  },
  session: {
    create: `${API_BASE_URL}/session/create`,
    details: `${API_BASE_URL}/session/details`,
    messages: (sessionId) => `${API_BASE_URL}/session/${sessionId}/messages`,
  },
  projects: `${API_BASE_URL}/projects`,
  userInfo: `${API_BASE_URL}/user/info`,
};

// Create axios instance with default config
import axios from 'axios';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    // Initialize headers if they don't exist
    config.headers = config.headers || {};
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors
      console.error('Authentication failed:', error.response?.data);
      // Clear invalid token
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default apiClient;
