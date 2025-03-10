import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addFolder: {
    folderId: "22426b86-8e6f-414a-ab2f-5e5fb579482b",
    add: false,
  },
  contentId: null,
  detailResponse: false,
  folderName: null
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setAddFolderData: (state, action) => {
      state.addFolder = { ...action.payload };
    },
    setContentId: (state, action) => {
      state.contentId = action.payload;
    },
    setDetailResponse: (state, action) => {
      state.detailResponse = action.payload;
    },
    setFolderName:(state, action) => {
      state.folderName = action.payload;
    }

  },
});

export const { setAddFolderData, setContentId, setDetailResponse,setFolderName } = sidebarSlice.actions;
export default sidebarSlice.reducer;
