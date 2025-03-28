import axiosInstance from './axiosInstance';
import API_ROUTES from './config';

export class healthHistoryService {
  static async getHealthHistory() {
    try {
      const response = await axiosInstance.get(API_ROUTES.HEALTH_HISTORY.GET);
      return response.data;
    } catch (error) {
      console.error('Get Health History Error:', error);
      throw error.response?.data || error.message;
    }
  }

  static async postHealthHistory(healthData, labFile) {
    try {
      const formData = new FormData();
      formData.append('health_data', healthData);
      if (labFile) {
        formData.append('lab_file', labFile);
      }

      const response = await axiosInstance.post(
        API_ROUTES.HEALTH_HISTORY.POST,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Post Health History Error:', error);
      throw error.response?.data || error.message;
    }
  }
}
