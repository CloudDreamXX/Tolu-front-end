import { API_ROUTES, ApiService } from "shared/api";
import { ContentItemResponse, ContentStatus, ContentToEdit } from "./model";

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

  static async editContent(content: ContentToEdit): Promise<any> {
    return ApiService.put<any>(
      API_ROUTES.CONTENT.EDIT_CONTENT, content
    );
  }

  static async updateStatus(status: ContentStatus): Promise<any> {
    const endpoint = API_ROUTES.CONTENT.UPDATE_CONTENT_STATUS.replace(
      "{content_id}",
      status.content_id
    );
    return ApiService.post<any>(endpoint, { status: status.status });
  }
}
