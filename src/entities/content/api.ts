import { API_ROUTES, ApiService } from "shared/api";
import { ContentItemResponse } from "./model";

export class ContentService {
  static async getContentEndpoint(
    token: string | null,
    id: string
  ): Promise<ContentItemResponse> {
    return ApiService.post<ContentItemResponse>(
      API_ROUTES.CONTENT.RETRIEVE,
      { content_id: id },
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          Accept: "application/json",
        },
      }
    );
  }
}
