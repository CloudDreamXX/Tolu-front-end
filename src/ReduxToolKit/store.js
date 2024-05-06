import { configureStore } from "@reduxjs/toolkit";
import CounterSlice from "./Slice/CounterSlice";
import AccessModeSlice from "./Slice/AccessModeSlice";
import Collapse from './Slice/Collapse'

const store = configureStore({
  reducer: {
    counter: CounterSlice,
    accessmode: AccessModeSlice,
    collapse: Collapse
  },
});
export default store;
