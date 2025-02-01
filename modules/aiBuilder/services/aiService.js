import api, {apiEndpoints} from '../config/api';

export const getAICommitMessage = async (changedFiles) => {
  try {
    const response = await api.post(apiEndpoints.ai.commitMessage, {
      changedFiles,
    });
    return response?.data;
  } catch (error) {
    console.error(
      '[getAICommitMessage] Error generating commit message:',
      error,
    );
  }
};
