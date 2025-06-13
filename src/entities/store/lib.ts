import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../user";
import coachOnboardingReducer from "./coachOnboardingSlice";
import { clientOnboardingReducer } from "./clientOnboardingSlice";
import { clientMoodReducer } from "./clientMoodSlice";
import { clientGlucoseReducer } from "./clientGlucoseSlice";
import { folderReducer } from "entities/folder";

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
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
