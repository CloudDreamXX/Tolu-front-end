import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "entities/store";
import { API_ROUTES } from "shared/api";
import {
  AcceptInvitePayload,
  AcceptInviteResponse,
  Client,
  ClientInvitationInfo,
  FoldersResponse,
  GetCoachesResponse,
  RequestInvitePayload,
  SharedCoachContentByContentIdResponse,
  UserProfileUpdate,
} from "./model";

export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user?.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getInvitationDetails: builder.query<ClientInvitationInfo, string>({
      query: (token) =>
        API_ROUTES.CLIENT.GET_INVITATION_DETAILS.replace("{token}", token),
    }),
    acceptCoachInvite: builder.mutation<
      AcceptInviteResponse,
      AcceptInvitePayload
    >({
      query: (payload) => ({
        url: `${API_ROUTES.CLIENT.ACCEPT_COACH_INVITE}`,
        method: "POST",
        body: payload,
      }),
    }),
    getSharedContentById: builder.query<any, string>({
      query: (contentId) => ({
        url: API_ROUTES.CLIENT.GET_SHARED_CONTENT_BY_ID.replace(
          "{content_id}",
          contentId
        ),
      }),
    }),
    getLibraryContent: builder.query<
      FoldersResponse,
      { page: number; page_size: number; folder_id: string | null }
    >({
      query: ({ page = 1, page_size = 10, folder_id = null }) => ({
        url: API_ROUTES.CLIENT.GET_LIBRARY_CONTENT,
        params: {
          page,
          page_size,
          folder_id,
        },
      }),
    }),
    updateUserProfile: builder.mutation<
      any,
      { payload: UserProfileUpdate; photo: File | null }
    >({
      query: ({ payload, photo = null }) => {
        const formData = new FormData();
        formData.append("profile_data", JSON.stringify(payload));
        if (photo) formData.append("photo", photo);

        return {
          url: API_ROUTES.CLIENT.UPDATE_PROFILE,
          method: "PUT",
          body: formData,
        };
      },
    }),

    fetchSharedCoachContentByContentId: builder.query<
      SharedCoachContentByContentIdResponse,
      string
    >({
      query: (contentId) =>
        API_ROUTES.CLIENT.GET_SHARED_COACH_CONTENT.replace(
          "{content_id}",
          contentId
        ),
    }),
    requestNewInvite: builder.mutation<any, RequestInvitePayload>({
      query: (payload) => ({
        url: API_ROUTES.CLIENT.REQUEST_INVITE,
        method: "POST",
        body: payload,
      }),
    }),
    getClientProfile: builder.query<Client, void>({
      query: () => API_ROUTES.CLIENT.GET_PROFILE,
    }),
    getCoaches: builder.query<GetCoachesResponse, void>({
      query: () => API_ROUTES.CLIENT.GET_COACHES,
    }),
    getCoachProfile: builder.query<any, string>({
      query: (coachId) =>
        API_ROUTES.CLIENT.GET_COACH_PROFILE.replace("{coach_id}", coachId),
    }),
    downloadCoachPhoto: builder.query<
      Blob,
      { coachId: string; filename: string }
    >({
      query: ({ coachId, filename }) => {
        const endpoint = API_ROUTES.CLIENT.DOWNLOAD_COACH_PHOTO.replace(
          "{coach_id}",
          coachId
        ).replace("{filename}", encodeURIComponent(filename));

        return {
          url: endpoint,
          method: "GET",
          responseType: "blob",
        };
      },
    }),
  }),
});

export const {
  useGetInvitationDetailsQuery,
  useLazyGetInvitationDetailsQuery,
  useAcceptCoachInviteMutation,
  useGetLibraryContentQuery,
  useLazyGetLibraryContentQuery,
  useUpdateUserProfileMutation,
  useLazyFetchSharedCoachContentByContentIdQuery,
  useRequestNewInviteMutation,
  useGetClientProfileQuery,
  useGetCoachesQuery,
  useLazyGetCoachProfileQuery,
  useLazyDownloadCoachPhotoQuery,
} = clientApi;

export class ClientService {
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
}
