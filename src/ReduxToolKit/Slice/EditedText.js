import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "",
};

export const Editable_Text = createSlice({
  name: "editable_text",
  initialState,
  reducers: {
    edit_text: (state , action) => {
      state.value = action.payload;
      console.log(" model :  ",state.value);

    },
  },
});

export const { edit_text } = Editable_Text.actions;

export default Editable_Text.reducer;