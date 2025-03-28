import axiosInstance from './axiosInstance';
import API_ROUTES from './config';

export class authService {
  static async signUp(userData) {
    try {
      const response = await axiosInstance.post(
        API_ROUTES.USER.SIGNUP,
        userData
      );
      return response.data;
    } catch (error) {
      console.error('SignUp Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async login(credentials) {
    try {
      const response = await axiosInstance.post(
        API_ROUTES.USER.LOGIN,
        credentials
      );
      return response.data;
    } catch (error) {
      console.error('Login Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async checkUserExistence(email) {
    try {
      const endpoint = API_ROUTES.USER.EXIST.replace('{email}', email);
      const response = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Check User Existence Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async getUserProfile() {
    try {
      const response = await axiosInstance.get(API_ROUTES.USER.PROFILE);
      return response.data;
    } catch (error) {
      console.error('Get User Profile Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async deleteAccount() {
    try {
      const response = await axiosInstance.delete(
        API_ROUTES.USER.DELETE_ACCOUNT
      );
      return response.data;
    } catch (error) {
      console.error('Delete Account Error:', error);
      throw error.response?.data || error.message;
    }
  }
}
