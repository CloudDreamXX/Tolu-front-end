import axiosInstance from './axiosInstance';
import { API_ROUTES } from './config';

export class practitionerService {
  static async createClient(data) {
    try {
      const response = await axiosInstance.post(
        API_ROUTES.PRACTITIONER.CREATE_CLIENT,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Create Client Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async getManagedClients() {
    try {
      const response = await axiosInstance.get(
        API_ROUTES.PRACTITIONER.MANAGED_CLIENTS
      );
      return response.data;
    } catch (error) {
      console.error('Get Managed Clients Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async switchClient(data) {
    try {
      const response = await axiosInstance.post(
        API_ROUTES.PRACTITIONER.SWITCH_CLIENT,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Switch Client Error:', error);
      throw error.response?.data || error.message;
    }
  }
}
