import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "entities/store";
import { ChatItemModel, ChatMessageModel } from "./model";

const chatsAdapter = createEntityAdapter<ChatItemModel>();

const chatsSlice = createSlice({
  name: "chats",
  initialState: chatsAdapter.getInitialState(),
  reducers: {
    setAll: chatsAdapter.setAll,
    upsertOne: chatsAdapter.upsertOne,
    upsertMany: chatsAdapter.upsertMany,
    updateOne: chatsAdapter.updateOne,
    applyIncomingMessage: (
      state,
      action: PayloadAction<{ msg: ChatMessageModel; activeChatId?: string }>
    ) => {
      const { msg, activeChatId } = action.payload;
      const chat = state.entities[msg.chat_id];

      if (!chat) return;
      if (chat.lastMessage?.id === msg.id) return;

      const isActive = activeChatId === msg.chat_id;

      chat.lastMessage = msg;
      chat.lastMessageAt = msg.created_at;
      chat.unreadCount = isActive ? 0 : (chat.unreadCount ?? 0) + 1;
    },
  },
});

export const chatsSelectors = chatsAdapter.getSelectors(
  (state: RootState) => state.chats
);

export const {
  upsertMany: upsertChats,
  upsertOne: upsertChat,
  setAll: setChats,
  updateOne: updateChat,
  applyIncomingMessage,
} = chatsSlice.actions;
export default chatsSlice.reducer;
