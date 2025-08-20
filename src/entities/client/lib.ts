import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Folder } from "./model";
import { SearchResultResponseItem } from "entities/search";

export interface IClientState {
  isMobileDailyJournalOpen?: boolean;
  folderId: string;
  chat: SearchResultResponseItem[];
  lastChatId: string;
  folders: Folder[];
  loading: boolean;
  error: string | null;
}

const initialState: IClientState = {
  isMobileDailyJournalOpen: false,
  folderId: "",
  chat: [],
  lastChatId: "",
  folders: [],
  loading: false,
  error: null,
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
} = clientSlice.actions;
export const clientReducer = clientSlice.reducer;
