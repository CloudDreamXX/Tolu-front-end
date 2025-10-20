import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ClientOnboardingResponse } from "entities/user";
import { mapOnboardClientToFormState } from "./helpers";

export interface FormState {
  date_of_birth?: string;
  menopause_status?: string;
  health_conditions?: string[];
  stress_levels?: string;
  weekly_meal_choice?: string[];
  support_network?: string[];
  physical_activity?: string;
  sleep_quality?: string;
  hydration_levels?: string;
  main_transition_goal?: string;
  symptoms_severity?: Record<string, number>;
}

const initialState: FormState = {
  date_of_birth: undefined,
  menopause_status: undefined,
  health_conditions: [],
  stress_levels: undefined,
  weekly_meal_choice: undefined,
  support_network: [],
  physical_activity: undefined,
  sleep_quality: undefined,
  hydration_levels: undefined,
  main_transition_goal: undefined,
  symptoms_severity: {},
};

const clientOnboardingSlice = createSlice({
  name: "clientOnboarding",
  initialState,
  reducers: {
    setFormField: <K extends keyof FormState>(
      state: FormState,
      action: PayloadAction<{ field: K; value: FormState[K] }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setFromUserInfo: (
      _state,
      action: PayloadAction<ClientOnboardingResponse>
    ) => {
      return mapOnboardClientToFormState(action.payload);
    },
  },
});

export const { setFormField, setFromUserInfo } = clientOnboardingSlice.actions;
export const clientOnboardingReducer = clientOnboardingSlice.reducer;
