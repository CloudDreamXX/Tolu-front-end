import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { chatApi } from "entities/chat/chatApi";
import chatReducer from "entities/chat/chatsSlice";
import downloadsReducer from "entities/chat/downloadSlice";
import messagesReducer from "entities/chat/messagesSlice";
import { clientReducer } from "entities/client/lib";
import { filesLibraryApi } from "entities/files-library/filesLibraryApi";
import { folderReducer } from "entities/folder";
import { healthHistoryReducer } from "entities/health-history/lib";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "../user";
import { clientGlucoseReducer } from "./clientGlucoseSlice";
import { clientMoodReducer } from "./clientMoodSlice";
import { clientOnboardingReducer } from "./clientOnboardingSlice";
import coachOnboardingReducer from "./coachOnboardingSlice";
import { adminApi } from "entities/admin";
import { contentApi } from "entities/content";
import { documentsApi } from "entities/document";

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
  [filesLibraryApi.reducerPath]: filesLibraryApi.reducer,
  downloads: downloadsReducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [contentApi.reducerPath]: contentApi.reducer,
  [documentsApi.reducerPath]: documentsApi.reducer,
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
    })
      .concat(adminApi.middleware)
      .concat(contentApi.middleware)
      .concat(documentsApi.middleware)
      .concat(chatApi.middleware)
      .concat(filesLibraryApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
