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
    folderId: "d0dae127-e89e-4923-8bbd-d9c6416228e9",
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
