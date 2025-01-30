import apiClient, { apiEndpoints } from '../config/api';

export const userService = {
  getUserInfo: async (userId) => {
    try {
      console.log('Fetching user info with userId:', userId);
      const response = await apiClient.post(apiEndpoints.userInfo, { userId });
      console.log('User info response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', error.message);
      }
      throw error;
    }
  },
};

export default userService;
