const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

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

export default apiClient;
