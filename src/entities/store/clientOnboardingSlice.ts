import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OnboardClient } from "entities/user";
import { mapOnboardClientToFormState } from "./helpers";

export interface FormState {
  date_of_birth: string;
  gender: string;
  age: number;
  menopauseStatus: string;
  country: string;
  ZIP: string;
  language: string[];
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
  ai_experience: string;
}

const initialState: FormState = {
  date_of_birth: "",
  gender: "",
  age: 0,
  menopauseStatus: "",
  country: "",
  ZIP: "",
  language: [],
  race: "",
  household: "",
  education: "",
  occupation: "",
  whatBringsYouHere: "",
  values: [],
  barriers: "",
  support: [],
  personalityType: "",
  readiness: "",
  ai_experience: "",
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
    setFromUserInfo: (_state, action: PayloadAction<OnboardClient>) => {
      return mapOnboardClientToFormState(action.payload);
    },
  },
});

export const { setFormField, setFromUserInfo } = clientOnboardingSlice.actions;
export const clientOnboardingReducer = clientOnboardingSlice.reducer;
