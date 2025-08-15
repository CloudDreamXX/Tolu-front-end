import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatItemModel } from "./model";

export interface IChatState {
  chats: ChatItemModel[];
  loading: boolean;
}

const initialState: IChatState = {
  chats: [],
  loading: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatList(state, action: PayloadAction<IChatState["chats"]>) {
      state.chats = action.payload;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setChatList, setLoading } = chatSlice.actions;

export default chatSlice.reducer;
