import { API_ROUTES } from "shared/api";
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
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "entities/store";

export const coachApi = createApi({
  reducerPath: "coachApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // === CLIENT MANAGEMENT ===
    getManagedClients: builder.query<ClientsResponse, void>({
      query: () => API_ROUTES.COACH_ADMIN.GET_CLIENTS,
    }),

    inviteClient: builder.mutation<
      { success: boolean; message: string },
      { payload: InviteClientPayload | null; file?: File }
    >({
      query: ({ payload }) => {
        return {
          url: API_ROUTES.COACH_ADMIN.POST_CLIENT,
          method: "POST",
          body: payload,
        };
      },
    }),

    getClientProfile: builder.query<ClientProfile, string>({
      query: (clientId) =>
        API_ROUTES.COACH_ADMIN.GET_CLIENT_PROFILE.replace(
          "{client_id}",
          clientId
        ),
    }),

    deleteClient: builder.mutation<any, string>({
      query: (clientId) => ({
        url: API_ROUTES.COACH_ADMIN.DELETE_CLIENT.replace(
          "{client_id}",
          clientId
        ),
        method: "DELETE",
      }),
    }),

    getClientInfo: builder.query<GetClientInfoResponse, string>({
      query: (clientId) =>
        API_ROUTES.COACH_ADMIN.GET_CLIENT_INFO.replace("{client_id}", clientId),
    }),

    editClient: builder.mutation<
      any,
      { clientId: string; payload: ClientDetails }
    >({
      query: ({ clientId, payload }) => ({
        url: API_ROUTES.COACH_ADMIN.GET_CLIENT_INFO.replace(
          "{client_id}",
          clientId
        ),
        method: "PUT",
        body: payload,
      }),
    }),

    changeStatus: builder.mutation<any, Status>({
      query: (status) => ({
        url: API_ROUTES.COACH_ADMIN.CHANGE_STATUS,
        method: "PUT",
        body: status,
      }),
    }),

    // === SESSION ===
    getSessionById: builder.query<ISessionResponse, string>({
      query: (chatId) =>
        API_ROUTES.COACH_ADMIN.GET_SESSION.replace("{chat_id}", chatId),
    }),

    // === CONTENT SHARING & RATING ===
    rateContent: builder.mutation<
      { content_id: boolean; message: string },
      RateContent
    >({
      query: (payload) => ({
        url: API_ROUTES.COACH_ADMIN.RATE_CONTENT,
        method: "POST",
        body: payload,
      }),
    }),

    shareContent: builder.mutation<any, ShareContentData>({
      query: (payload) => ({
        url: API_ROUTES.COACH_ADMIN.SHARE_CONTENT,
        method: "POST",
        body: payload,
      }),
    }),

    getContentShares: builder.query<SharedContent, string>({
      query: (contentId) =>
        API_ROUTES.COACH_ADMIN.GET_SHARED_ACCESS.replace(
          "{content_id}",
          contentId
        ),
    }),

    revokeContent: builder.mutation<any, ShareContentData>({
      query: (payload) => ({
        url: API_ROUTES.COACH_ADMIN.REVOKE_CONTENT_ACCESS,
        method: "POST",
        body: payload,
      }),
    }),

    getAllUserContent: builder.query<ContentResponse, void>({
      query: () => API_ROUTES.COACH_ADMIN.SEARCH_CONTENT,
    }),

    // === CHAT MANAGEMENT ===
    updateChatTitle: builder.mutation<any, NewChatTitle>({
      query: (data) => ({
        url: API_ROUTES.AI.UPDATE_CHAT_TITLE,
        method: "PUT",
        body: data,
      }),
    }),

    // === TRACKERS ===
    shareTracker: builder.mutation<any, FmpShareRequest>({
      query: (data) => ({
        url: API_ROUTES.COACH_ADMIN.SHARE_FMP,
        method: "POST",
        body: data,
      }),
    }),

    submitTracker: builder.mutation<any, FmpTracker>({
      query: (data) => ({
        url: API_ROUTES.COACH_ADMIN.POST_FMP,
        method: "POST",
        body: data,
      }),
    }),

    deleteTracker: builder.mutation<any, string>({
      query: (id) => ({
        url: API_ROUTES.COACH_ADMIN.DELETE_FMP.replace("{tracker_id}", id),
        method: "DELETE",
      }),
    }),

    // === COMPREHENSIVE CLIENT PROFILE ===
    getComprehensiveClient: builder.query<ClientComprehensiveProfile, string>({
      query: (id) =>
        API_ROUTES.COACH_ADMIN.GET_COMPREHENSIVE_CLIENT.replace(
          "{client_id}",
          id
        ),
    }),

    updateComprehensiveClient: builder.mutation<
      any,
      { id: string; data: ComprehensiveProfile }
    >({
      query: ({ id, data }) => ({
        url: API_ROUTES.COACH_ADMIN.UPDATE_COMPREHENSIVE_CLIENT.replace(
          "{client_id}",
          id
        ),
        method: "PUT",
        body: data,
      }),
    }),

    // === LAB FILES ===
    getLabFile: builder.query<any, { client_id: string; file_name: string }>({
      query: ({ client_id, file_name }) =>
        API_ROUTES.COACH_ADMIN.GET_LAB_FILE.replace(
          "{client_id}",
          client_id
        ).replace("{file_name}", file_name),
    }),

    // === HEALTH HISTORY ===
    updateHealthHistory: builder.mutation<any, UpdateHealthHistoryRequest>({
      query: (data) => ({
        url: API_ROUTES.COACH_ADMIN.UPDATE_HEALTH_HISTORY,
        method: "POST",
        body: data,
      }),
    }),

    // === LICENSE FILES ===
    downloadLicenseFile: builder.query<Blob, string>({
      query: (filename) => ({
        url: API_ROUTES.COACH_ADMIN.DOWNLOAD_LICENSE.replace(
          "{filename}",
          filename
        ),
        responseHandler: (response) => response.blob(),
      }),
    }),

    deleteLicenseFile: builder.mutation<any, string>({
      query: (filename) => ({
        url: API_ROUTES.COACH_ADMIN.DELETE_LICENSE.replace(
          "{filename}",
          filename
        ),
        method: "DELETE",
      }),
    }),

    // === FOLDERS ===
    editFolder: builder.mutation<
      { success: boolean; message: string },
      { payload: UpdateFolderRequest; files?: File[] }
    >({
      query: ({ payload, files = [] }) => {
        const form = new FormData();
        form.append("edit_data", JSON.stringify(payload));
        files.forEach((f) => form.append("files", f));

        return {
          url: API_ROUTES.COACH_ADMIN.EDIT_FOLDER,
          method: "PUT",
          body: form,
        };
      },
    }),
  }),
});

export const {
  useGetManagedClientsQuery,
  useLazyGetManagedClientsQuery,
  useInviteClientMutation,
  useDeleteClientMutation,
  useEditClientMutation,
  useLazyGetClientInfoQuery,
  useLazyGetClientProfileQuery,
  useChangeStatusMutation,
  useGetSessionByIdQuery,
  useLazyGetSessionByIdQuery,
  useRateContentMutation,
  useShareContentMutation,
  useGetContentSharesQuery,
  useLazyGetContentSharesQuery,
  useRevokeContentMutation,
  useGetAllUserContentQuery,
  useUpdateChatTitleMutation,
  useShareTrackerMutation,
  useSubmitTrackerMutation,
  useDeleteTrackerMutation,
  useGetComprehensiveClientQuery,
  useGetLabFileQuery,
  useUpdateComprehensiveClientMutation,
  useUpdateHealthHistoryMutation,
  useDownloadLicenseFileQuery,
  useLazyDownloadLicenseFileQuery,
  useDeleteLicenseFileMutation,
  useEditFolderMutation,
} = coachApi;

export class CoachService {
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

  static async aiLearningCardSearch(
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
  ): Promise<{ folderId: string; documentId: string; chatId: string }> {
    const endpoint =
      import.meta.env.VITE_API_URL +
      API_ROUTES.COACH_ADMIN.AI_LEARNING_CARD_SEARCH;

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
}
