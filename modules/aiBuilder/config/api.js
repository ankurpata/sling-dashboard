const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const apiEndpoints = {
  repository: {
    save: `${API_BASE_URL}/api/project/repository`,
    list: `${API_BASE_URL}/api/github/repos`,
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
