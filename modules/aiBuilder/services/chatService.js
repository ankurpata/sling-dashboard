import apiClient, {apiEndpoints} from '../config/api';

// Utility functions for session ID encoding/decoding
export function encodeSessionId(sessionId) {
  return btoa(sessionId)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decodeSessionId(encodedSessionId) {
  const base64 = encodedSessionId.replace(/-/g, '+').replace(/_/g, '/');
  return atob(base64);
}

export async function createChatSession(userId, projectId, context) {
  try {
    const response = await apiClient.post(apiEndpoints.session.create, {
      userId,
      projectId,
      context,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
}

export async function getChatSession(encodedSessionId) {
  try {
    const sessionId = decodeSessionId(encodedSessionId);
    const response = await apiClient.get(
      apiEndpoints.project.chat.session(sessionId),
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error('Error getting chat session:', error);
    throw error;
  }
}
