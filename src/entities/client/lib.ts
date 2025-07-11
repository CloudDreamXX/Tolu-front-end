import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Folder } from "./model";

export interface IClientState {
  isMobileChatOpen: boolean;
  folderId: string;
  folders: Folder[];
  loading: boolean;
  error: string | null;
}

const initialState: IClientState = {
  isMobileChatOpen: false,
  folderId: "",
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
    setFolderId(state, action: PayloadAction<string>) {
      state.folderId = action.payload;
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
} = clientSlice.actions;
export const clientReducer = clientSlice.reducer;
