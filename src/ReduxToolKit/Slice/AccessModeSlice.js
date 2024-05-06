import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "abc",
};

export const AccessModeSlice = createSlice({
  name: "accessmode",
  initialState,
  reducers: {
    ACCESS_MODE: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { ACCESS_MODE } = AccessModeSlice.actions;

export default AccessModeSlice.reducer;
