import { API_ROUTES, ApiService } from "shared/api";
import {
  ClientInvitationInfo,
  AcceptInvitePayload,
  AcceptInviteResponse,
  FoldersResponse,
  RequestInvitePayload,
  UserProfileUpdate,
  Client,
  SharedCoachContentByContentIdResponse,
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

  static async getLibraryContent(
    page: number = 1,
    page_size: number = 10,
    folder_id: string | null = null
  ): Promise<FoldersResponse> {
    const params = {
      page,
      page_size,
      folder_id,
    };

    return ApiService.get<FoldersResponse>(
      API_ROUTES.CLIENT.GET_LIBRARY_CONTENT,
      {
        params,
      }
    );
  }

  static async aiPersonalizedSearch(
    chatMessage: string,
    referenceContentId: string,
    images?: File[],
    pdf?: File,
    onChunk?: (data: any) => void,
    onComplete?: (result: any) => void,
    signal?: AbortSignal
  ): Promise<any> {
    const endpoint = import.meta.env.VITE_API_URL + "/ai-personalized-search/";

    const formData = new FormData();
    formData.append("chat_message", chatMessage);
    formData.append("reference_content_id", referenceContentId);

    if (images?.length) {
      images.forEach((file) => formData.append("images", file, file.name));
      formData.append("image", images[0], images[0].name);
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

              folderId = jsonData.folder_id || folderId;
              documentId = jsonData.content_id || documentId;
              chatId = jsonData.chat_id || chatId;

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

  static async requestNewInvite(payload: RequestInvitePayload): Promise<any> {
    return ApiService.post<any>(API_ROUTES.CLIENT.REQUEST_INVITE, payload);
  }

  static async getClientProfile(): Promise<Client> {
    return ApiService.get<Client>(API_ROUTES.CLIENT.GET_PROFILE);
  }

  static async updateUserProfile(
    payload: UserProfileUpdate,
    photo: File | null = null
  ): Promise<any> {
    const endpoint = API_ROUTES.CLIENT.UPDATE_PROFILE;

    const profile: Record<string, string> = {};
    const add = (k: keyof UserProfileUpdate, v?: unknown) => {
      if (v !== undefined && v !== null && v !== "")
        profile[k as string] = String(v);
    };

    add("name", payload.name);
    add("email", payload.email);
    add("phone", payload.phone);
    add("dob", payload.dob);
    add("photo_url", payload.photo_url);
    add("timezone", payload.timezone);
    add("gender", payload.gender);

    const formData = new FormData();
    formData.append("profile_data", JSON.stringify(profile));
    if (photo) formData.append("photo", photo);

    return ApiService.put<any>(endpoint, formData);
  }

  static async fetchSharedCoachContentByContentId(
    contentId: string
  ): Promise<SharedCoachContentByContentIdResponse> {
    return ApiService.get<SharedCoachContentByContentIdResponse>(
      API_ROUTES.CLIENT.GET_SHARED_COACH_CONTENT.replace(
        "{content_id}",
        contentId
      )
    );
  }
}
