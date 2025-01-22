import apiClient, {apiEndpoints} from '../config/api';

/**
 * Create or update a project
 */
export const saveProject = async ({userId, projectId, repository}) => {
  try {
    const response = await apiClient.post(apiEndpoints.project.create, {
      userId,
      projectId,
      repository,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to save project';
  }
};

/**
 * Save environment variables for a project
 */
export const saveEnvironmentVariables = async ({projectId, environmentVariables}) => {
  try {
    const response = await apiClient.post(apiEndpoints.project.env, {
      projectId,
      environmentVariables,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to save environment variables';
  }
};

/**
 * Save build settings for a project
 */
export const saveBuildSettings = async ({projectId, buildSettings}) => {
  try {
    const response = await apiClient.post(apiEndpoints.project.buildSettings, {
      projectId,
      buildSettings,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to save build settings';
  }
};

/**
 * Deploy a project
 */
export const deployProject = async (projectId) => {
  try {
    const response = await apiClient.post(apiEndpoints.project.deploy, {
      projectId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to deploy project';
  }
};
