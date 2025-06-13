import { API_ROUTES, ApiService } from "shared/api";
import {
  AIChatMessage,
  ClientDetails,
  ClientProfile,
  ClientsResponse,
  GetClientInfoResponse,
  InviteClientPayload,
  Status,
} from "./model";

export class CoachService {
  static async getManagedClients(
    token: string | null
  ): Promise<ClientsResponse> {
    return ApiService.get<ClientsResponse>(API_ROUTES.COACH_ADMIN.GET_CLIENTS, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
    });
  }

  static async inviteClient(
    payload: InviteClientPayload,
    token: string | null
  ): Promise<{ success: boolean; message: string }> {
    return ApiService.post<{ success: boolean; message: string }>(
      API_ROUTES.COACH_ADMIN.POST_CLIENT,
      payload,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
      }
    );
  }

  static async getClientProfile(
    clientId: string,
    token: string | null
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
    files?: string[],
    client_id?: string | null,
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

    if (files?.length) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    if (client_id) {
      formData.append("client_id", client_id);
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
              documentId = jsonData.saved_content_id;
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

  static async changeStatus(
    status: Status,
    token: string | null
  ): Promise<any> {
    return ApiService.put<any>(API_ROUTES.COACH_ADMIN.CHANGE_STATUS, status, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
    });
  }
}
