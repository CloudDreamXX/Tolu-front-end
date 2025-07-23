import { API_ROUTES, ApiService } from "shared/api";
import {
  ClientInvitationInfo,
  AcceptInvitePayload,
  AcceptInviteResponse,
  FoldersResponse,
  RequestInvitePayload,
} from "./model";

export class ClientService {
  static async getInvitationDetails(
    token: string
  ): Promise<ClientInvitationInfo> {
    const endpoint = API_ROUTES.CLIENT.GET_INVITATION_DETAILS.replace(
      "{token}",
      token
    );
    return ApiService.get<ClientInvitationInfo>(endpoint, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static async acceptCoachInvite(
    payload: AcceptInvitePayload
  ): Promise<AcceptInviteResponse> {
    return ApiService.post<AcceptInviteResponse>(
      API_ROUTES.CLIENT.ACCEPT_COACH_INVITE,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  static async getSharedContentById(contentId: string): Promise<any> {
    const endpoint = API_ROUTES.CLIENT.GET_SHARED_CONTENT_BY_ID.replace(
      "{content_id}",
      contentId
    );
    return ApiService.get<any>(endpoint, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static async getLibraryContent(): Promise<FoldersResponse> {
    return ApiService.get<FoldersResponse>(
      API_ROUTES.CLIENT.GET_LIBRARY_CONTENT
    );
  }

  static async aiPersonalizedSearch(
    chatMessage: string,
    referenceContentId: string,
    image?: File,
    pdf?: File,
    onChunk?: (data: any) => void,
    onComplete?: (result: any) => void
  ): Promise<any> {
    const endpoint = import.meta.env.VITE_API_URL + "/ai-personalized-search/";

    const formData = new FormData();
    formData.append("chat_message", chatMessage);
    formData.append("reference_content_id", referenceContentId);

    if (image) {
      formData.append("image", image);
    }

    if (pdf) {
      formData.append("pdf", pdf);
    }

    try {
      const user = localStorage.getItem("persist:user");
      const parsedUser = user ? JSON.parse(user) : null;
      const token = parsedUser?.token.replace(/"/g, "") ?? null;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error. Status: ${response.status}`);
      }

      if (response.headers.get("content-type")?.includes("text/event-stream")) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
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
                if (onChunk) onChunk(jsonData);
              } catch (e) {
                console.error("Error parsing SSE data:", e);
              }
            }
          }
        }

        if (onComplete) onComplete(null);
        return null;
      } else {
        const data = await response.json();
        if (onComplete) onComplete(data);
        return data;
      }
    } catch (error) {
      console.error("Error processing AI personalized search:", error);
      throw error;
    }
  }

  static async requestNewInvite(payload: RequestInvitePayload): Promise<any> {
    return ApiService.post<any>(API_ROUTES.CLIENT.REQUEST_INVITE, payload);
  }
}
