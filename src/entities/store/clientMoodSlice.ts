import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type lastMood =
  | "Angry"
  | "Sad"
  | "Neutral"
  | "Stable"
  | "Happy"
  | "Excellent";

export interface MoodState {
  lastLogIn: string;
  lastMood: lastMood;
}

const initialState = {
  lastLogIn: "",
  lastMood: "",
};

const clientMoodSlice = createSlice({
  name: "clientMood",
  initialState,
  reducers: {
    setLastLogIn: (state, action: PayloadAction<string>) => {
      state.lastLogIn = action.payload;
    },
    setLastMood: (state, action: PayloadAction<lastMood>) => {
      state.lastMood = action.payload;
    },
  },
});

export const { setLastLogIn, setLastMood } = clientMoodSlice.actions;
export const clientMoodReducer = clientMoodSlice.reducer;
