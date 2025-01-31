import apiClient, {apiEndpoints} from '../config/api';

export const getFileChanges = async (projectId) => {
  try {
    const response = await apiClient.post(apiEndpoints.project.fileChanges, {
      projectId,
    });
    return response?.data?.data || [];
  } catch (error) {
    console.error('Error fetching file changes:', error);
    throw error;
  }
};
