import { FormState } from "entities/store/clientOnboardingSlice";
import { OnboardClient } from "entities/user";

export const mapOnboardClientToFormState = (
  response: OnboardClient
): FormState => {
  const profile = response?.profile ?? {};
  const basic_info = profile.basic_info ?? {};
  const goals_values = profile.goals_values ?? {};
  const lifestyle = profile.lifestyle ?? {};
  const health = profile.health ?? {};

  const toArray = (v: unknown) =>
    Array.isArray(v) ? (v as string[]) : v == null ? [] : [String(v)];

  const toRecord = (v: unknown) => {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      return v as Record<string, number>;
    }
    return {};
  };

  return {
    date_of_birth: basic_info.date_of_birth
      ? String(basic_info.date_of_birth).slice(0, 10)
      : undefined,

    menopause_status: basic_info.menopause_status ?? undefined,

    health_conditions: toArray(health.conditions),

    stress_levels: lifestyle.stress_levels ?? undefined,

    weekly_meal_choice: lifestyle.weekly_meal_choice ?? undefined,

    support_network: toArray(goals_values.support_network),

    physical_activity: lifestyle.physical_activity ?? undefined,

    sleep_quality: lifestyle.sleep_quality ?? undefined,

    hydration_levels: lifestyle.hydration_levels ?? undefined,

    main_transition_goal: goals_values.main_goal ?? undefined,

    symptoms_severity: toRecord(health.symptoms_severity),
  };
};
