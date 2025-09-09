import { API_ROUTES, ApiService } from "shared/api";
import {
  AIChatMessage,
  ClientComprehensiveProfile,
  ClientDetails,
  ClientProfile,
  ClientsResponse,
  ComprehensiveProfile,
  ContentResponse,
  FmpShareRequest,
  FmpTracker,
  GetClientInfoResponse,
  InviteClientPayload,
  ISessionResponse,
  NewChatTitle,
  RateContent,
  ShareContentData,
  SharedContent,
  Status,
  UpdateFolderRequest,
  UpdateHealthHistoryRequest,
} from "./model";

export class CoachService {
  static async getManagedClients(): Promise<ClientsResponse> {
    return ApiService.get<ClientsResponse>(API_ROUTES.COACH_ADMIN.GET_CLIENTS);
  }

  static async inviteClient(
    payload: InviteClientPayload | null,
    file?: File
  ): Promise<{ success: boolean; message: string }> {
    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }

    if (payload) {
      formData.append("invite_data", JSON.stringify(payload));
    }

    return ApiService.postFormData<{ success: boolean; message: string }>(
      API_ROUTES.COACH_ADMIN.POST_CLIENT,
      formData
    );
  }

  static async getClientProfile(
    clientId: string,
    token?: string | null
  ): Promise<ClientProfile> {
    const endpoint = API_ROUTES.COACH_ADMIN.GET_CLIENT_PROFILE.replace(
      "{client_id}",
      clientId
    );
    return ApiService.get<ClientProfile>(endpoint, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
    });
  }

  static async deleteClient(
    clientId: string,
    token: string | null
  ): Promise<{ success: boolean; message: string }> {
    const endpoint = API_ROUTES.COACH_ADMIN.DELETE_CLIENT.replace(
      "{client_id}",
      clientId
    );
    return ApiService.delete<{ success: boolean; message: string }>(endpoint, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "multipart/form-data",
      },
    });
  }

  static async getClientInfo(
    clientId: string,
    token: string | null
  ): Promise<GetClientInfoResponse> {
    const endpoint = API_ROUTES.COACH_ADMIN.GET_CLIENT_INFO.replace(
      "{client_id}",
      clientId
    );
    return ApiService.get<GetClientInfoResponse>(endpoint, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
    });
  }

  static async editClient(
    clientId: string,
    payload: ClientDetails,
    token: string | null
  ): Promise<{ success: boolean; message: string }> {
    const endpoint = API_ROUTES.COACH_ADMIN.PUT_CLIENT_INFO.replace(
      "{client_id}",
      clientId
    );
    return ApiService.put<{ success: boolean; message: string }>(
      endpoint,
      payload,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
      }
    );
  }

  static async aiLearningSearch(
    chatMessage: AIChatMessage,
    folder_id: string,
    images: File[] = [],
    pdf?: File,
    client_id?: string | null,
    libraryFiles?: string[],
    signal?: AbortSignal,
    onChunk?: (data: any) => void,
    onComplete?: (folderId: {
      folderId: string;
      documentId: string;
      chatId: string;
    }) => void
  ): Promise<{
    folderId: string;
    documentId: string;
    chatId: string;
  }> {
    const endpoint =
      import.meta.env.VITE_API_URL + API_ROUTES.COACH_ADMIN.AI_LEARNING_SEARCH;

    const formData = new FormData();
    formData.append("chat_message", JSON.stringify(chatMessage));

    formData.append("folder_id", folder_id);

    if (images?.length) {
      images.forEach((file) => {
        formData.append("files", file);
      });
    }

    if (pdf) {
      formData.append("files", pdf);
    }

    if (client_id) {
      formData.append("client_id", client_id);
    }

    if (libraryFiles && libraryFiles.length) {
      formData.append("library_files", JSON.stringify(libraryFiles));
    }

    try {
      const user = localStorage.getItem("persist:user");
      const parsedUser = user ? JSON.parse(user) : null;
      const token = parsedUser?.token.replace(/"/g, "") ?? null;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          withCredentials: "true",
        },
        body: formData,
        signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error. Status: ${response.status}`);
      }

      if (
        !response.headers.get("content-type")?.includes("text/event-stream")
      ) {
        const data = await response.json();
        if (onComplete) onComplete(data);
        return data;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let folderId = "";
      let documentId = "";
      let chatId = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data:")) {
            try {
              const jsonData = JSON.parse(line.substring(5).trim());

              folderId = jsonData.folder_id;
              documentId = jsonData.content_id;
              chatId = jsonData.chat_id;

              if (onChunk) onChunk(jsonData);
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }

      if (onComplete)
        onComplete({
          folderId,
          documentId,
          chatId,
        });
      return {
        folderId,
        documentId,
        chatId,
      };
    } catch (error) {
      console.error("Error processing stream:", error);
      throw error;
    }
  }

  static async changeStatus(status: Status): Promise<any> {
    return ApiService.put<any>(API_ROUTES.COACH_ADMIN.CHANGE_STATUS, status);
  }

  static async getSessionById(chatId: string): Promise<ISessionResponse> {
    const endpoint = API_ROUTES.COACH_ADMIN.GET_SESSION.replace(
      "{chat_id}",
      chatId
    );
    return ApiService.get<ISessionResponse>(endpoint);
  }

  static async rateContent(
    payload: RateContent
  ): Promise<{ content_id: boolean; message: string }> {
    return ApiService.post<{ content_id: boolean; message: string }>(
      API_ROUTES.COACH_ADMIN.RATE_CONTENT,
      payload
    );
  }

  static async shareContent(payload: ShareContentData): Promise<any> {
    try {
      return await ApiService.post<any>(
        API_ROUTES.COACH_ADMIN.SHARE_CONTENT,
        payload
      );
    } catch (error) {
      console.error("Error sharing content:", error);
      throw error;
    }
  }

  static async getContentShares(contentId: string): Promise<SharedContent> {
    const endpoint = API_ROUTES.COACH_ADMIN.GET_SHARED_ACCESS.replace(
      "{content_id}",
      contentId
    );
    return ApiService.get<SharedContent>(endpoint);
  }

  static async revokeContent(payload: ShareContentData): Promise<any> {
    return ApiService.post<any>(
      API_ROUTES.COACH_ADMIN.REVOKE_CONTENT_ACCESS,
      payload
    );
  }

  static async getAllUserContent(): Promise<ContentResponse> {
    return ApiService.get<ContentResponse>(
      API_ROUTES.COACH_ADMIN.SEARCH_CONTENT
    );
  }

  static async updateChatTitle(data: NewChatTitle): Promise<any> {
    return ApiService.put<any>(API_ROUTES.AI.UPDATE_CHAT_TITLE, data);
  }

  static async shareTracker(data: FmpShareRequest): Promise<any> {
    return ApiService.post<any>(API_ROUTES.COACH_ADMIN.SHARE_FMP, data);
  }

  static async submitTracker(data: FmpTracker): Promise<any> {
    return ApiService.post<any>(API_ROUTES.COACH_ADMIN.POST_FMP, data);
  }

  static async deleteTracker(id: string): Promise<any> {
    const endpoint = API_ROUTES.COACH_ADMIN.DELETE_FMP.replace(
      "{tracker_id}",
      id
    );
    return ApiService.delete<any>(endpoint);
  }

  static async getComprehensiveClient(
    id: string
  ): Promise<ClientComprehensiveProfile> {
    const endpoint = API_ROUTES.COACH_ADMIN.GET_COMPREHENSIVE_CLIENT.replace(
      "{client_id}",
      id
    );
    return ApiService.get<ClientComprehensiveProfile>(endpoint);
  }

  static async getLabFile(client_id: string, file_name: string): Promise<any> {
    let endpoint = API_ROUTES.COACH_ADMIN.GET_LAB_FILE.replace(
      "{client_id}",
      client_id
    );
    endpoint = endpoint.replace("{file_name}", file_name);
    return ApiService.get<any>(endpoint);
  }

  static async updateComprehensiveClient(
    id: string,
    data: ComprehensiveProfile
  ): Promise<any> {
    const endpoint = API_ROUTES.COACH_ADMIN.UPDATE_COMPREHENSIVE_CLIENT.replace(
      "{client_id}",
      id
    );
    return ApiService.put<any>(endpoint, data);
  }

  static async updateHealthHistory(
    data: UpdateHealthHistoryRequest
  ): Promise<any> {
    return ApiService.post<any>(
      API_ROUTES.COACH_ADMIN.UPDATE_HEALTH_HISTORY,
      data
    );
  }

  static async downloadLicenseFile(filename: string): Promise<any> {
    const endpoint = API_ROUTES.COACH_ADMIN.DOWNLOAD_LICENSE.replace(
      "{filename}",
      filename
    );
    return ApiService.get<any>(endpoint, {
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static async deleteLicenseFile(filename: string): Promise<any> {
    const endpoint = API_ROUTES.COACH_ADMIN.DELETE_LICENSE.replace(
      "{filename}",
      filename
    );
    return ApiService.delete<any>(endpoint, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static async editFolder(
    payload: UpdateFolderRequest,
    files: File[] = []
  ): Promise<{ success: boolean; message: string }> {
    const endpoint =
      (import.meta.env.VITE_API_URL ?? "") + API_ROUTES.COACH_ADMIN.EDIT_FOLDER;

    const form = new FormData();
    form.append("edit_data", JSON.stringify(payload));
    files.forEach((f) => form.append("files", f));

    const res = await fetch(endpoint, {
      method: "PUT",
      body: form,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Failed to edit folder (${res.status}) ${detail}`);
    }

    return res.json();
  }
}
