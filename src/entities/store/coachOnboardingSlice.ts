import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CoachOnboardingState {
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  display_credentials: string;
  location: string;
  timezone: string;
  expertise_areas: string[];
  years_experience: string;
  certifications: string[];
  personal_story: string;
  content_specialties: string[];
  practitioner_types: string[];
  primary_niches: string[];
  school: string;
  recent_client_count: string;
  target_client_count: string;
  uses_labs_supplements: string;
  business_challenges: string[];
  uses_ai: string;
  practice_management_software: string;
  supplement_dispensing_method: string;
  biometrics_monitoring_method: string;
  lab_ordering_method: string;
  supplement_ordering_method: string;
  profile_picture: File | null;
  coach_admin_privacy_accepted: boolean;
  independent_contractor_accepted: boolean;
  content_licensing_accepted: boolean;
  affiliate_terms_accepted: boolean;
  confidentiality_accepted: boolean;
  terms_of_use_accepted: boolean;
  media_release_accepted: boolean;
  two_factor_enabled: boolean;
  two_factor_method: string;
  security_questions: string;
  security_answers: string;
  certificate_file: File | null;
}

const initialState: CoachOnboardingState = {
  first_name: "qwe",
  last_name: "qee",
  age: 42,
  gender: "male",
  display_credentials: "qwe",
  location: "qwe",
  timezone: "qwe",
  expertise_areas: ["qwe"],
  years_experience: "qwe",
  certifications: ["qwe"],
  personal_story: "qwe",
  content_specialties: ["qwe"],
  practitioner_types: ["qwe"],
  primary_niches: ["qwe"],
  school: "qwe",
  recent_client_count: "qwe",
  target_client_count: "qwe",
  uses_labs_supplements: "qwe",
  business_challenges: ["qwe"],
  uses_ai: "qwe",
  practice_management_software: "qwe",
  supplement_dispensing_method: "qwe",
  biometrics_monitoring_method: "qwe",
  lab_ordering_method: "qwe",
  supplement_ordering_method: "qwe",
  coach_admin_privacy_accepted: false,
  independent_contractor_accepted: false,
  content_licensing_accepted: false,
  affiliate_terms_accepted: false,
  confidentiality_accepted: false,
  terms_of_use_accepted: false,
  media_release_accepted: false,
  two_factor_enabled: false,
  two_factor_method: "qwe",
  security_questions: "qwe",
  security_answers: "qwe",
  certificate_file: null,
  profile_picture: null,
};

const coachOnboardingSlice = createSlice({
  name: "coachOnboarding",
  initialState,
  reducers: {
    setCoachOnboardingData(state, action: PayloadAction<CoachOnboardingState>) {
      return action.payload;
    },
    updateCoachField<K extends keyof CoachOnboardingState>(
      state: CoachOnboardingState,
      action: PayloadAction<{ key: K; value: CoachOnboardingState[K] }>
    ): void {
      state[action.payload.key] = action.payload.value;
    },
    resetCoachOnboardingData() {
      return initialState;
    },
  },
});

export const {
  setCoachOnboardingData,
  updateCoachField,
  resetCoachOnboardingData,
} = coachOnboardingSlice.actions;

export default coachOnboardingSlice.reducer;