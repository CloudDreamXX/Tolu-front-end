import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { chatApi } from "entities/chat/api";
import chatReducer from "entities/chat/chatsSlice";
import downloadsReducer from "entities/chat/downloadSlice";
import messagesReducer from "entities/chat/messagesSlice";
import { clientReducer } from "entities/client/lib";
import { filesLibraryApi } from "entities/files-library/api";
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
import { symptomsTrackerApi } from "entities/symptoms-tracker";
import { healthHistoryApi } from "entities/health-history";
import { notificationsApi } from "entities/notifications";
import { clientApi } from "entities/client";
import { coachApi } from "entities/coach";

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
  clientMood: persistReducer(clientMoodPersistConfig, clientMoodReducer),
  coachOnboarding: coachOnboardingReducer,
  clientOnboarding: clientOnboardingReducer,
  clientGlucose: clientGlucoseReducer,
  folder: folderReducer,
  healthHistory: healthHistoryReducer,
  client: clientReducer,
  chats: chatReducer,
  messages: messagesReducer,
  downloads: downloadsReducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [filesLibraryApi.reducerPath]: filesLibraryApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
  [contentApi.reducerPath]: contentApi.reducer,
  [documentsApi.reducerPath]: documentsApi.reducer,
  [symptomsTrackerApi.reducerPath]: symptomsTrackerApi.reducer,
  [healthHistoryApi.reducerPath]: healthHistoryApi.reducer,
  [notificationsApi.reducerPath]: notificationsApi.reducer,
  [clientApi.reducerPath]: clientApi.reducer,
  [coachApi.reducerPath]: coachApi.reducer,
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
      .concat(filesLibraryApi.middleware)
      .concat(symptomsTrackerApi.middleware)
      .concat(healthHistoryApi.middleware)
      .concat(notificationsApi.middleware)
      .concat(clientApi.middleware)
      .concat(coachApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
