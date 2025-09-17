import { FormState } from "entities/store/clientOnboardingSlice";
import { OnboardClient } from "entities/user";

export const mapOnboardClientToFormState = (
  response: OnboardClient
): FormState => {
  const { basic_info, goals_values, background, preferences } =
    response.profile;

  return {
    age: basic_info?.age ?? undefined,
    menopause_status: basic_info?.menopause_status ?? undefined,
    country: basic_info?.country ?? undefined,
    zip_code: undefined,
    language: basic_info?.language ?? [],
    race_ethnicity: undefined,
    gender: basic_info?.gender ?? undefined,
    date_of_birth: basic_info?.date_of_birth ?? undefined,
    ai_experience: basic_info?.ai_experience ?? undefined,

    household_type: undefined,
    occupation: background?.occupation ?? undefined,
    education_level: undefined,

    main_transition_goal: goals_values?.main_goal ?? undefined,
    important_values: goals_values?.important_values ?? [],
    obstacles: goals_values?.obstacles ?? undefined,
    support_network: goals_values?.support_network ?? [],

    personality_type: preferences?.personality_type ?? undefined,
    readiness_for_change: preferences?.readiness_for_change ?? undefined,
  };
};
