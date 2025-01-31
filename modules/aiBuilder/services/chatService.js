import api, {apiEndpoints} from '../config/api';

export const savePrompt = async (projectId, prompt, conversationId) => {
  try {
    const response = await api.post(apiEndpoints.chat.prompt, {
      projectId,
      prompt,
      conversationId,
    });
    return response.data;
  } catch (error) {
    console.error('Error saving prompt:', error);
    throw error;
  }
};

export const getChatHistory = async (projectId, conversationId = '') => {
  try {
    const response = await api.get(
      apiEndpoints.chat.history(projectId, conversationId),
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return { conversations: [] };
  }
};
