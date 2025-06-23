import { API_ROUTES, ApiService } from "shared/api";
import { ContentItemResponse } from "./model";

export class ContentService {
  static async getContentEndpoint(id: string): Promise<ContentItemResponse> {
    return ApiService.post<ContentItemResponse>(API_ROUTES.CONTENT.RETRIEVE, {
      content_id: id,
    });
  }

  static async duplicateContentById(contentId: string): Promise<any> {
    return ApiService.post<any>(
      `${API_ROUTES.CONTENT.DUPLICATE_CONTENT}/${contentId}`
    );
  }
}
