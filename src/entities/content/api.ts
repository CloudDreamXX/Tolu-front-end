import { API_ROUTES, ApiService } from "shared/api";
import {
  ContentHashtags,
  ContentItemResponse,
  ContentStatus,
  ContentToEdit,
  CreatorProfile,
  Feedback,
  FeedbackResponse,
  LibraryContentStatus,
  ShareViaEmail,
  ShareWithCoach,
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

  static async addHashtags(data: ContentHashtags): Promise<any> {
    return ApiService.post<any>(API_ROUTES.CONTENT.ADD_HASHTAGS, data);
  }

  static async deleteHashtags(data: ContentHashtags): Promise<any> {
    return ApiService.delete<any>(API_ROUTES.CONTENT.DELETE_HASHTAGS, data);
  }

  static async getContentHashtags(id: string): Promise<any> {
    const endpoint = API_ROUTES.CONTENT.GET_CONTENT_HASHTAGS.replace(
      "{content_id}",
      id
    );
    return ApiService.get<any>(endpoint);
  }

  static async getContentWithSimilarTags(id: string): Promise<any> {
    const data = {
      content_id: id,
    };
    return ApiService.post<any>(
      API_ROUTES.CONTENT.GET_CONTENTS_WITH_SIMILAR_TAGS,
      data
    );
  }

  static async getAllHashtags(): Promise<any> {
    return ApiService.get<any>(API_ROUTES.CONTENT.GET_ALL_HASHTAGS);
  }

  static async getCreatorProfile(id: string): Promise<CreatorProfile> {
    const endpoint = API_ROUTES.CONTENT.GET_CREATOR_PROFILE.replace(
      "{creator_id}",
      id
    );
    return ApiService.get<CreatorProfile>(endpoint);
  }

  static async getCreatorPhoto(id: string, filename: string): Promise<Blob> {
    const endpoint = API_ROUTES.CONTENT.DOWNLOAD_CREATOR_PHOTO.replace(
      "{creator_id}",
      encodeURIComponent(id)
    ).replace("{filename}", encodeURIComponent(filename));

    const res = await ApiService.get<Blob>(endpoint, {
      responseType: "blob" as const,
      headers: { Accept: "image/*" },
    });
    return (res as any).data ?? res;
  }

  static async shareEmail(data: ShareViaEmail): Promise<any> {
    return ApiService.post<any>(API_ROUTES.CONTENT.SHARE_EMAIL, data);
  }

  static async shareCoach(data: ShareWithCoach): Promise<any> {
    return ApiService.post<any>(API_ROUTES.CONTENT.SHARE_COACH, data);
  }

  static async updateContentStatus(data: LibraryContentStatus): Promise<any> {
    return ApiService.put<any>(API_ROUTES.CONTENT.LIBRARY_STATUS, data);
  }
}
