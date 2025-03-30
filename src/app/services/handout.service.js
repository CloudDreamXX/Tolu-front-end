import axiosInstance from './axiosInstance';
import { API_ROUTES } from './config';

export class handoutService {
  static async getAllHandouts() {
    try {
      const response = await axiosInstance.get(API_ROUTES.HANDOUTS.ALL);
      return response.data;
    } catch (error) {
      console.error('Get All Handouts Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async createHandout(content) {
    try {
      const response = await axiosInstance.post(API_ROUTES.HANDOUTS.CREATE, {
        content,
      });
      return response.data;
    } catch (error) {
      console.error('Create Handout Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async editHandout(id, content) {
    try {
      const response = await axiosInstance.put(API_ROUTES.HANDOUTS.EDIT, {
        id,
        content,
      });
      return response.data;
    } catch (error) {
      console.error('Edit Handout Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async deleteHandout(id) {
    try {
      const endpoint = API_ROUTES.HANDOUTS.DELETE.replace('{id}', id);
      const response = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('Delete Handout Error:', error);
      throw error.response?.data || error.message;
    }
  }
}
