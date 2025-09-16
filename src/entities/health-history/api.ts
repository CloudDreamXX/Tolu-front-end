import { API_ROUTES, ApiService } from "shared/api";
import {
  HealthHistory,
  HealthHistoryPostData,
  HealthHistoryResponse,
} from "./model";

export class HealthHistoryService {
  static async getUserHealthHistory(): Promise<HealthHistory> {
    return ApiService.get<HealthHistoryResponse>(
      API_ROUTES.HEALTH_HISTORY.GET
    ).then((response) => response.health_history);
  }

  static async createHealthHistory(
    healthData: HealthHistoryPostData,
    labFiles?: File[],
    clientId?: string | null
  ): Promise<any> {
    const formData = new FormData();
    formData.append("health_data", JSON.stringify(healthData));

    if (labFiles && labFiles.length > 0) {
      labFiles.forEach((file) => {
        formData.append("lab_file", file);
      });
    }

    if (clientId !== undefined) {
      formData.append("client_id", clientId ?? "");
    }

    return ApiService.post<any>(API_ROUTES.HEALTH_HISTORY.POST, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}
