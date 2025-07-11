import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HealthHistory } from "./model";

export interface IHealthHistoryState {
  data: HealthHistory | undefined;
  loading: boolean;
  error: string | null;
}

const initialState: IHealthHistoryState = {
  data: undefined,
  loading: false,
  error: null,
};

const healthHistorySlice = createSlice({
  name: "healthHistory",
  initialState,
  reducers: {
    setHealthHistory(state, action: PayloadAction<HealthHistory>) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { setHealthHistory, setLoading, setError, clearError } =
  healthHistorySlice.actions;

export const healthHistoryReducer = healthHistorySlice.reducer;
