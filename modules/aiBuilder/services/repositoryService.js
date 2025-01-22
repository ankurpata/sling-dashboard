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
