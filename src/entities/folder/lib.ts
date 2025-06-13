import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFolder, IFolderMap } from "./model";

export interface IFolderState {
  folders: IFolder[];
  foldersMap: IFolderMap;
  loading: boolean;
  error: string | null;
}

const initialState: IFolderState = {
  folders: [],
  foldersMap: {},
  loading: false,
  error: null,
};

const folderSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    setFolders(
      state,
      action: PayloadAction<{
        folders: IFolder[];
        foldersMap?: IFolderMap;
      }>
    ) {
      state.folders = action.payload.folders;
      state.foldersMap = action.payload.foldersMap || {};

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

export const { setFolders, setLoading, setError, clearError } =
  folderSlice.actions;
export const folderReducer = folderSlice.reducer;
