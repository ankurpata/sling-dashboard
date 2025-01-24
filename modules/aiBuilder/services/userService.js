import apiClient, { apiEndpoints } from '../config/api';

export const userService = {
  getUserInfo: async (userId) => {
    try {
      const response = await apiClient.post(apiEndpoints.userInfo, { userId });
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  },
};

export default userService;
