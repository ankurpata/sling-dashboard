import api, {apiEndpoints} from '../config/api';

export const savePrompt = async (projectId, prompt) => {
  try {
    const response = await api.post(apiEndpoints.chat.prompt, {
      projectId,
      prompt,
    });
    return response.data;
  } catch (error) {
    console.error('Error saving prompt:', error);
    throw error;
  }
};

export const getChatHistory = async (projectId) => {
  try {
    const response = await api.get(apiEndpoints.chat.history(projectId));
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};
