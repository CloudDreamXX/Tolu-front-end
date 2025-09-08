import { API_ROUTES, ApiService } from "shared/api";
import {
  AdminChatModel,
  AdminGetFeedbackResponse,
  ManageContentData,
  SendMessagePayload,
  SendMessageResponse,
  UsersResponse,
} from "./model";
import { ChatMessageModel } from "entities/chat";

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

  static async getAllChats(): Promise<AdminChatModel[]> {
    return ApiService.get<AdminChatModel[]>(API_ROUTES.ADMIN.GET_ALL_CHATS);
  }

  static async getMessagesByChatId(payload: {
    chat_id: string;
    page?: number;
    page_size?: number;
  }): Promise<ChatMessageModel[]> {
    const {
      chat_id,
      page = 1,
      page_size = 50,
    } = payload || ({} as typeof payload);

    return ApiService.get<ChatMessageModel[]>(
      API_ROUTES.ADMIN.GET_MESSAGES.replace("{chat_id}", chat_id),
      {
        params: { page, page_size },
      }
    );
  }

  static async sendMessage(
    payload: SendMessagePayload
  ): Promise<SendMessageResponse> {
    return ApiService.post<SendMessageResponse>(
      API_ROUTES.ADMIN.SEND_MESSAGE,
      payload
    );
  }

  static async getFoldersStructure(params?: {
    page?: number;
    page_size?: number;
    folder_id?: string;
    user_id?: string;
  }): Promise<any> {
    const { page = 1, page_size = 10, folder_id, user_id } = params || {};
    return ApiService.get<any>(API_ROUTES.ADMIN.GET_FOLDERS, {
      params: { page, page_size, folder_id, user_id },
    });
  }

  static async getUnpublishedContent(params?: {
    page?: number;
    limit?: number;
    creator_id?: string;
    unpublished_by?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<any> {
    const {
      page = 1,
      limit = 10,
      creator_id,
      unpublished_by,
      date_from,
      date_to,
    } = params || {};
    return ApiService.get<any>(API_ROUTES.ADMIN.GET_UNPUBLISHED_CONTENT, {
      params: { page, limit, creator_id, unpublished_by, date_from, date_to },
    });
  }

  static async manageContent(data: ManageContentData): Promise<any> {
    return ApiService.put<any>(API_ROUTES.ADMIN.MANAGE_CONTENT, data);
  }
}
