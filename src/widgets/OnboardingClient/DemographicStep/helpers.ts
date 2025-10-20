import type { FormState } from "entities/store/clientOnboardingSlice";

const isBlank = (v: unknown) =>
  v == null ||
  (typeof v === "string" && v.trim() === "") ||
  (Array.isArray(v) &&
    v.filter((x) => x != null && String(x).trim() !== "").length === 0);

const LABEL_CLIENT: Partial<Record<keyof FormState, string>> = {
  date_of_birth: "Birth date",
  menopause_status: "Stage in menopause transition",
  health_conditions: "Health conditions",
  stress_levels: "Stress levels",
  weekly_meal_choice: "Weekly meal choice",
  support_network: "Support network",
  physical_activity: "Physical activity",
  sleep_quality: "Sleep quality",
  hydration_levels: "Hydration level",
  main_transition_goal: "Main transition goal",
};

const REQUIRED_DEMOGRAPHIC_FIELDS: (keyof FormState)[] = [
  "date_of_birth",
  "menopause_status",
  "health_conditions",
  "stress_levels",
  "weekly_meal_choice",
  "support_network",
  "physical_activity",
  "sleep_quality",
  "hydration_levels",
  "main_transition_goal",
];

export function findIncompleteClientField(state: FormState) {
  const missing: string[] = [];

  for (const key of REQUIRED_DEMOGRAPHIC_FIELDS) {
    const val = state[key];

    if (isBlank(val)) {
      missing.push(LABEL_CLIENT[key] || key);
    }
  }

  if (missing.length > 0) {
    return missing;
  }

  return null;
}
