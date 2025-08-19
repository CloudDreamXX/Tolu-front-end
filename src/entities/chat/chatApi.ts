import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "shared/lib";
import { getAvatarUrl } from "widgets/message-tabs/helpers";
import { ChatService } from ".";
import { setChats } from "./chatsSlice";
import { clearDownloadProgress, setDownloadProgress } from "./downloadSlice";
import { fileKeyFromUrl, toChatItem } from "./helpers";
import { replaceTempId, upsertMessage, upsertMessages } from "./messagesSlice";
import type {
  ChatItemModel,
  ChatMessageModel,
  ChatNoteResponse,
  CreateChatGroupResponse,
  CreateChatPayload,
  FetchChatDetailsResponse,
  FetchChatFilesResponse,
  FetchChatMessagesResponse,
  GetAllChatNotesResponse,
  MessageUser,
  SendChatNotePayload,
  SendMessagePayload,
  SendMessageResponse,
  UpdateChatNotePayload,
  UpdateGroupChatPayload,
  UpdateGroupChatResponse,
  UploadChatFileResponse,
} from "./model";

const avatarCache = new Map<string, string | null>();

export async function resolveAvatar(fileUrl: string) {
  const key = fileUrl?.split("/").pop() || fileUrl;
  if (avatarCache.has(key)) return avatarCache.get(key)!;
  const full = await getAvatarUrl(key);
  const safe = typeof full === "string" && full.trim() ? full : null;
  avatarCache.set(key, safe);
  return safe;
}

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Chat", "Message", "Files", "Details"],
  endpoints: (builder) => ({
    fetchAllChats: builder.query<ChatItemModel[], void>({
      async queryFn() {
        try {
          const serverList = await ChatService.fetchAllChats();
          const mapped = serverList.map(toChatItem);
          return { data: mapped };
        } catch (e: any) {
          return { error: e };
        }
      },
      providesTags: ["Chat"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setChats(data));

          const hydrated = await Promise.all(
            data.map(async (c) => {
              let avatarUrl: string = c.avatar_url;
              if (avatarUrl) {
                try {
                  const url = await resolveAvatar(avatarUrl);
                  avatarUrl = url ?? "";
                } catch {
                  avatarUrl = "";
                }
              }
              return { ...c, avatar_url: avatarUrl };
            })
          );
          const hydratedRecord = hydrated.reduce<Record<string, ChatItemModel>>(
            (acc, chat) => {
              acc[chat.id] = chat;
              return acc;
            },
            {}
          );
          dispatch(setChats(hydratedRecord));
        } catch {
          toast({ title: "Failed to fetch chats", variant: "destructive" });
        }
      },
    }),

    fetchChatDetailsById: builder.query<
      FetchChatDetailsResponse,
      { chatId: string }
    >({
      async queryFn({ chatId }) {
        try {
          const data = await ChatService.fetchChatDetailsById(chatId);
          data.avatar_url = (await resolveAvatar(data.avatar_url)) ?? "";
          return { data };
        } catch (e: any) {
          return { error: e };
        }
      },
      providesTags: (_r, _e, arg) => [{ type: "Details", id: arg.chatId }],
    }),

    fetchChatMessages: builder.query<
      FetchChatMessagesResponse,
      { chatId: string; page?: number; limit?: number }
    >({
      async queryFn({ chatId, page = 1, limit = 50 }) {
        try {
          return {
            data: await ChatService.fetchChatMessages(chatId, { page, limit }),
          };
        } catch (e: any) {
          return { error: e };
        }
      },
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

    sendMessage: builder.mutation<
      SendMessageResponse,
      SendMessagePayload & { tempId: string; profile: MessageUser }
    >({
      async queryFn(payload) {
        try {
          return { data: await ChatService.sendMessage({ ...payload }) };
        } catch (e: any) {
          return { error: e };
        }
      },
      async onQueryStarted(payload, { dispatch, queryFulfilled }) {
        if (!payload.chat_id) return;

        const optimistic: ChatMessageModel = {
          id: payload.tempId,
          chat_id: payload.chat_id,
          content: payload.content,
          file_url: null,
          file_name: null,
          file_size: null,
          file_type: null,
          sender: {
            id: payload.profile.id,
            email: payload.profile.email,
            name: payload.profile.name,
          },
          created_at: new Date().toISOString(),
        };

        dispatch(upsertMessage(optimistic));

        try {
          const { data } = await queryFulfilled;
          dispatch(
            replaceTempId({
              ...data,
              tempId: payload.tempId,
            })
          );
        } catch {
          toast({ title: "Failed to send message", variant: "destructive" });
        }
      },
    }),

    deleteMessage: builder.mutation<
      void,
      { chatId: string; messageId: string }
    >({
      async queryFn({ chatId, messageId }) {
        try {
          await ChatService.deleteMessage(chatId, messageId);
          return { data: undefined };
        } catch (e: any) {
          return { error: e };
        }
      },
      invalidatesTags: (_r, _e, arg) => [{ type: "Message", id: arg.chatId }],
    }),

    createGroupChat: builder.mutation<
      CreateChatGroupResponse,
      CreateChatPayload
    >({
      async queryFn(payload) {
        try {
          return { data: await ChatService.createGroupChat(payload) };
        } catch (e: any) {
          return { error: e };
        }
      },
      invalidatesTags: ["Chat"],
    }),

    updateGroupChat: builder.mutation<
      UpdateGroupChatResponse,
      { chatId: string; payload: UpdateGroupChatPayload }
    >({
      async queryFn({ chatId, payload }) {
        try {
          return { data: await ChatService.updateGroupChat(chatId, payload) };
        } catch (e: any) {
          return { error: e };
        }
      },
      invalidatesTags: (_r, _e, arg) => [
        { type: "Details", id: arg.chatId },
        "Chat",
      ],
    }),

    uploadChatFile: builder.mutation<
      UploadChatFileResponse,
      { chatId: string; file: File; profile: MessageUser; tempId: string }
    >({
      async queryFn({ chatId, file }) {
        try {
          return { data: await ChatService.uploadChatFile(chatId, file) };
        } catch (e: any) {
          return { error: e };
        }
      },
      invalidatesTags: (_r, _e, arg) => [{ type: "Files", id: arg.chatId }],
      async onQueryStarted(
        { chatId, profile, tempId },
        { dispatch, queryFulfilled }
      ) {
        if (!chatId) return;

        const optimistic: ChatMessageModel = {
          id: tempId,
          chat_id: chatId,
          content: "",
          file_url: null,
          file_name: null,
          file_size: null,
          file_type: null,
          sender: {
            id: profile.id,
            email: profile.email,
            name: profile.name,
          },
          created_at: new Date().toISOString(),
        };

        dispatch(upsertMessage(optimistic));

        try {
          const { data } = await queryFulfilled;
          dispatch(
            replaceTempId({
              ...optimistic,
              ...data,
              tempId: tempId,
            })
          );
        } catch {
          toast({
            title: "Error",
            description: "Failed to upload file",
            variant: "destructive",
          });
        }
      },
    }),

    fetchAllFilesByChatId: builder.query<
      FetchChatFilesResponse,
      { chatId: string; page?: number; limit?: number }
    >({
      async queryFn({ chatId, page = 1, limit = 50 }) {
        try {
          return {
            data: await ChatService.fetchAllFilesByChatId(chatId, {
              page,
              limit,
            }),
          };
        } catch (e: any) {
          return { error: e };
        }
      },
      providesTags: (_r, _e, arg) => [{ type: "Files", id: arg.chatId }],
    }),

    getUploadedChatFileUrl: builder.query<string, { fileUrl: string }>({
      async queryFn({ fileUrl }, { signal, dispatch }) {
        try {
          const blob = await ChatService.getUploadedChatFiles(
            fileUrl,
            (pct) => {
              dispatch(setDownloadProgress({ key: fileUrl, pct }));
            },
            { signal }
          );
          const url = URL.createObjectURL(blob);
          dispatch(clearDownloadProgress(fileUrl));
          return { data: url };
        } catch (e: any) {
          return { error: e };
        }
      },
      keepUnusedDataFor: 600,
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const key = fileKeyFromUrl(queryArgs.fileUrl);
        return `${endpointName}:${key}`;
      },
      forceRefetch({ currentArg, previousArg }) {
        if (!currentArg || !previousArg) return true;
        const cur = fileKeyFromUrl(currentArg.fileUrl);
        const prev = fileKeyFromUrl(previousArg.fileUrl);
        return cur !== prev;
      },
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
          const blob = await ChatService.getUploadedChatAvatar(fileUrl);
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
      async queryFn(payload) {
        try {
          return { data: await ChatService.sendChatNote(payload) };
        } catch (e: any) {
          return { error: e };
        }
      },
    }),

    getAllChatNotes: builder.query<GetAllChatNotesResponse, { chatId: string }>(
      {
        async queryFn({ chatId }) {
          try {
            return { data: await ChatService.getAllChatNotes(chatId) };
          } catch (e: any) {
            return { error: e };
          }
        },
      }
    ),

    updateChatNote: builder.mutation<
      ChatNoteResponse,
      { noteId: string; payload: UpdateChatNotePayload }
    >({
      async queryFn({ noteId, payload }) {
        try {
          return { data: await ChatService.updateChatNote(noteId, payload) };
        } catch (e: any) {
          return { error: e };
        }
      },
    }),

    deleteChatNote: builder.mutation<
      string,
      { noteId: string; chatId: string }
    >({
      async queryFn({ noteId }) {
        try {
          return { data: await ChatService.deleteChatNote(noteId) };
        } catch (e: any) {
          return { error: e };
        }
      },
    }),
  }),
});

export const {
  useFetchAllChatsQuery,
  useFetchChatDetailsByIdQuery,
  useFetchChatMessagesQuery,
  useLazyFetchAllChatsQuery,
  useLazyFetchChatMessagesQuery,
  useSendMessageMutation,
  useDeleteMessageMutation,
  useCreateGroupChatMutation,
  useUpdateGroupChatMutation,
  useUploadChatFileMutation,
  useFetchAllFilesByChatIdQuery,
  useGetUploadedChatFileUrlQuery,
  useGetUploadedChatAvatarUrlQuery,
  useSendChatNoteMutation,
  useGetAllChatNotesQuery,
  useUpdateChatNoteMutation,
  useDeleteChatNoteMutation,
} = chatApi;
