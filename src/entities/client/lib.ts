import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchResultResponseItem } from "entities/search";
import { Message } from "features/chat";
import { Folder } from "./model";

export interface IClientState {
  isMobileDailyJournalOpen?: boolean;
  folderId: string;
  chat: SearchResultResponseItem[];
  lastChatId: string;
  folders: Folder[];
  loading: boolean;
  error: string | null;
  activeChatKey: string;
  chatHistory: {
    [chatKey: string]: Message[];
  };
  selectedChatFiles: File[];
  selectedChatFolder: string | null;
}

const initialState: IClientState = {
  isMobileDailyJournalOpen: false,
  folderId: "",
  chat: [],
  lastChatId: "",
  folders: [],
  loading: false,
  error: null,
  activeChatKey: "",
  chatHistory: {},
  selectedChatFiles: [],
  selectedChatFolder: null,
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setIsMobileDailyJournalOpen(state, action: PayloadAction<boolean>) {
      state.isMobileDailyJournalOpen = action.payload;
    },
    setFolderId(state, action: PayloadAction<string>) {
      state.folderId = action.payload;
    },
    setChat(state, action: PayloadAction<SearchResultResponseItem[]>) {
      state.chat = action.payload;
    },
    setLastChatId(state, action: PayloadAction<string>) {
      state.lastChatId = action.payload;
    },
    setFolders(state, action: PayloadAction<Folder[]>) {
      state.folders = action.payload;

      state.loading = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearError(state) {
      state.error = null;
    },
    setActiveChat: (state, action: PayloadAction<string>) => {
      state.activeChatKey = action.payload;
    },
    addMessageToChat: (
      state,
      action: PayloadAction<{
        chatKey: string;
        message: Message;
      }>
    ) => {
      const { chatKey, message } = action.payload;
      if (!Array.isArray(state.chatHistory[chatKey])) {
        state.chatHistory[chatKey] = [];
      }

      state.chatHistory[chatKey] = [...state.chatHistory[chatKey], message];
    },
    setMessagesToChat: (
      state,
      action: PayloadAction<{
        chatKey: string;
        messages: Message[];
      }>
    ) => {
      const { chatKey, messages } = action.payload;

      if (!Array.isArray(state.chatHistory[chatKey])) {
        state.chatHistory[chatKey] = [];
      }
      state.chatHistory[chatKey] = messages;
    },
    setFilesToChat: (state, action: PayloadAction<File[]>) => {
      state.selectedChatFiles = action.payload;
    },
    setFolderToChat: (state, action: PayloadAction<string | null>) => {
      state.selectedChatFolder = action.payload;
    },
    clearChatHistoryExceptActive: (state) => {
      const activeChatKey = state.activeChatKey;

      Object.keys(state.chatHistory).forEach((chatKey) => {
        if (chatKey !== activeChatKey) {
          delete state.chatHistory[chatKey];
        }
      });
    },
    clearAllChatHistory: (state) => {
      state.chatHistory = {};
      state.selectedChatFiles = [];
      state.selectedChatFolder = null;
    },
  },
});

export const {
  setFolderId,
  setFolders,
  setLoading,
  setError,
  clearError,
  setChat,
  setIsMobileDailyJournalOpen,
  setLastChatId,
  setActiveChat,
  addMessageToChat,
  setMessagesToChat,
  setFilesToChat,
  setFolderToChat,
  clearChatHistoryExceptActive,
  clearAllChatHistory,
} = clientSlice.actions;
export const clientReducer = clientSlice.reducer;
