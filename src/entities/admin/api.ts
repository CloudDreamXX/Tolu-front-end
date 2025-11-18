import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AdminChatModel,
  AdminGetFeedbackResponse,
  ManageContentData,
  SendMessagePayload,
  SendMessageResponse,
  UsersResponse,
} from "./model";
import { ChatMessageModel } from "entities/chat";
import { API_ROUTES } from "shared/api";
import { RootState } from "entities/store/lib";
import { ChangePasswordRequest } from "entities/user";

export const adminApi = createApi({
  reducerPath: "adminApi",
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
  tagTypes: [
    "Users",
    "Chats",
    "Messages",
    "Feedback",
    "Folders",
    "Content",
    "Requests",
  ],
  endpoints: (builder) => ({
    getAllUsers: builder.query<UsersResponse, void>({
      query: () => API_ROUTES.ADMIN.GET_ALL_USERS,
      providesTags: ["Users"],
    }),

    getFeedback: builder.query<
      AdminGetFeedbackResponse,
      {
        limit?: number;
        offset?: number;
        start_date?: string;
        end_date?: string;
      }
    >({
      query: ({ limit, offset, start_date, end_date }) => ({
        url: API_ROUTES.ADMIN.GET_FEEDBACK,
        params: { limit, offset, start_date, end_date },
      }),
      providesTags: ["Feedback"],
    }),

    getAllChats: builder.query<AdminChatModel[], void>({
      query: () => API_ROUTES.ADMIN.GET_ALL_CHATS,
      providesTags: ["Chats"],
    }),

    getMessagesByChatId: builder.query<
      ChatMessageModel[],
      { chat_id: string; page?: number; page_size?: number }
    >({
      query: ({ chat_id, page = 1, page_size = 50 }) => ({
        url: API_ROUTES.ADMIN.GET_MESSAGES.replace("{chat_id}", chat_id),
        params: { page, page_size },
      }),
      providesTags: (result, error, { chat_id }) => [
        { type: "Messages", id: chat_id },
      ],
    }),

    sendMessage: builder.mutation<SendMessageResponse, SendMessagePayload>({
      query: (payload) => ({
        url: API_ROUTES.ADMIN.SEND_MESSAGE,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Messages"],
    }),

    getFoldersStructure: builder.query<
      any,
      {
        page?: number;
        page_size?: number;
        folder_id?: string;
        user_id?: string;
      }
    >({
      query: ({ page = 1, page_size = 10, folder_id, user_id }) => ({
        url: API_ROUTES.ADMIN.GET_FOLDERS,
        params: { page, page_size, folder_id, user_id },
      }),
      providesTags: ["Folders"],
    }),

    getUnpublishedContent: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        creator_id?: string;
        unpublished_by?: string;
        date_from?: string;
        date_to?: string;
      }
    >({
      query: ({
        page = 1,
        limit = 10,
        creator_id,
        unpublished_by,
        date_from,
        date_to,
      }) => ({
        url: API_ROUTES.ADMIN.GET_UNPUBLISHED_CONTENT,
        params: { page, limit, creator_id, unpublished_by, date_from, date_to },
      }),
      providesTags: ["Content"],
    }),

    manageContent: builder.mutation<any, ManageContentData>({
      query: (data) => ({
        url: API_ROUTES.ADMIN.MANAGE_CONTENT,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Content"],
    }),

    deleteUser: builder.mutation<any, { userId: string }>({
      query: ({ userId }) => ({
        url: API_ROUTES.ADMIN.DELETE_USER.replace("{user_id}", userId),
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    changeOwnPassword: builder.mutation<any, ChangePasswordRequest>({
      query: (body) => ({
        url: API_ROUTES.ADMIN.CHANGE_PASSWORD,
        method: "POST",
        body,
      }),
    }),

    getAllAccessRequests: builder.query<any, void>({
      query: () => API_ROUTES.ADMIN.GET_ALL_REQUESTS,
      providesTags: ["Requests"],
    }),

    approveRequest: builder.mutation<any, { request_id: string }>({
      query: ({ request_id }) => ({
        url: API_ROUTES.ADMIN.APPROVE_REQUEST.replace(
          "{request_id}",
          request_id
        ),
        method: "POST",
      }),
      invalidatesTags: ["Requests"],
    }),

    denyRequest: builder.mutation<any, { request_id: string }>({
      query: ({ request_id }) => ({
        url: API_ROUTES.ADMIN.DENY_REQUEST.replace("{request_id}", request_id),
        method: "POST",
      }),
      invalidatesTags: ["Requests"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetFeedbackQuery,
  useGetAllChatsQuery,
  useGetMessagesByChatIdQuery,
  useLazyGetMessagesByChatIdQuery,
  useSendMessageMutation,
  useGetFoldersStructureQuery,
  useLazyGetFoldersStructureQuery,
  useGetUnpublishedContentQuery,
  useManageContentMutation,
  useDeleteUserMutation,
  useChangeOwnPasswordMutation,
  useGetAllAccessRequestsQuery,
  useApproveRequestMutation,
  useDenyRequestMutation,
} = adminApi;
