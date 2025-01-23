const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

export const apiEndpoints = {
  repository: {
    save: `${API_BASE_URL}/api/project/repository`,
    list: `${API_BASE_URL}/api/github/repos`,
  },
  project: {
    create: `${API_BASE_URL}/api/project`,
    env: `${API_BASE_URL}/api/project/env`,
    buildSettings: `${API_BASE_URL}/api/project/build-settings`,
    deploy: `${API_BASE_URL}/api/project/deploy`,
    detect: `${API_BASE_URL}/api/project/detect-framework`,
  },
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
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;
