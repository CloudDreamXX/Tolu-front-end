import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  newChat: false, // Initial state
  chatHistory:""
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setNewChat: (state, action) => {
      state.newChat = action.payload;
    },
    chatHistory:(state,actions) => {
        state.chatHistory = actions.payload
    }
  },
});

export const { setNewChat } = chatSlice.actions;
export default chatSlice;
