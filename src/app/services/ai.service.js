import axiosInstance from './axiosInstance';
import API_ROUTES from './config';

export class aiService {
  static async aiSearch(data) {
    try {
      const response = await axiosInstance.post(API_ROUTES.AI.SEARCH, data);
      return response.data;
    } catch (error) {
      console.error('AI Search Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async aiLearningSearch(data) {
    try {
      const response = await axiosInstance.post(
        API_ROUTES.AI.LEARNING_SEARCH,
        data
      );
      return response.data;
    } catch (error) {
      console.error('AI Learning Search Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async aiPersonalizedSearch(data) {
    try {
      const response = await axiosInstance.post(
        API_ROUTES.AI.PERSONALIZED_SEARCH,
        data
      );
      return response.data;
    } catch (error) {
      console.error('AI Personalized Search Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async updateChatTitle(chatId, newTitle) {
    try {
      const response = await axiosInstance.put(
        API_ROUTES.AI.UPDATE_CHAT_TITLE,
        {
          chat_id: chatId,
          new_title: newTitle,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Update Chat Title Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async updateFolderContent(data) {
    try {
      const response = await axiosInstance.put(
        API_ROUTES.AI.UPDATE_FOLDER_CONTENT,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Update Folder Content Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async deleteChat(chatId) {
    try {
      const endpoint = API_ROUTES.AI.DELETE_CHAT.replace('{chat_id}', chatId);
      const response = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('Delete Chat Error:', error);
      throw error.response?.data || error.message;
    }
  }
}
