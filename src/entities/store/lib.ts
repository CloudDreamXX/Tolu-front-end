import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { chatApi } from "entities/chat/chatApi";
import chatReducer from "entities/chat/chatsSlice";
import messagesReducer from "entities/chat/messagesSlice";
import { clientReducer } from "entities/client/lib";
import { folderReducer } from "entities/folder";
import { healthHistoryReducer } from "entities/health-history/lib";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "../user";
import { clientGlucoseReducer } from "./clientGlucoseSlice";
import { clientMoodReducer } from "./clientMoodSlice";
import { clientOnboardingReducer } from "./clientOnboardingSlice";
import coachOnboardingReducer from "./coachOnboardingSlice";
import downloadsReducer from "entities/chat/downloadSlice";

const userPersistConfig = {
  key: "user",
  storage,
};

const clientMoodPersistConfig = {
  key: "clientMood",
  storage,
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  coachOnboarding: coachOnboardingReducer,
  clientOnboarding: clientOnboardingReducer,
  clientMood: persistReducer(clientMoodPersistConfig, clientMoodReducer),
  clientGlucose: clientGlucoseReducer,
  folder: folderReducer,
  healthHistory: healthHistoryReducer,
  client: clientReducer,
  chats: chatReducer,
  messages: messagesReducer,
  [chatApi.reducerPath]: chatApi.reducer,
  downloads: downloadsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (gDM) =>
    gDM({
      serializableCheck: {
        ignoredActions: [
          "persist/FLUSH",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PERSIST",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }).concat(chatApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
