import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Folder } from "./model";
import { SearchResultResponseItem } from "entities/search";

export interface IClientState {
  isMobileChatOpen: boolean;
  isMobileDailyJournalOpen?: boolean;
  folderId: string;
  chat: SearchResultResponseItem[];
  folders: Folder[];
  loading: boolean;
  error: string | null;
}

const initialState: IClientState = {
  isMobileChatOpen: false,
  isMobileDailyJournalOpen: false,
  folderId: "",
  chat: [],
  folders: [],
  loading: false,
  error: null,
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setIsMobileChatOpen(state, action: PayloadAction<boolean>) {
      state.isMobileChatOpen = action.payload;
    },
    setIsMobileDailyJournalOpen(state, action: PayloadAction<boolean>) {
      state.isMobileDailyJournalOpen = action.payload;
    },
    setFolderId(state, action: PayloadAction<string>) {
      state.folderId = action.payload;
    },
    setChat(state, action: PayloadAction<SearchResultResponseItem[]>) {
      state.chat = action.payload;
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
  setIsMobileChatOpen,
  setChat,
  setIsMobileDailyJournalOpen,
} = clientSlice.actions;
export const clientReducer = clientSlice.reducer;
