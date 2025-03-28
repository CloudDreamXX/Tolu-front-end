import axiosInstance from './axiosInstance';
import API_ROUTES from './config';

export class folderService {
  static async createFolder(data) {
    try {
      const response = await axiosInstance.post(
        API_ROUTES.FOLDERS.CREATE,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Create Folder Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async saveContent(data) {
    try {
      const response = await axiosInstance.post(
        API_ROUTES.FOLDERS.SAVE_CONTENT,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Save Content Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async getFolderStructure() {
    try {
      const response = await axiosInstance.get(API_ROUTES.FOLDERS.STRUCTURE);
      return response.data;
    } catch (error) {
      console.error('Get Folder Structure Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async getPostedStructure() {
    try {
      const response = await axiosInstance.get(
        API_ROUTES.FOLDERS.POSTED_STRUCTURE
      );
      return response.data;
    } catch (error) {
      console.error('Get Posted Structure Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async moveContent(data) {
    try {
      const response = await axiosInstance.post(
        API_ROUTES.FOLDERS.MOVE_CONTENT,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Move Content Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async deleteContent(data) {
    try {
      const response = await axiosInstance.delete(
        API_ROUTES.FOLDERS.DELETE_CONTENT,
        {
          data,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Delete Content Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async deleteFolder(data) {
    try {
      const response = await axiosInstance.delete(
        API_ROUTES.FOLDERS.DELETE_FOLDER,
        {
          data,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Delete Folder Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async renameContent(data) {
    try {
      const response = await axiosInstance.put(
        API_ROUTES.FOLDERS.RENAME_CONTENT,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Rename Content Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async renameFolder(data) {
    try {
      const response = await axiosInstance.put(
        API_ROUTES.FOLDERS.RENAME_FOLDER,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Rename Folder Error:', error);
      throw error.response?.data || error.message;
    }
  }
}
