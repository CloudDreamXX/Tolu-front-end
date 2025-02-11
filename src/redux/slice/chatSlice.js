import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  newChat: false, // Initial state
  chatHistory: "",
  selectedChatId: "",// Selected chat ID for chat history
  refetchHistory: false
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setNewChat: (state, action) => {
      state.newChat = action.payload;
    },
    chatHistory: (state, actions) => {
      state.chatHistory = actions.payload
    },
    setSelectedChatId: (state, action) => {
      state.selectedChatId = action.payload;
    },
    setRefetchHistory: (state, action) => {
      state.refetchHistory = action.payload;
    }
  },
});

export const { setNewChat, setSelectedChatId, setRefetchHistory } = chatSlice.actions;
export default chatSlice;
