import apiClient, { apiEndpoints } from '../config/api';

export const detectFramework = async (repoName, userId) => {
  try {
    const response = await apiClient.post(apiEndpoints.project.detect, {
      owner: userId,
      repo: repoName
    });
    
    // Preserve original error handling format
    const framework = response.data.framework;
    if (!framework || framework === 'unknown') {
      return `Unsupported Framework (${repoName})`;
    }
    return framework;
  } catch (error) {
    console.error('Error detecting framework:', error);
    return `Unsupported Framework (${repoName})`;
  }
};
