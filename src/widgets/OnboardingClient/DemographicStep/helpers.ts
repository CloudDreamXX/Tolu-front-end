import type { FormState } from "entities/store/clientOnboardingSlice";

const isBlank = (v: unknown) =>
  v == null ||
  (typeof v === "string" && v.trim() === "") ||
  (Array.isArray(v) &&
    v.filter((x) => x != null && String(x).trim() !== "").length === 0);

const LABEL_CLIENT: Record<keyof FormState, string> = {
  age: "Age",
  menopause_status: "Cycle status",
  country: "Country",
  zip_code: "ZIP code",
  language: "Languages",
  race_ethnicity: "Race/Ethnicity",
  gender: "Gender",
  date_of_birth: "Date of birth",
  ai_experience: "AI experience",

  household_type: "Household type",
  occupation: "Occupation",
  education_level: "Education level",

  main_transition_goal: "Main goal",
  important_values: "Important values",
  obstacles: "Obstacles",
  support_network: "Support network",

  personality_type: "Personality type",
  readiness_for_change: "Readiness for change",
};

const REQUIRED_BY_ROUTE_CLIENT: Record<string, (keyof FormState)[]> = {
  "/about-you": [
    "date_of_birth",
    "menopause_status",
    "language",
    "ai_experience",
  ],
  "/what-brings-you-here": ["main_transition_goal"],
  "/values": ["important_values"],
  "/barriers": ["obstacles"],
  "/support": ["support_network"],
  "/personality-type": ["personality_type"],
  "/readiness": ["readiness_for_change"],
};

export function findFirstIncompleteClientStep(state: FormState) {
  for (const [route, fields] of Object.entries(REQUIRED_BY_ROUTE_CLIENT)) {
    const missing: string[] = [];

    for (const key of fields) {
      const val = state[key as keyof FormState];
      if (isBlank(val)) {
        if (key === "age") {
          const hasDOB = !isBlank(state.date_of_birth);
          const hasAgeNumber =
            typeof state.age === "number" && !Number.isNaN(state.age);
          if (hasDOB || hasAgeNumber) continue;
        }
        missing.push(LABEL_CLIENT[key as keyof FormState]);
      }
    }

    if (missing.length > 0) return { route, missing };
  }
  return null;
}
