import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FormState {
  age: number;
  menopauseStatus: string;
  country: string;
  ZIP: string;
  language: string;
  race: string;
  household: string;
  education: string;
  occupation: string;
  whatBringsYouHere: string;
  values: string[];
  barriers: string;
  support: string[];
  personalityType: string;
  readiness: string;
}

const initialState: FormState = {
  age: 0,
  menopauseStatus: "-",
  country: "-",
  ZIP: "-",
  language: "-",
  race: "-",
  household: "-",
  education: "-",
  occupation: "-",
  whatBringsYouHere: "-",
  values: [],
  barriers: "-",
  support: [],
  personalityType: "-",
  readiness: "-",
};

const clientOnboardingSlice = createSlice({
  initialState,
  name: "clientOnboarding",
  reducers: {
    setFormField: <K extends keyof FormState>(
      state: FormState,
      action: PayloadAction<{ field: K; value: FormState[K] }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
  },
});

export const { setFormField } = clientOnboardingSlice.actions;
export const clientOnboardingReducer = clientOnboardingSlice.reducer;
