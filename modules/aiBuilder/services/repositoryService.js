import apiClient, {apiEndpoints} from '../config/api';

export const saveRepository = async ({userId, projectId, repository}) => {
  try {
    const response = await apiClient.post(apiEndpoints.repository.save, {
      userId,
      projectId,
      repository,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message || 'Failed to save repository configuration'
    );
  }
};

/**
 * Fetch repositories for a user
 * @param {string} userId - The ID of the user whose repositories to fetch
 * @returns {Promise<Array>} Array of repositories
 * @throws {string} Error message if fetch fails
 */
export const fetchRepositories = async (userId) => {
  // Check localStorage first
  const cachedRepos = localStorage.getItem('repositories');
  if (cachedRepos) {
    const repos = JSON.parse(cachedRepos);
    if (repos && repos.length > 0) {
      return repos;
    }
  }

  try {
    if (!userId) {
      throw 'User ID is required to fetch repositories';
    }

    const response = await apiClient.post(apiEndpoints.repository.list, {
      userId,
    });
    // Cache the response
    localStorage.setItem('repositories', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    // If API fails, return cached data if available
    if (cachedRepos) {
      return JSON.parse(cachedRepos);
    }
    throw error.response?.data?.message || 'Failed to fetch repositories';
  }
};

/**
 * Create a pull request for the specified project
 * @param {string} projectId - The ID of the project
 * @param {string} commitMessage - Optional commit message
 * @param {string} branchName - Optional branch name
 * @returns {Promise<Object>} Pull request details
 */
export const createPullRequest = async (projectId, commitMessage, branchName) => {
  try {
    const response = await apiClient.post(apiEndpoints.github.createPullRequest, {
      projectId,
      commitMessage,
      branchName,
    });
    return response.data;
  } catch (error) {
    console.error('[createPullRequest] Error creating pull request:', error);
    throw error.response?.data?.message || 'Failed to create pull request';
  }
};

/**
 * Get list of user's pull requests
 * @returns {Promise<Array>} Array of pull requests
 */
export const listPullRequests = async () => {
  try {
    const response = await apiClient.get(apiEndpoints.github.listPullRequests);
    return response.data.data;
  } catch (error) {
    console.error('[listPullRequests] Error fetching pull requests:', error);
    throw error.response?.data?.message || 'Failed to fetch pull requests';
  }
};

/**
 * Discard changes for a project
 * @param {string} projectId - The ID of the project
 * @returns {Promise<Object>} Response data
 */
export const discardChanges = async (projectId) => {
  try {
    const response = await apiClient.post(apiEndpoints.github.discardChanges(projectId));
    return response.data;
  } catch (error) {
    console.error('[discardChanges] Error discarding changes:', error);
    throw error.response?.data?.message || 'Failed to discard changes';
  }
};
