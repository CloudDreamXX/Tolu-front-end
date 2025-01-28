// sidebarSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setSidebarData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setSidebarData } = sidebarSlice.actions;
export default sidebarSlice.reducer;
