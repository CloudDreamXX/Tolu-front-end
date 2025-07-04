import { z } from "zod";
import { HealthHistory } from "entities/health-history";
import { baseFormSchema } from "./ui";

type FormValues = z.infer<typeof baseFormSchema>;

export const mapHealthHistoryToFormDefaults = (
  healthHistory?: HealthHistory
): Partial<FormValues> => {
  if (!healthHistory) return {};

  return {
    age: healthHistory.age?.toString() || "",
    gender: healthHistory.gender || "female",
    height: healthHistory.height || "",
    weight: healthHistory.weight || "",

    healthConcerns: healthHistory.current_health_concerns || "",
    medicalConditions: healthHistory.diagnosed_conditions || "None",
    medications: healthHistory.medications || "None",
    otherMedications: healthHistory.medications || "",
    supplements: healthHistory.supplements || "None",
    allergies: healthHistory.allergies_intolerances || "None",
    familyHistory: healthHistory.family_health_history || "None",

    diet: "None",
    dietType: healthHistory.diet_pattern || "",
    dietDetails: healthHistory.specific_diet || "",
    cookFrequency: healthHistory.cook_at_home || "",
    takeoutFrequency: healthHistory.takeout_food || "",
    decisionMaker: healthHistory.eat_decision || "",

    exerciseHabits: healthHistory.exercise_habits || "light",
    otherExerciseHabits: "",

    sleepQuality: parseInt(healthHistory.sleep_quality || "1", 10),
    stressLevels: parseInt(healthHistory.stress_levels || "1", 10),
    energyLevels: parseInt(healthHistory.energy_levels || "2", 10),

    menstrualCycleStatus: healthHistory.menstrual_cycle_status || "",
    menstrualOther: "",
    hormoneTherapy: healthHistory.hormone_replacement_therapy || "",
    hormoneDetails: "",
    hormoneDuration: "",
    hormoneProvider: "",
    fertilityConcerns: healthHistory.fertility_concerns || "not_applicable",
    birthControlUse: healthHistory.birth_control_use || "not_applicable",
    birthControlDetails: "",

    bloodSugarConcern: healthHistory.blood_sugar_concerns || "",
    bloodSugarOther: "",
    digestiveIssues: healthHistory.digestive_issues || "",
    digestiveOther: "",

    recentLabTests: healthHistory.recent_lab_tests ? "Yes" : "No",
    labTestFile: undefined,

    goals: healthHistory.health_goals || "",
    goalReason: healthHistory.why_these_goals || "",
    urgency: healthHistory.desired_results_timeline || "",
    healthApproach: healthHistory.health_approach_preference || "",

    agreeToPrivacy: healthHistory.privacy_consent || false,
    followUpMethod: healthHistory.follow_up_recommendation || "",
    countryCode: "",
    phoneNumber: "",
  };
};
