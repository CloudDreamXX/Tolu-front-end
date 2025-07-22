import { API_ROUTES, ApiService } from "shared/api";
import {
  ContentItemResponse,
  ContentStatus,
  ContentToEdit,
  Feedback,
  FeedbackResponse,
} from "./model";

export class ContentService {
  static async getContentEndpoint(id: string): Promise<ContentItemResponse> {
    return ApiService.get<ContentItemResponse>(
      `${API_ROUTES.CONTENT.RETRIEVE}/${id}`
    );
  }

  static async duplicateContentById(contentId: string): Promise<any> {
    return ApiService.post<any>(
      `${API_ROUTES.CONTENT.DUPLICATE_CONTENT}/${contentId}`
    );
  }

  static async editContent(content: ContentToEdit): Promise<any> {
    return ApiService.put<any>(API_ROUTES.CONTENT.EDIT_CONTENT, content);
  }

  static async updateStatus(status: ContentStatus): Promise<any> {
    const endpoint = API_ROUTES.CONTENT.UPDATE_CONTENT_STATUS.replace(
      "{content_id}",
      status.content_id
    );
    return ApiService.post<any>(endpoint, { status: status.status });
  }

  static async addContentFeedback(
    feedback: Feedback
  ): Promise<FeedbackResponse> {
    return ApiService.post<FeedbackResponse>(
      API_ROUTES.CONTENT.FEEDBACK,
      feedback
    );
  }
}
