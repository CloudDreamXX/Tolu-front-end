// store.js
import { configureStore } from '@reduxjs/toolkit';
// import sidebarReducer from './sidebarSlice';
import sidebarReducer from './slice/sidebarSlice';
import { apiSlice } from './slice/apiSlice';
import authReducer from './slice/authSlice';
import chatSlice from './slice/chatSlice';
import folderColorReducer from '../store/slice/folderColorSlice';
import adminDataReducer from './slice/adminDataSlice';

// import chatReducer from '../slice/chatSlice';

const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    auth: authReducer,
    // chat:chatReducer,
    chat: chatSlice.reducer,
    folderColor: folderColorReducer,
    // aiLearningSearch:aiLearningSearchReducer,
    adminData: adminDataReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
