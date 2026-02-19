import { API_ROUTES } from "shared/api";
import {
  AIChatMessage,
  ClientComprehensiveProfile,
  ClientDetails,
  ClientProfile,
  ClientsResponse,
  CoachHealthNote,
  CoachHealthNotesResponse,
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
  UpdateHealthHistoryRequest,
} from "./model";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "entities/store";
import { BaseResponse } from "entities/models";

export const coachApi = createApi({
  reducerPath: "coachApi",
  tagTypes: ["CoachHealthNotes"],
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
      query: ({ payload, file }) => {
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          return {
            url: API_ROUTES.COACH_ADMIN.POST_CLIENT,
            method: "POST",
            body: formData,
          };
        }
        return {
          url: API_ROUTES.COACH_ADMIN.POST_CLIENT,
          method: "POST",
          body: payload,
          headers: { "Content-Type": "application/json" },
        };
      },
    }),

    importClients: builder.mutation<
      { success: boolean; message: string },
      { file?: File }
    >({
      query: ({ file }) => {
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          return {
            url: API_ROUTES.COACH_ADMIN.POST_CLIENT_FILE,
            method: "POST",
            body: formData,
          };
        }
        return {
          url: API_ROUTES.COACH_ADMIN.POST_CLIENT_FILE,
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
    getComprehensiveClient: builder.query<
      BaseResponse<ClientComprehensiveProfile>,
      string
    >({
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
      {
        folder_id: string;
        new_name?: string | null;
        parent_folder_id?: string | null;
        status?: string | null;
        instructions?: string | null;
        files?: File[];
        reviewer_ids?: string[] | null;
        reviewer_ids_to_delete?: string[] | null;
        files_to_delete?: number[] | null;
      }
    >({
      query: ({
        folder_id,
        new_name,
        parent_folder_id,
        status,
        instructions,
        files = [],
        reviewer_ids,
        reviewer_ids_to_delete,
        files_to_delete,
      }) => {
        const form = new FormData();
        // All fields as FormData
        form.append("folder_id", folder_id);
        if (typeof new_name === "string") form.append("new_name", new_name);
        if (typeof parent_folder_id === "string")
          form.append("parent_folder_id", parent_folder_id);
        if (typeof status === "string") form.append("status", status);
        if (typeof instructions === "string")
          form.append("instructions", instructions);
        if (Array.isArray(reviewer_ids)) {
          reviewer_ids.forEach((id) => id && form.append("reviewer_ids", id));
        }
        if (Array.isArray(files_to_delete)) {
          files_to_delete.forEach((id) =>
            typeof id === "number"
              ? form.append("files_to_delete", id.toString())
              : undefined
          );
        }
        if (Array.isArray(reviewer_ids_to_delete)) {
          reviewer_ids_to_delete.forEach(
            (id) => id && form.append("reviewer_ids_to_delete", id)
          );
        }
        files.forEach((f) => form.append("files", f));
        return {
          url: API_ROUTES.COACH_ADMIN.EDIT_FOLDER,
          method: "PUT",
          body: form,
        };
      },
    }),
    getHealthHistoryNotes: builder.query<
      CoachHealthNotesResponse,
      { clientId: string; healthHistoryId: string }
    >({
      query: ({ clientId, healthHistoryId }) =>
        API_ROUTES.COACH_ADMIN.GET_NOTES.replace(
          "{client_id}",
          clientId
        ).replace("{health_history_id}", healthHistoryId),

      providesTags: (_result, _error, { healthHistoryId }) => [
        { type: "CoachHealthNotes", id: healthHistoryId },
      ],
    }),

    getHealthHistoryNote: builder.query<
      CoachHealthNote,
      { clientId: string; healthHistoryId: string; noteId: string }
    >({
      query: ({ clientId, healthHistoryId, noteId }) =>
        API_ROUTES.COACH_ADMIN.GET_NOTE.replace("{client_id}", clientId)
          .replace("{health_history_id}", healthHistoryId)
          .replace("{note_id}", noteId),
    }),

    addHealthHistoryNote: builder.mutation<
      CoachHealthNote,
      {
        clientId: string;
        healthHistoryId: string;
        blockName: string;
        noteContent: string;
      }
    >({
      query: ({ clientId, healthHistoryId, blockName, noteContent }) => {
        const formData = new FormData();
        formData.append("block_name", blockName);
        formData.append("note_content", noteContent);

        return {
          url: API_ROUTES.COACH_ADMIN.ADD_NOTE.replace(
            "{client_id}",
            clientId
          ).replace("{health_history_id}", healthHistoryId),
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: (_r, _e, { healthHistoryId }) => [
        { type: "CoachHealthNotes", id: healthHistoryId },
      ],
    }),

    updateHealthHistoryNote: builder.mutation<
      CoachHealthNote,
      {
        clientId: string;
        healthHistoryId: string;
        noteId: string;
        noteContent: string;
      }
    >({
      query: ({ clientId, healthHistoryId, noteId, noteContent }) => {
        const formData = new FormData();
        formData.append("note_content", noteContent);

        return {
          url: API_ROUTES.COACH_ADMIN.UPDATE_NOTE.replace(
            "{client_id}",
            clientId
          )
            .replace("{health_history_id}", healthHistoryId)
            .replace("{note_id}", noteId),
          method: "PUT",
          body: formData,
        };
      },

      invalidatesTags: (_r, _e, { healthHistoryId }) => [
        { type: "CoachHealthNotes", id: healthHistoryId },
      ],
    }),

    deleteHealthHistoryNote: builder.mutation<
      { message: string },
      { clientId: string; healthHistoryId: string; noteId: string }
    >({
      query: ({ clientId, healthHistoryId, noteId }) => ({
        url: API_ROUTES.COACH_ADMIN.DELETE_NOTE.replace("{client_id}", clientId)
          .replace("{health_history_id}", healthHistoryId)
          .replace("{note_id}", noteId),
        method: "DELETE",
      }),

      invalidatesTags: (_r, _e, { healthHistoryId }) => [
        { type: "CoachHealthNotes", id: healthHistoryId },
      ],
    }),

    deleteHealthHistoryNoteByBlock: builder.mutation<
      { message: string },
      {
        clientId: string;
        healthHistoryId: string;
        blockName: string;
      }
    >({
      query: ({ clientId, healthHistoryId, blockName }) => ({
        url: API_ROUTES.COACH_ADMIN.DELETE_NOTE_BY_BLOCK.replace(
          "{client_id}",
          clientId
        )
          .replace("{health_history_id}", healthHistoryId)
          .replace("{block_name}", blockName),
        method: "DELETE",
      }),

      invalidatesTags: (_r, _e, { healthHistoryId }) => [
        { type: "CoachHealthNotes", id: healthHistoryId },
      ],
    }),
  }),
});

export const {
  useGetManagedClientsQuery,
  useLazyGetManagedClientsQuery,
  useInviteClientMutation,
  useImportClientsMutation,
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
  useGetHealthHistoryNotesQuery,
  useAddHealthHistoryNoteMutation,
  useGetHealthHistoryNoteQuery,
  useUpdateHealthHistoryNoteMutation,
  useDeleteHealthHistoryNoteMutation,
  useDeleteHealthHistoryNoteByBlockMutation,
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
    if (options?.textQuote) formData.append("text_quote", options.textQuote);

    if (clientId) formData.append("client_id", clientId);

    images.forEach((file) => formData.append("files", file));
    if (pdf) formData.append("files", pdf);

    libraryFiles?.forEach((id) => formData.append("library_files", id));

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
      import.meta.env.VITE_API_URL + API_ROUTES.COACH_ADMIN.AI_LEARNING_SEARCH;

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
      // If the response is not an event-stream, try to extract from data.data
      if (data && data.data) {
        const result = {
          folderId: data.data.folder_id,
          documentId: data.data.content_id,
          chatId: data.data.chat_id,
        };
        onComplete?.(result);
        return result;
      }
      onComplete?.(data);
      return data;
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let folderId = "";
    let documentId = "";
    let chatId = "";
    let lastData: any = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;

        const json = JSON.parse(line.slice(5).trim());
        // If this is the final message with status and data, extract from json.data
        if (json.status === "success" && json.data) {
          folderId = json.data.folder_id;
          documentId = json.data.content_id;
          chatId = json.data.chat_id;
          lastData = json;
        } else {
          // For streaming chunks, fallback to old keys if present
          folderId = json.folder_id || folderId;
          documentId = json.content_id || documentId;
          chatId = json.chat_id || chatId;
        }
        onChunk?.(json);
      }
    }

    // Prefer the final data object if available
    let result;
    if (lastData && lastData.data) {
      result = {
        folderId: lastData.data.folder_id,
        documentId: lastData.data.content_id,
        chatId: lastData.data.chat_id,
      };
    } else {
      result = { folderId, documentId, chatId };
    }
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
      // If the response is not an event-stream, try to extract from data.data
      if (data && data.data) {
        const result = {
          folderId: data.data.folder_id,
          documentId: data.data.content_id,
          chatId: data.data.chat_id,
        };
        onComplete?.(result);
        return result;
      }
      onComplete?.(data);
      return data;
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let folderId = "";
    let documentId = "";
    let chatId = "";
    let lastData: any = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;

        const json = JSON.parse(line.slice(5).trim());
        // If this is the final message with status and data, extract from json.data
        if (json.status === "success" && json.data) {
          folderId = json.data.folder_id;
          documentId = json.data.content_id;
          chatId = json.data.chat_id;
          lastData = json;
        } else {
          // For streaming chunks, fallback to old keys if present
          folderId = json.folder_id || folderId;
          documentId = json.content_id || documentId;
          chatId = json.chat_id || chatId;
        }
        onChunk?.(json);
      }
    }

    // Prefer the final data object if available
    let result;
    if (lastData && lastData.data) {
      result = {
        folderId: lastData.data.folder_id,
        documentId: lastData.data.content_id,
        chatId: lastData.data.chat_id,
      };
    } else {
      result = { folderId, documentId, chatId };
    }
    onComplete?.(result);
    return result;
  }
}
