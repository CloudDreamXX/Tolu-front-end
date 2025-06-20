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

  static async duplicateContentById(
    contentId: string,
    token: string | null
  ): Promise<string> {
    const endpoint = API_ROUTES.CONTENT.DUPLICATE_CONTENT.replace(
      "{content_id}",
      contentId
    );
    return ApiService.post<string>(endpoint, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
    });
  }
}
