import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const detectFramework = async (repoPath) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/detect-framework`, {
      repoPath,
    });
    return response.data.framework;
  } catch (error) {
    console.error('Error detecting framework:', error);
    return 'Unsupported Framework';
  }
};
