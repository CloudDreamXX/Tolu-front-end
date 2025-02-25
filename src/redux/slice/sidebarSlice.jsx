// // sidebarSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   addFolder: {
//     folderId: null,
//     add: false
//   },
// };

// const sidebarSlice = createSlice({
//   name: 'sidebar',
//   initialState,
//   reducers: {
//     setAddFolderData: (state, action) => {
//       state.addFolder = { ...action.payload };
//     },
//   },
// });

// export const { setAddFolderData } = sidebarSlice.actions;
// export default sidebarSlice.reducer;
// sidebarSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addFolder: {
    folderId: "80cd48f4-aeab-477f-a3a4-0d2f12cbdb70",
    add: false,
  },
  contentId: null,
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
    }
  },
});

export const { setAddFolderData , setContentId} = sidebarSlice.actions;  // Export setAddFolderData here
export default sidebarSlice.reducer;
