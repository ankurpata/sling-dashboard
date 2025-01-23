import apiClient, { apiEndpoints } from '../config/api';

export const detectFramework = async (repositoryName, userId) => {
  try {
     
    const response = await apiClient.post(apiEndpoints.project.detect, {
      owner: userId,
      repo: repositoryName,
    });
    
    return response?.data?.data?.framework;
  } catch (error) {
    console.error('Error detecting framework:', error);
    return 'Unsupported Framework';
  }
};
