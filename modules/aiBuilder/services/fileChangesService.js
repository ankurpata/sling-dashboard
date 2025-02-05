import apiClient, {apiEndpoints} from '../config/api';

export const getFileChanges = async (projectId) => {
  try {
    const response = await apiClient.post(apiEndpoints.project.fileChanges, {
      projectId,
    });
    return response?.data?.data || [];
  } catch (error) {
    console.error('[getFileChanges] Error fetching file changes:', error);
  }
};

export const discardFileChanges = async (projectId, userId) => {
  try {
    const response = await apiClient.post(
      apiEndpoints.project.discardFileChanges,
      {
        projectId,
        userId,
      },
    );
    return response?.data?.data || [];
  } catch (error) {
    console.error('[discardFileChanges] Error discarding file changes:', error);
  }
};
