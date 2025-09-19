import { FormState } from "entities/store/clientOnboardingSlice";
import { OnboardClient } from "entities/user";

export const mapOnboardClientToFormState = (
  response: OnboardClient
): FormState => {
  const profile = response?.profile ?? {};
  const basic_info = profile.basic_info ?? {};
  const goals_values = profile.goals_values ?? {};
  const background = profile.background ?? {};
  const preferences = profile.preferences ?? {};

  const toArray = (v: unknown) =>
    Array.isArray(v) ? (v as string[]) : v == null ? [] : [String(v)];

  return {
    age: basic_info.age ?? undefined,
    menopause_status: basic_info.menopause_status ?? undefined,
    country: basic_info.country ?? undefined,
    zip_code: undefined,
    language: toArray(basic_info.language),
    race_ethnicity: undefined,
    gender: basic_info.gender ?? undefined,
    date_of_birth: basic_info.date_of_birth
      ? String(basic_info.date_of_birth).slice(0, 10)
      : undefined,
    ai_experience: basic_info.ai_experience ?? undefined,

    household_type: undefined,
    occupation: background.occupation ?? undefined,
    education_level: undefined,

    main_transition_goal: goals_values.main_goal ?? undefined,
    important_values: toArray(goals_values.important_values),
    obstacles: goals_values.obstacles ?? undefined,
    support_network: toArray(goals_values.support_network),

    personality_type: preferences.personality_type ?? undefined,
    readiness_for_change: preferences.readiness_for_change ?? undefined,
  };
};
