const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

export const apiEndpoints = {
  repository: {
    save: `${API_BASE_URL}/project/repository`,
    list: `${API_BASE_URL}/github/repos`,
  },
  project: {
    create: `${API_BASE_URL}/project`,
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
  },
  session: {
    create: `${API_BASE_URL}/session/create`,
    messages: (sessionId) =>
      `${API_BASE_URL}/session/${sessionId}/messages`,
  },
  projects: `${API_BASE_URL}/projects`,
  userInfo: `${API_BASE_URL}/user/info`,
};

// Create axios instance with default config
import axios from 'axios';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
