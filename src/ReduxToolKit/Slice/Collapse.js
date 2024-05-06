import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: true,
};

export const CollapseSlice = createSlice({
  name: "collapse",
  initialState,
  reducers: {
   COLLAPSE: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { COLLAPSE } = CollapseSlice.actions;

export default CollapseSlice.reducer;
