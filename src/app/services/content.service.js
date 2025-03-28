import axiosInstance from './axiosInstance';
import API_ROUTES from './config';

export class contentService {
  static async getPublishedContent() {
    try {
      const response = await axiosInstance.get(API_ROUTES.CONTENT.PUBLISHED);
      return response.data;
    } catch (error) {
      console.error('Get Published Content Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async retrieveContent(contentId) {
    try {
      const response = await axiosInstance.post(API_ROUTES.CONTENT.RETRIEVE, {
        content_id: contentId,
      });
      return response.data;
    } catch (error) {
      console.error('Retrieve Content Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async updateContentStatus(contentId) {
    try {
      const endpoint = API_ROUTES.CONTENT.CONTENT_STATUS.replace(
        '{content_id}',
        contentId
      );
      const response = await axiosInstance.post(endpoint, {
        content_id: contentId,
      });
      return response.data;
    } catch (error) {
      console.error('Update Content Status Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async getContentStatus() {
    try {
      const response = await axiosInstance.get(API_ROUTES.CONTENT.STATUS);
      return response.data;
    } catch (error) {
      console.error('Get Content Status Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async getContentById(contentId) {
    try {
      const endpoint = API_ROUTES.CONTENT.CONTENT_BY_ID.replace(
        '{content_id}',
        contentId
      );
      const response = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Get Content By ID Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async getContentByStatus(status) {
    try {
      const endpoint = API_ROUTES.CONTENT.BY_STATUS.replace('{status}', status);
      const response = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Get Content By Status Error:', error);
      throw error.response?.data || error.message;
    }
  }
}
