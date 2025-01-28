// store.js
import { configureStore } from '@reduxjs/toolkit';
// import sidebarReducer from './sidebarSlice';
import sidebarReducer from '../slice/sidebarSlice';

const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
  },
});

export default store;
