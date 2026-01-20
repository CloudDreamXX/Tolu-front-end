import { z } from "zod";
import { HealthHistory, HealthHistoryPostData } from "entities/health-history";
import { baseFormSchema } from "./ui";

type FormValues = z.infer<typeof baseFormSchema>;

export const mapHealthHistoryToFormDefaults = (
  healthHistory?: HealthHistory
): Partial<FormValues> => {
  if (!healthHistory) return {};

  return {
    age: healthHistory.age?.toString() || "",
    gender: healthHistory.gender || "",
    genderIdentity: healthHistory.gender_identity || "woman",
    sexAssignedAtBirth: healthHistory.gender || "female",
    race: healthHistory.ethnicity || "",
    language: healthHistory.language || "",
    country: healthHistory.location || "",
    occupation: healthHistory.job || "",
    ethnicity: healthHistory.ethnicity || "",
    household: healthHistory.household || "",
    education: healthHistory.education || "",
    religion: healthHistory.religion || "",

    healthConcerns: healthHistory.current_health_concerns || "",
    medicalConditions: healthHistory.diagnosed_conditions || "None",
    medications: healthHistory.medications || "None",
    otherMedications: healthHistory.medications || "",
    supplements: healthHistory.supplements || "None",
    allergies: healthHistory.allergies_intolerances || "None",
    familyHistory: healthHistory.family_health_history || "None",

    dietType: healthHistory.diet_pattern || "",
    dietDetails: healthHistory.specific_diet || "",
    cookFrequency: healthHistory.cook_at_home || "",
    takeoutFrequency: healthHistory.takeout_food || "",
    decisionMaker: healthHistory.eat_decision || "",
    commonFoods: healthHistory.kind_of_food || "",

    exerciseHabits: healthHistory.exercise_habits || "light",
    otherExerciseHabits: healthHistory.exercise_habits || "light",

    sleepQuality: parseInt(healthHistory.sleep_quality || "1", 10),
    stressLevels: parseInt(healthHistory.stress_levels || "1", 10),
    energyLevels: parseInt(healthHistory.energy_levels || "2", 10),

    menstrualCycleStatus: healthHistory.menstrual_cycle_status || "",
    menstrualOther: healthHistory.menstrual_cycle_status || "",
    hormoneTherapy: healthHistory.hormone_replacement_therapy || "",
    hormoneDetails: "",
    hormoneDuration: "",
    hormoneProvider: "",
    fertilityConcerns: healthHistory.fertility_concerns || "not_applicable",
    birthControlUse: healthHistory.birth_control_use || "not_applicable",
    birthControlDetails: "",

    bloodSugarConcern: healthHistory.blood_sugar_concerns || "",
    bloodSugarOther: healthHistory.blood_sugar_concerns || "",
    digestiveIssues: healthHistory.digestive_issues || "",
    digestiveOther: healthHistory.digestive_issues || "",

    recentLabTests: healthHistory.recent_lab_tests ? "Yes" : "No",
    labTestFiles: healthHistory.lab_results_file,

    goals: healthHistory.health_goals || "",
    goalReason: healthHistory.why_these_goals || "",
    urgency: healthHistory.desired_results_timeline || "",
    healthApproach: healthHistory.health_approach_preference || "",

    agreeToPrivacy: healthHistory.privacy_consent || false,
    followUpRecommendation: healthHistory.follow_up_recommendation || "",
    countryCode: "",
    phoneNumber: "",
  };
};

export const prune = (obj: Record<string, any>): Record<string, any> => {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) continue;
    if (typeof v === "string") {
      const s = v.trim();
      if (s === "") continue;
      out[k] = s;
      continue;
    }
    if (Array.isArray(v)) {
      if (v.length === 0) continue;
      out[k] = v;
      continue;
    }
    if (typeof v === "object") {
      const nested = prune(v);
      if (Object.keys(nested).length === 0) continue;
      out[k] = nested;
      continue;
    }
    out[k] = v;
  }
  return out;
};

export const mapFormValuesToHealthHistoryPayload = (
  values: Partial<FormValues>
): Partial<HealthHistoryPostData> => {
  return prune({
    age:
      values.age !== undefined && values.age !== ""
        ? Number(values.age)
        : undefined,

    gender_identity: values.genderIdentity,
    gender: values.sexAssignedAtBirth,
    ethnicity: values.ethnicity,
    language: values.language,
    location: values.country,
    job: values.occupation,
    household: values.household,
    education: values.education,
    religion: values.religion,

    current_health_concerns: values.healthConcerns,
    diagnosed_conditions: values.medicalConditions,
    medications: values.medications,
    supplements: values.supplements,
    allergies_intolerances: values.allergies,
    family_health_history: values.familyHistory,

    diet_pattern: values.dietType,
    specific_diet: values.dietDetails,
    cook_at_home: values.cookFrequency,
    takeout_food: values.takeoutFrequency,
    eat_decision: values.decisionMaker,
    kind_of_food: values.commonFoods,

    exercise_habits: values.exerciseHabits,
    sleep_quality:
      values.sleepQuality !== undefined
        ? String(values.sleepQuality)
        : undefined,
    stress_levels:
      values.stressLevels !== undefined
        ? String(values.stressLevels)
        : undefined,
    energy_levels:
      values.energyLevels !== undefined
        ? String(values.energyLevels)
        : undefined,

    menstrual_cycle_status: values.menstrualCycleStatus,
    hormone_replacement_therapy: values.hormoneTherapy,
    fertility_concerns: values.fertilityConcerns,
    birth_control_use: values.birthControlUse,

    blood_sugar_concerns: values.bloodSugarConcern,
    digestive_issues: values.digestiveIssues,

    health_goals: values.goals,
    why_these_goals: values.goalReason,
    desired_results_timeline: values.urgency,
    health_approach_preference: values.healthApproach,

    follow_up_recommendation: values.followUpRecommendation,
    privacy_consent: values.agreeToPrivacy,
  });
};