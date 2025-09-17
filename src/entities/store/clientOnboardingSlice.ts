import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OnboardClient } from "entities/user";
import { mapOnboardClientToFormState } from "./helpers";

export interface FormState {
  age?: number;
  menopause_status?: string;
  country?: string;
  zip_code?: string;
  language?: string[];
  race_ethnicity?: string;
  gender?: string;
  date_of_birth?: string | Date;
  ai_experience?: string;

  household_type?: string;
  occupation?: string;
  education_level?: string;

  main_transition_goal?: string;
  important_values?: string[];
  obstacles?: string;
  support_network?: string[];

  personality_type?: string;
  readiness_for_change?: string;
}

const initialState: FormState = {};

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
