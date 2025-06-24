import { API_ROUTES, ApiService } from "shared/api";
import { HealthHistory } from "./model";

export class HealthHistoryService {
  static async getUserHealthHistory(): Promise<HealthHistory> {
    return ApiService.get<HealthHistory>(API_ROUTES.HEALTH_HISTORY.GET, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static async createHealthHistory(
    healthData: string,
    labFile?: File,
    clientId?: string | null
  ): Promise<any> {
    const formData = new FormData();
    formData.append("health_data", healthData);

    if (labFile) {
      formData.append("lab_file", labFile);
    }

    if (clientId !== undefined) {
      formData.append("client_id", clientId ?? "");
    }

    return ApiService.post<any>(
      API_ROUTES.CLIENT.ACCEPT_COACH_INVITE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }
}
