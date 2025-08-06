import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MoodLabel } from "widgets/MoodScore";

export interface MoodState {
  lastLogIn: string;
  lastMood: MoodLabel;
}

const initialState = {
  lastLogIn: "",
  lastMood: "Neutral",
};

const clientMoodSlice = createSlice({
  name: "clientMood",
  initialState,
  reducers: {
    setLastLogIn: (state, action: PayloadAction<string>) => {
      state.lastLogIn = action.payload;
    },
    setLastMood: (state, action: PayloadAction<MoodLabel>) => {
      state.lastMood = action.payload;
    },
  },
});

export const { setLastLogIn, setLastMood } = clientMoodSlice.actions;
export const clientMoodReducer = clientMoodSlice.reducer;
