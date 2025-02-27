import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  folderColors: [] // start with an empty array so folders are added dynamically
};

const folderColorSlice = createSlice({
  name: "folderColor",
  initialState,
  reducers: {
    // This action either updates a folder's colors if it exists,
    // or adds a new folder with default or provided colors if it doesn't.
    setFolderColor: (state, action) => {
      const { folderId, iconColor, bgColor } = action.payload;
      const folder = state.folderColors.find((f) => f.folderId === folderId);
      if (folder) {
        // Update the existing folder's colors
        folder.iconColor = iconColor;
        folder.bgColor = bgColor;
      } else {
        // Add a new folder with the given folderId and colors
        state.folderColors.push({ folderId, iconColor, bgColor });
      }
    },
  },
});

export const { setFolderColor } = folderColorSlice.actions;
export default folderColorSlice.reducer;
