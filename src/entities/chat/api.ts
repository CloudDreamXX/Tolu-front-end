import { API_ROUTES, ApiService } from "shared/api";
import {
  CreateChatGroupResponse,
  CreateChatPayload,
  FetchAllChatsResponse,
  FetchChatDetailsResponse,
  FetchChatFilesResponse,
  FetchChatMessagesResponse,
  SendMessagePayload,
  SendMessageResponse,
  UpdateGroupChatPayload,
  UpdateGroupChatResponse,
  UploadChatFileResponse,
} from "./model";

export class ChatService {
  static async fetchAllChats(): Promise<FetchAllChatsResponse> {
    return ApiService.get<FetchAllChatsResponse>(API_ROUTES.CHAT.FETCH_ALL);
  }

  static async fetchChatDetailsById(
    chatId: string
  ): Promise<FetchChatDetailsResponse> {
    return ApiService.get<FetchChatDetailsResponse>(
      `${API_ROUTES.CHAT.FETCH_ONE.replace("{chat_id}", chatId)}`
    );
  }

  static async fetchChatMessages(
    chatId: string,
    payload: { page?: number; limit?: number } = { page: 1, limit: 50 }
  ): Promise<FetchChatMessagesResponse> {
    return ApiService.get<FetchChatMessagesResponse>(
      `${API_ROUTES.CHAT.FETCH_CHAT_MESSAGES.replace("{chat_id}", chatId)}`,
      { params: payload }
    );
  }

  static async sendMessage(
    payload: SendMessagePayload
  ): Promise<SendMessageResponse> {
    return ApiService.post<SendMessageResponse>(
      `${API_ROUTES.CHAT.SEND_MESSAGE}`,
      payload
    );
  }

  static async createGroupChat(
    // only coaches can create group chats
    payload: CreateChatPayload
  ): Promise<CreateChatGroupResponse> {
    const { request, avatar_image } = payload;
    const formData = new FormData();

    formData.append("request", JSON.stringify(request));
    if (avatar_image) {
      formData.append("avatar_image", avatar_image);
    }

    return ApiService.post<CreateChatGroupResponse>(
      `${API_ROUTES.CHAT.CREATE_GROUP_CHAT}`,
      formData
    );
  }

  static async updateGroupChat(
    chatId: string,
    payload: UpdateGroupChatPayload
  ): Promise<UpdateGroupChatResponse> {
    // (only admins can update)
    const { request, avatar_image } = payload;
    const formData = new FormData();

    formData.append("request", JSON.stringify(request));
    if (avatar_image) {
      formData.append("avatar_image", avatar_image);
    }

    return ApiService.put<UpdateGroupChatResponse>(
      `${API_ROUTES.CHAT.UPDATE_GROUP_CHAT.replace("{chat_id}", chatId)}`,
      formData
    );
  }

  static async uploadChatFile(
    chatId: string,
    file: File
  ): Promise<UploadChatFileResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return ApiService.post<UploadChatFileResponse>(
      API_ROUTES.CHAT.UPLOAD_FILE.replace("{chat_id}", chatId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  static async getUploadedChatFiles(fileUrl: string): Promise<Blob> {
    return ApiService.get<Blob>(
      API_ROUTES.CHAT.UPLOADED_FILE.replace("{filename}", fileUrl),
      { responseType: "blob" }
    );
  }

  static async deleteMessage(chatId: string, messageId: string): Promise<void> {
    return ApiService.delete(
      `${API_ROUTES.CHAT.DELETE_MESSAGE.replace("{chat_id}", chatId).replace("{message_id}", messageId)}`
    );
  }

  static async fetchAllFilesByChatId(
    chatId: string,
    payload: { page?: number; limit?: number } = { page: 1, limit: 50 }
  ): Promise<FetchChatFilesResponse> {
    return ApiService.get<FetchChatFilesResponse>(
      `${API_ROUTES.CHAT.FETCH_CHAT_FILES.replace("{chat_id}", chatId)}`,
      { params: payload }
    );
  }

  static async getUploadedChatAvatar(fileUrl: string): Promise<Blob> {
    return ApiService.get<Blob>(
      API_ROUTES.CHAT.UPLOADED_AVATAR.replace("{filename}", fileUrl),
      { responseType: "blob" }
    );
  }
}
