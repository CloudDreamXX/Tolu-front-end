import { API_ROUTES, ApiService } from "shared/api";
import { onDownloadProgress } from "./helpers";
import {
  ChatFileUploadResponse,
  ChatNoteResponse,
  CreateChatGroupResponse,
  CreateChatPayload,
  FetchAllChatsResponse,
  FetchChatDetailsResponse,
  FetchChatFilesResponse,
  FetchChatMessagesResponse,
  GetAllChatNotesResponse,
  SendChatNotePayload,
  SendMessagePayload,
  SendMessageResponse,
  UpdateChatNotePayload,
  UpdateGroupChatPayload,
  UpdateGroupChatResponse,
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
    file?: File,
    libraryFiles?: string[]
  ): Promise<ChatFileUploadResponse> {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }

    if (libraryFiles) {
      formData.append("library_files", JSON.stringify(libraryFiles));
    }

    return ApiService.post<ChatFileUploadResponse>(
      API_ROUTES.CHAT.UPLOAD_FILE.replace("{chat_id}", chatId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  static async getUploadedChatFiles(
    fileUrl: string,
    onProgress?: (percent: number) => void,
    opts?: { signal?: AbortSignal }
  ): Promise<Blob> {
    return ApiService.get<Blob>(
      API_ROUTES.CHAT.UPLOADED_FILE.replace("{filename}", fileUrl),
      {
        responseType: "blob",
        signal: opts?.signal,
        onDownloadProgress: (e) => onDownloadProgress(e, onProgress),
      }
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

  static async sendChatNote(
    payload: SendChatNotePayload
  ): Promise<ChatNoteResponse> {
    const formData = new FormData();
    formData.append("note_data", JSON.stringify(payload.noteData));
    if (payload.file) {
      formData.append("file", payload.file);
    }
    return ApiService.post<ChatNoteResponse>(
      API_ROUTES.CHAT.SEND_CHAT_NOTE,
      formData
    );
  }

  static async getAllChatNotes(
    chatId: string,
    payload: { page?: number; limit?: number } = { page: 1, limit: 50 }
  ): Promise<GetAllChatNotesResponse> {
    return ApiService.get<GetAllChatNotesResponse>(
      API_ROUTES.CHAT.GET_ALL_CHAT_NOTES.replace("{chat_id}", chatId),
      { params: payload }
    );
  }

  static async updateChatNote(
    noteId: string,
    payload: UpdateChatNotePayload
  ): Promise<ChatNoteResponse> {
    const formData = new FormData();
    formData.append("note_data", JSON.stringify(payload.noteData));
    if (payload.file) {
      formData.append("file", payload.file);
    }

    return ApiService.put<ChatNoteResponse>(
      API_ROUTES.CHAT.UPDATE_CHAT_NOTE.replace("{note_id}", noteId),
      formData
    );
  }

  static async deleteChatNote(noteId: string): Promise<string> {
    return ApiService.delete<string>(
      API_ROUTES.CHAT.DELETE_CHAT_NOTE.replace("{note_id}", noteId)
    );
  }

  static async getFileOfChatNotes(
    fileId: string,
    onProgress?: (percent: number) => void
  ): Promise<Blob> {
    return ApiService.get<Blob>(
      API_ROUTES.CHAT.UPLOADED_FILE_CHAT_NOTE.replace("{file_uuid}", fileId),
      {
        responseType: "blob",
        onDownloadProgress: (e) => onDownloadProgress(e, onProgress),
      }
    );
  }

  static async deleteChat(id: string): Promise<string> {
    return ApiService.delete<string>(
      API_ROUTES.CHAT.DELETE_CHAT.replace("{chat_id}", id)
    );
  }
}
