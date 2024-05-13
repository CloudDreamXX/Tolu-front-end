import { configureStore } from "@reduxjs/toolkit";
import CounterSlice from "./Slice/CounterSlice";
import AccessModeSlice from "./Slice/AccessModeSlice";
import Collapse from './Slice/Collapse'
import UserSlice from "./Slice/userSlice";

const store = configureStore({
  reducer: {
    user: UserSlice,
    counter: CounterSlice,
    accessmode: AccessModeSlice,
    collapse: Collapse
  },
});
export default store;
