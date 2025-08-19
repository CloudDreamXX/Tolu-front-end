import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { RootState } from "entities/store";
import { ChatItemModel } from "./model";

const chatsAdapter = createEntityAdapter<ChatItemModel>();

const chatsSlice = createSlice({
  name: "chats",
  initialState: chatsAdapter.getInitialState(),
  reducers: {
    setAll: chatsAdapter.setAll,
    upsertOne: chatsAdapter.upsertOne,
    upsertMany: chatsAdapter.upsertMany,
  },
});

export const chatsSelectors = chatsAdapter.getSelectors(
  (state: RootState) => state.chats
);

export const {
  upsertMany: upsertChats,
  upsertOne: upsertChat,
  setAll: setChats,
} = chatsSlice.actions;
export default chatsSlice.reducer;
