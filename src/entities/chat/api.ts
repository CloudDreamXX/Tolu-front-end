import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "shared/lib";
import { getAvatarUrl } from "widgets/message-tabs/helpers";
import { setChats } from "./chatsSlice";
import { clearDownloadProgress } from "./downloadSlice";
import { fileKeyFromUrl, toChatItem } from "./helpers";
import {
  AddMessageReactionPayload,
  ChatFileUploadResponse,
  ChatItemModel,
  ChatMessageModel,
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
  UpdateMessagePayload,
  UpdateMessageResponse,
} from "./model";
import { upsertMessages } from "./messagesSlice";
import { API_ROUTES } from "shared/api";
import { RootState } from "entities/store";

const avatarCache = new Map<string, string | null>();

async function resolveAvatar(fileUrl: string) {
  if (!fileUrl) return null;

  const filename = fileUrl.split("/").pop()!;
  if (avatarCache.has(filename)) return avatarCache.get(filename)!;

  const full = await getAvatarUrl(filename);
  const safe = typeof full === "string" && full.trim() ? full : null;
  avatarCache.set(filename, safe);
  return safe;
}

export const chatApi = createApi({
  reducerPath: "chatApi",
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
  tagTypes: ["Chat", "Message", "Files", "Details"],
  endpoints: (builder) => ({
    fetchAllChats: builder.query<ChatItemModel[], void>({
      query: () => ({
        url: API_ROUTES.CHAT.FETCH_ALL,
        method: "GET",
        params: { page: 1, limit: 50 },
      }),

      transformResponse: (res: FetchAllChatsResponse) =>
        res.map(toChatItem),

      providesTags: ["Chat"],

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          const hydrated = await Promise.all(
            data.map(async (c) => {
              let avatar_url = c.avatar_url;

              if (avatar_url) {
                try {
                  avatar_url = (await resolveAvatar(avatar_url)) ?? "";
                } catch {
                  avatar_url = "";
                }
              }

              return { ...c, avatar_url };
            })
          );

          const record = hydrated.reduce<Record<string, ChatItemModel>>(
            (acc, chat) => {
              acc[chat.id] = chat;
              return acc;
            },
            {}
          );

          dispatch(setChats(record));
        } catch (err) {
          console.error("fetchAllChats error:", err);
          toast({ title: "Failed to fetch chats", variant: "destructive" });
        }
      },
    }),


    fetchChatDetailsById: builder.query<FetchChatDetailsResponse, string>({
      query: (chatId) => ({
        url: API_ROUTES.CHAT.FETCH_ONE.replace("{chat_id}", chatId),
      }),
      async transformResponse(res: FetchChatDetailsResponse) {
        res.avatar_url = (await resolveAvatar(res.avatar_url)) ?? "";
        return res;
      },
      providesTags: (_r, _e, chatId) => [{ type: "Details", id: chatId }],
    }),

    deleteChat: builder.mutation<string, string>({
      query: (chatId) => ({
        url: API_ROUTES.CHAT.DELETE_CHAT.replace("{chat_id}", chatId),
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),

    fetchChatMessages: builder.query<
      FetchChatMessagesResponse,
      { chatId: string; page?: number; limit?: number }
    >({
      query: ({ chatId, page = 1, limit = 50 }) => ({
        url: API_ROUTES.CHAT.FETCH_CHAT_MESSAGES.replace("{chat_id}", chatId),
        params: { page, limit },
      }),
      providesTags: (_r, _e, arg) => [{ type: "Message", id: arg.chatId }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        queryFulfilled.then(({ data }) => {
          if (data?.messages?.length)
            dispatch(
              upsertMessages(
                data.messages.map((m) => ({ ...m, chat_id: arg.chatId }))
              )
            );
        });
      },
    }),

    sendMessage: builder.mutation<SendMessageResponse, SendMessagePayload>({
      query: (payload) => ({
        url: API_ROUTES.CHAT.SEND_MESSAGE,
        method: "POST",
        body: payload,
      }),
      // async onQueryStarted(payload, { dispatch, queryFulfilled }) {
      //   const optimistic: ChatMessageModel = {
      //     id: payload.tempId,
      //     chat_id: payload.chat_id!,
      //     content: payload.content,
      //     file_url: null,
      //     file_name: null,
      //     file_size: null,
      //     file_type: null,
      //     sender: payload.profile,
      //     created_at: new Date().toISOString(),
      //     message_type: "",
      //     is_deleted: false,
      //     reactions: [],
      //   };
      //   dispatch(upsertMessage(optimistic));
      //   try {
      //     const { data } = await queryFulfilled;
      //     dispatch(replaceTempId({ ...data, tempId: payload.tempId }));
      //   } catch {
      //     toast({ title: "Failed to send message", variant: "destructive" });
      //   }
      // },
    }),

    deleteMessage: builder.mutation<
      void,
      { chatId: string; messageId: string }
    >({
      query: ({ chatId, messageId }) => ({
        url: API_ROUTES.CHAT.DELETE_MESSAGE.replace(
          "{chat_id}",
          chatId
        ).replace("{message_id}", messageId),
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Message", id: arg.chatId }],
    }),

    updateMessage: builder.mutation<
      UpdateMessageResponse,
      UpdateMessagePayload
    >({
      query: ({ chatId, messageId, content }) => ({
        url: API_ROUTES.CHAT.UPDATE_MESSAGE
          .replace("{chat_id}", chatId)
          .replace("{message_id}", messageId),
        method: "PUT",
        body: { content },
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Message", id: arg.chatId },
      ],
    }),

    createGroupChat: builder.mutation<
      CreateChatGroupResponse,
      CreateChatPayload
    >({
      query: (payload) => {
        const formData = new FormData();
        formData.append("request", JSON.stringify(payload.request));
        if (payload.avatar_image)
          formData.append("avatar_image", payload.avatar_image);
        return {
          url: API_ROUTES.CHAT.CREATE_GROUP_CHAT,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Chat"],
    }),

    updateGroupChat: builder.mutation<
      UpdateGroupChatResponse,
      { chatId: string; payload: UpdateGroupChatPayload }
    >({
      query: ({ chatId, payload }) => {
        const formData = new FormData();
        formData.append("request", JSON.stringify(payload.request));
        if (payload.avatar_image)
          formData.append("avatar_image", payload.avatar_image);
        return {
          url: API_ROUTES.CHAT.UPDATE_GROUP_CHAT.replace("{chat_id}", chatId),
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (_r, _e, arg) => [
        { type: "Details", id: arg.chatId },
        "Chat",
      ],
    }),

    uploadChatFile: builder.mutation<
      ChatFileUploadResponse,
      { chatId: string; file?: File; libraryFiles?: string[] }
    >({
      query: ({ chatId, file, libraryFiles }) => {
        const formData = new FormData();
        if (file) {
          formData.append("file", file);
        }
        if (libraryFiles) {
          formData.append("library_files", JSON.stringify(libraryFiles));
        }
        return {
          url: API_ROUTES.CHAT.UPLOAD_FILE.replace("{chat_id}", chatId),
          method: "POST",
          body: formData,
        };
      },
      // async onQueryStarted({ chatId, profile, tempId }, { dispatch, queryFulfilled }) {
      //   const optimistic: ChatMessageModel = {
      //     id: tempId,
      //     chat_id: chatId,
      //     content: "",
      //     file_url: null,
      //     file_name: null,
      //     file_size: null,
      //     file_type: null,
      //     sender: profile,
      //     created_at: new Date().toISOString(),
      //     message_type: "",
      //     is_deleted: false,
      //     reactions: [],
      //   };
      //   dispatch(upsertMessage(optimistic));
      //   try {
      //     const { data } = await queryFulfilled;
      //     dispatch(replaceTempId({ ...optimistic, ...data, tempId }));
      //   } catch {
      //     toast({
      //       title: "Error",
      //       description: "Failed to upload file",
      //       variant: "destructive",
      //     });
      //   }
      // },
      invalidatesTags: (_r, _e, arg) => [{ type: "Files", id: arg.chatId }],
    }),

    fetchAllFilesByChatId: builder.query<
      FetchChatFilesResponse,
      { chatId: string; page?: number; limit?: number }
    >({
      query: ({ chatId, page = 1, limit = 50 }) => ({
        url: API_ROUTES.CHAT.FETCH_CHAT_FILES.replace("{chat_id}", chatId),
        params: { page, limit },
      }),
      providesTags: (_r, _e, arg) => [{ type: "Files", id: arg.chatId }],
    }),

    getUploadedChatFile: builder.query<Blob, { fileKey: string }>({
      query: ({ fileKey }) => ({
        url: API_ROUTES.CHAT.UPLOADED_FILE.replace("{filename}", fileKey),
        responseHandler: (response) => response.blob(),
      }),
    }),

    getUploadedNoteFile: builder.query<
      Blob,
      { userId: string; fileKey: string }
    >({
      query: ({ userId, fileKey }) => ({
        url: API_ROUTES.CHAT.UPLOADED_NOTE_FILE.replace(
          "{user_id}",
          userId
        ).replace("{filename}", fileKey),
        responseHandler: (response) => response.blob(),
      }),
    }),

    getUploadedChatFileUrl: builder.query<string, { fileUrl: string }>({
      async queryFn({ fileUrl }, { signal, dispatch }) {
        try {
          const res = await fetch(
            API_ROUTES.CHAT.UPLOADED_FILE.replace("{filename}", fileUrl),
            { signal }
          );
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          dispatch(clearDownloadProgress(fileUrl));
          return { data: url };
        } catch (e: any) {
          const message = e.message ?? "Failed to load file";
          return {
            error: { status: 500, data: { message, code: "FETCH_ERROR" } },
          };
        }
      },
      keepUnusedDataFor: 600,
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}:${fileKeyFromUrl(queryArgs.fileUrl)}`,
      async onCacheEntryAdded(_, { cacheDataLoaded, cacheEntryRemoved }) {
        let objectUrl: string | null = null;
        try {
          const res = await cacheDataLoaded;
          objectUrl = res?.data as string | null;
        } catch {
          toast({
            title: "Error",
            description: "Failed to load file preview",
            variant: "destructive",
          });
        }
        try {
          await cacheEntryRemoved;
        } finally {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
        }
      },
    }),

    getUploadedChatAvatarUrl: builder.query<string, { fileUrl: string }>({
      async queryFn({ fileUrl }) {
        try {
          const res = await fetch(
            API_ROUTES.CHAT.UPLOADED_AVATAR.replace("{filename}", fileUrl)
          );
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          return { data: url };
        } catch (e: any) {
          return { error: e };
        }
      },
      keepUnusedDataFor: 600,
      async onCacheEntryAdded(_, { cacheDataLoaded, cacheEntryRemoved }) {
        let objectUrl: string | null = null;
        try {
          const res = await cacheDataLoaded;
          objectUrl = res?.data as string | null;
        } catch {
          toast({
            title: "Error",
            description: "Failed to load image preview",
            variant: "destructive",
          });
        }
        try {
          await cacheEntryRemoved;
        } finally {
          if (objectUrl) URL.revokeObjectURL(objectUrl);
        }
      },
    }),

    sendChatNote: builder.mutation<ChatNoteResponse, SendChatNotePayload>({
      query: (payload) => {
        const formData = new FormData();
        formData.append("note_data", JSON.stringify(payload.noteData));
        if (payload.file) formData.append("file", payload.file);
        return {
          url: API_ROUTES.CHAT.SEND_CHAT_NOTE,
          method: "POST",
          body: formData,
        };
      },
    }),

    getAllChatNotes: builder.query<GetAllChatNotesResponse, string>({
      query: (chatId) => ({
        url: API_ROUTES.CHAT.GET_ALL_CHAT_NOTES.replace("{chat_id}", chatId),
      }),
    }),

    updateChatNote: builder.mutation<
      ChatNoteResponse,
      { noteId: string; payload: UpdateChatNotePayload }
    >({
      query: ({ noteId, payload }) => {
        const formData = new FormData();
        formData.append("note_data", JSON.stringify(payload.noteData));
        if (payload.file) formData.append("file", payload.file);
        return {
          url: API_ROUTES.CHAT.UPDATE_CHAT_NOTE.replace("{note_id}", noteId),
          method: "PUT",
          body: formData,
        };
      },
    }),

    deleteChatNote: builder.mutation<string, string>({
      query: (noteId) => ({
        url: API_ROUTES.CHAT.DELETE_CHAT_NOTE.replace("{note_id}", noteId),
        method: "DELETE",
      }),
    }),

    addMessageReaction: builder.mutation<
      ChatMessageModel,
      AddMessageReactionPayload
    >({
      query: ({ chatId, messageId, reaction }) => ({
        url: API_ROUTES.CHAT.ADD_REACTION.replace("{chat_id}", chatId).replace(
          "{message_id}",
          messageId
        ),
        method: "POST",
        body: { reaction },
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Message", id: arg.chatId }],
    }),

    deleteMessageReaction: builder.mutation<
      ChatMessageModel,
      AddMessageReactionPayload
    >({
      query: ({ chatId, messageId, reaction }) => ({
        url: API_ROUTES.CHAT.DELETE_REACTION.replace(
          "{chat_id}",
          chatId
        ).replace("{message_id}", messageId),
        method: "DELETE",
        body: { reaction },
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Message", id: arg.chatId }],
    }),
  }),
});

export const {
  useFetchAllChatsQuery,
  useFetchChatDetailsByIdQuery,
  useDeleteChatMutation,
  useFetchChatMessagesQuery,
  useLazyFetchChatMessagesQuery,
  useSendMessageMutation,
  useDeleteMessageMutation,
  useUpdateMessageMutation,
  useCreateGroupChatMutation,
  useUpdateGroupChatMutation,
  useLazyGetUploadedChatFileQuery,
  useLazyGetUploadedNoteFileQuery,
  useUploadChatFileMutation,
  useFetchAllFilesByChatIdQuery,
  useLazyFetchAllFilesByChatIdQuery,
  useGetUploadedChatFileUrlQuery,
  useGetUploadedChatAvatarUrlQuery,
  useSendChatNoteMutation,
  useGetAllChatNotesQuery,
  useUpdateChatNoteMutation,
  useDeleteChatNoteMutation,
  useAddMessageReactionMutation,
  useDeleteMessageReactionMutation,
} = chatApi;
