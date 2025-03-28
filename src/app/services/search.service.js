import axiosInstance from './axiosInstance';
import API_ROUTES from './config';

export class searchService {
  static async getSearchHistory(clientId, managedClientId) {
    try {
      const response = await axiosInstance.get(API_ROUTES.SEARCH.HISTORY, {
        params: {
          client_id: clientId,
          managed_client_id: managedClientId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Get Search History Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async getSession(chatId) {
    try {
      const endpoint = API_ROUTES.SEARCH.SESSION.replace('{chat_id}', chatId);
      const response = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Get Session Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async getAdminSession(chatId) {
    try {
      const endpoint = API_ROUTES.SEARCH.ADMIN_SESSION.replace(
        '{chat_id}',
        chatId
      );
      const response = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Get Admin Session Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async getPersonalizedSession(referenceContentId) {
    try {
      const endpoint = API_ROUTES.SEARCH.PERSONALIZED_SESSION.replace(
        '{reference_content_id}',
        referenceContentId
      );
      const response = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Get Personalized Session Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async submitRating(data) {
    try {
      const response = await axiosInstance.post(API_ROUTES.SEARCH.RATING, data);
      return response.data;
    } catch (error) {
      console.error('Submit Rating Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async submitReport(data) {
    try {
      const response = await axiosInstance.post(API_ROUTES.SEARCH.REPORT, data);
      return response.data;
    } catch (error) {
      console.error('Submit Report Error:', error);
      throw error.response?.data || error.message;
    }
  }
}
