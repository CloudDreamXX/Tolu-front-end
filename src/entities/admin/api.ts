import { API_ROUTES, ApiService } from "shared/api";
import { AdminGetFeedbackResponse, UsersResponse } from "./model";

export class AdminService {
  static async getAllUsers(): Promise<UsersResponse> {
    return ApiService.get<UsersResponse>(API_ROUTES.ADMIN.GET_ALL_USERS);
  }

  static async getFeedback(
    limit?: number,
    offset?: number,
    start_date?: string,
    end_date?: string
  ): Promise<AdminGetFeedbackResponse> {
    return ApiService.get<AdminGetFeedbackResponse>(
      API_ROUTES.ADMIN.GET_FEEDBACK,
      {
        params: { limit, offset, start_date, end_date },
      }
    );
  }
}
