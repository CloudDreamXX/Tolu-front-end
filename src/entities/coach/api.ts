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
import { BaseResponse } from "entities/models";

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
    getManagedClients: builder.query<BaseResponse<ClientsResponse>, void>({
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

    getClientProfile: builder.query<BaseResponse<ClientProfile>, string>({
      query: (clientId) =>
        API_ROUTES.COACH_ADMIN.GET_CLIENT_PROFILE.replace(
          "{client_id}",
          clientId
        ),
    }),

    getClientCoaches: builder.query<any, string>({
      query: (clientId) =>
        API_ROUTES.COACH_ADMIN.GET_CLIENT_COACHES.replace(
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

    getClientInfo: builder.query<BaseResponse<GetClientInfoResponse>, string>({
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
    getSessionById: builder.query<BaseResponse<ISessionResponse>, string>({
      query: (chatId) =>
        API_ROUTES.COACH_ADMIN.GET_SESSION.replace("{chat_id}", chatId),
    }),

    // === CONTENT SHARING & RATING ===
    rateContent: builder.mutation<
      BaseResponse<{ content_id: boolean; message: string }>,
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

    getContentShares: builder.query<BaseResponse<SharedContent>, string>({
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

    getAllUserContent: builder.query<BaseResponse<ContentResponse>, void>({
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
    getComprehensiveClient: builder.query<BaseResponse<ClientComprehensiveProfile>, string>({
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
  useGetClientCoachesQuery,
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
  private static buildCoachFormData(
    userPrompt: string,
    folderId: string,
    images: File[] = [],
    pdf?: File,
    clientId?: string | null,
    libraryFiles?: string[],
    options?: {
      chatId?: string | null;
      chatTitle?: string | null;
      regenerateId?: string | null;
      textQuote?: string | null;
    }
  ): FormData {
    const formData = new FormData();

    formData.append("user_prompt", userPrompt);
    formData.append("is_new", String(!options?.chatId));
    formData.append("folder_id", folderId);

    if (options?.chatId) formData.append("chat_id", options.chatId);
    if (options?.chatTitle) formData.append("chat_title", options.chatTitle);
    if (options?.regenerateId)
      formData.append("regenerate_id", options.regenerateId);
    if (options?.textQuote)
      formData.append("text_quote", options.textQuote);

    if (clientId) formData.append("client_id", clientId);

    images.forEach((file) => formData.append("files", file));
    if (pdf) formData.append("files", pdf);

    libraryFiles?.forEach((id) =>
      formData.append("library_files", id)
    );

    return formData;
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
    onComplete?: (data: {
      folderId: string;
      documentId: string;
      chatId: string;
    }) => void
  ): Promise<{ folderId: string; documentId: string; chatId: string }> {
    const endpoint =
      import.meta.env.VITE_API_URL +
      API_ROUTES.COACH_ADMIN.AI_LEARNING_SEARCH;

    const formData = this.buildCoachFormData(
      chatMessage.user_prompt ?? "",
      folder_id,
      images,
      pdf,
      client_id,
      libraryFiles,
      {
        chatId: chatMessage.chat_id ?? null,
        chatTitle: chatMessage.chat_title ?? undefined,
        regenerateId: chatMessage.regenerate_id ?? undefined,
      }
    );

    const token = JSON.parse(
      localStorage.getItem("persist:user") || "{}"
    )?.token?.replace(/"/g, "");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }

    if (!response.headers.get("content-type")?.includes("text/event-stream")) {
      const data = await response.json();
      onComplete?.(data);
      return data;
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let folderId = "";
    let documentId = "";
    let chatId = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;

        const json = JSON.parse(line.slice(5).trim());
        folderId = json.folder_id;
        documentId = json.content_id;
        chatId = json.chat_id;

        onChunk?.(json);
      }
    }

    const result = { folderId, documentId, chatId };
    onComplete?.(result);
    return result;
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
    onComplete?: (data: {
      folderId: string;
      documentId: string;
      chatId: string;
    }) => void
  ): Promise<{ folderId: string; documentId: string; chatId: string }> {
    const endpoint =
      import.meta.env.VITE_API_URL +
      API_ROUTES.COACH_ADMIN.AI_LEARNING_CARD_SEARCH;

    const formData = this.buildCoachFormData(
      chatMessage.user_prompt ?? "",
      folder_id,
      images,
      pdf,
      client_id,
      libraryFiles,
      {
        chatId: chatMessage.chat_id ?? null,
        chatTitle: chatMessage.chat_title ?? undefined,
        regenerateId: chatMessage.regenerate_id ?? undefined,
      }
    );

    const token = JSON.parse(
      localStorage.getItem("persist:user") || "{}"
    )?.token?.replace(/"/g, "");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }

    if (!response.headers.get("content-type")?.includes("text/event-stream")) {
      const data = await response.json();
      onComplete?.(data);
      return data;
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let folderId = "";
    let documentId = "";
    let chatId = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;

        const json = JSON.parse(line.slice(5).trim());
        folderId = json.folder_id;
        documentId = json.content_id;
        chatId = json.chat_id;

        onChunk?.(json);
      }
    }

    const result = { folderId, documentId, chatId };
    onComplete?.(result);
    return result;
  }
}
