import apiClient, {apiEndpoints} from '../config/api';

export async function createSession(userId, projectId, context) {
  try {
    const response = await apiClient.post(apiEndpoints.session.create, {
      userId,
      projectId,
      context,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
}

export async function getSession(sessionId) {
  try {
    const response = await apiClient.post(apiEndpoints.session.details, {
      sessionId,
    });

    return response.data;
  } catch (error) {
    console.error('Error getting chat session:', error);
    throw error;
  }
}
