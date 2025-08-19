import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ChatMessageModel } from ".";
import { RootState } from "entities/store";

const messagesAdapter = createEntityAdapter<ChatMessageModel>();

const initial = messagesAdapter.getInitialState;

const messagesSlice = createSlice({
  name: "messages",
  initialState: initial,
  reducers: {
    upsertMany(state, action: PayloadAction<ChatMessageModel[]>) {
      messagesAdapter.upsertMany(state, action.payload);
    },
    upsertOne(state, action: PayloadAction<ChatMessageModel>) {
      const msg = action.payload;
      messagesAdapter.upsertOne(state, msg);

      const currentIds = [...state.ids];
      currentIds.unshift(msg.id);
      state.ids = currentIds;
    },
    replaceTempId(
      state,
      action: PayloadAction<ChatMessageModel & { tempId: string }>
    ) {
      const temp = Object.values(state.entities).find(
        (x) => x?.id === action.payload.tempId
      );
      if (!temp) return;
      messagesAdapter.removeOne(state, temp.id);
      messagesAdapter.upsertOne(state, action.payload);

      const currentIds = [...state.ids];
      currentIds.unshift(action.payload.id);
      state.ids = currentIds;
    },
  },
});

export const messagesSelectors = messagesAdapter.getSelectors(
  (state: RootState) => state.messages
);

export const {
  upsertMany: upsertMessages,
  upsertOne: upsertMessage,
  replaceTempId,
} = messagesSlice.actions;

export default messagesSlice.reducer;
