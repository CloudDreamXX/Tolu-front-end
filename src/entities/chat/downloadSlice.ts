import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const downloadsSlice = createSlice({
  name: "downloads",
  initialState: { byKey: {} as Record<string, number> },
  reducers: {
    setDownloadProgress: (
      s,
      a: PayloadAction<{ key: string; pct: number }>
    ) => {
      s.byKey[a.payload.key] = a.payload.pct;
    },
    clearDownloadProgress: (s, a: PayloadAction<string>) => {
      delete s.byKey[a.payload];
    },
  },
});
export const { setDownloadProgress, clearDownloadProgress } =
  downloadsSlice.actions;

export default downloadsSlice.reducer;
