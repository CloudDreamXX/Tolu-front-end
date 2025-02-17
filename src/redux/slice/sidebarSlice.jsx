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
    folderId: null,
    add: false,
  },
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setAddFolderData: (state, action) => {
      state.addFolder = { ...action.payload };
    },
  },
});

export const { setAddFolderData } = sidebarSlice.actions;  // Export setAddFolderData here
export default sidebarSlice.reducer;
