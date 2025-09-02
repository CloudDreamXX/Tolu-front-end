import { API_ROUTES, ApiService } from "shared/api";
import {
  AdminChatModel,
  AdminGetFeedbackResponse,
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
}
