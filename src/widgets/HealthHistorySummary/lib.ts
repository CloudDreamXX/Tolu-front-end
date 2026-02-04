import { HealthHistory } from "entities/health-history";
import {
  CANCER,
  CARDIOVASCULAR,
  FREQUENCY_ITEMS,
  GASTROINTESTINAL,
  GENITAL_URINARY,
  HORMONES_METABOLIC,
  IMMUNE_INFLAMMATORY,
  MISCELLANEOUS,
  MUSCULOSKELETAL,
  NEUROLOGIC_MOOD,
  RESPIRATORY,
  SKIN,
} from "widgets/health-profile-form/ui/medical-history-step/lib";

export const HEALTH_HISTORY_BLOCKS = {
  BASIC_INFO: "basic_info",
  BIRTH_BODY: "birth_body",
  HEALTH_CONCERNS: "health_concerns",
  BOWEL_HEALTH: "bowel_health",
  STRESSFUL_EVENTS: "stressful_events",
  MEDICAL_HISTORY: "medical_history",
  ORAL_HEALTH: "oral_health",
  LIFESTYLE_HISTORY: "lifestyle_history",
  SLEEP_HISTORY: "sleep_history",
  WOMENS_HEALTH: "womens_health",
  SEXUAL_HISTORY: "sexual_history",
  MENTAL_HEALTH: "mental_health",
  OTHER: "other",
};

type SummaryField<T> = {
  key: keyof T;
  label: string;
  format?: (value: any) => string;
};

type SummarySection<T> = {
  title: string;
  step: number;
  block: string;
  fields: SummaryField<T>[];
};

const toSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const formatMedicalHistoryField = (
  value: HealthHistory[keyof HealthHistory]
) => {
  if (!value) return "-";

  if (typeof value === "object" && "status" in value) {
    const statusText =
      value.status === "yes" ? "Yes" : value.status === "no" ? "No" : "-";
    const fromDate = (value as any).fromDate;
    const toDate = (value as any).toDate;

    if (fromDate || toDate) {
      return `${statusText}${fromDate ? ` from ${fromDate}` : ""}${toDate ? ` to ${toDate}` : ""}`;
    }

    return statusText;
  }

  return String(value);
};

export const HEALTH_HISTORY_SUMMARY: SummarySection<HealthHistory>[] = [
  {
    title: "Birth & Body",
    step: 0,
    block: HEALTH_HISTORY_BLOCKS.BIRTH_BODY,
    fields: [
      { key: "age", label: "Age" },
      { key: "birth_date", label: "Birth date" },
      { key: "gender_at_birth", label: "Gender at birth" },
      { key: "chosen_gender_after_birth", label: "Chosen gender" },
      { key: "breastfed_or_bottle", label: "Breastfed or bottle" },
      { key: "birth_delivery_method", label: "Birth delivery method" },
      { key: "birth_weight_lbs", label: "Birth weight (lbs)" },
      { key: "birth_order_siblings", label: "Birth order / siblings" },
      { key: "height", label: "Height" },
      { key: "blood_type", label: "Blood type" },
      { key: "current_weight_lbs", label: "Current weight (lbs)" },
      { key: "ideal_weight_lbs", label: "Ideal weight (lbs)" },
      { key: "weight_one_year_ago_lbs", label: "Weight 1 year ago (lbs)" },
      { key: "family_living_situation", label: "Family / living situation" },
      { key: "partner_gender_at_birth", label: "Partner’s gender at birth" },
      { key: "partner_chosen_gender", label: "Partner’s chosen gender" },
      { key: "children", label: "Children" },
      { key: "exercise_recreation", label: "Exercise / recreation" },
    ],
  },

  {
    title: "Stressful Events",
    step: 1,
    block: HEALTH_HISTORY_BLOCKS.STRESSFUL_EVENTS,
    fields: [
      {
        key: "lived_traveled_outside_us",
        label: "Lived or traveled outside the US",
      },
      { key: "recent_major_life_changes", label: "Recent major life changes" },
      {
        key: "trauma_death_family",
        label: "Death in family",
        format: (v) => v?.status ?? "-",
      },
      {
        key: "trauma_death_accident",
        label: "Accidental death",
        format: (v) => v?.status ?? "-",
      },
      {
        key: "trauma_sexual_physical_abuse",
        label: "Sexual / physical abuse",
        format: (v) => v?.status ?? "-",
      },
      {
        key: "trauma_emotional_neglect",
        label: "Emotional neglect",
        format: (v) => v?.status ?? "-",
      },
      {
        key: "trauma_discrimination",
        label: "Discrimination",
        format: (v) => v?.status ?? "-",
      },
      {
        key: "trauma_life_threatening_accident",
        label: "Life-threatening accident",
        format: (v) => v?.status ?? "-",
      },
      {
        key: "trauma_life_threatening_illness",
        label: "Life-threatening illness",
        format: (v) => v?.status ?? "-",
      },
      {
        key: "trauma_robbery_mugging",
        label: "Robbery / mugging",
        format: (v) => v?.status ?? "-",
      },
      {
        key: "trauma_witness_violence",
        label: "Witnessed violence",
        format: (v) => v?.status ?? "-",
      },
      {
        key: "work_school_time_off",
        label: "Time off work or school last year",
      },
      { key: "trauma_additional_notes", label: "Additional notes" },
    ],
  },

  {
    title: "Health Concerns",
    step: 2,
    block: HEALTH_HISTORY_BLOCKS.HEALTH_CONCERNS,
    fields: [
      { key: "main_health_concerns", label: "Main health concerns" },
      { key: "when_first_experienced", label: "When first experienced" },
      { key: "how_dealt_with_concerns", label: "How dealt with concerns" },
      { key: "success_with_approaches", label: "Success with approaches" },
      { key: "other_health_practitioners", label: "Other practitioners" },
      { key: "surgical_procedures", label: "Surgical procedures" },
      {
        key: "antibiotics_infancy_childhood",
        label: "Antibiotics in infancy / childhood",
      },
      { key: "antibiotics_teen", label: "Antibiotics in teen years" },
      { key: "antibiotics_adult", label: "Antibiotics in adulthood" },
      { key: "current_medications", label: "Current medications" },
      { key: "current_supplements", label: "Current supplements" },
      { key: "family_similar_problems", label: "Family with similar problems" },
      { key: "foods_avoid_symptoms", label: "Foods avoided due to symptoms" },
      {
        key: "immediate_symptoms_after_eating",
        label: "Immediate symptoms after eating",
      },
      {
        key: "delayed_symptoms_after_eating",
        label: "Delayed symptoms after eating",
      },
      { key: "food_cravings", label: "Food cravings" },
      { key: "diet_at_onset", label: "Diet at symptom onset" },
      { key: "known_food_allergies", label: "Known food allergies" },
      {
        key: "regular_food_consumption",
        label: "Regularly consumed foods",
        format: (v) => (v?.length ? v.join(", ") : "-"),
      },
      {
        key: "special_diet",
        label: "Special diet",
        format: (v) => (v?.length ? v.join(", ") : "-"),
      },
      { key: "home_cooked_percentage", label: "Home-cooked meals (%)" },
      {
        key: "diet_relationship_notes",
        label: "Diet / relationship with food notes",
      },
    ],
  },

  {
    title: "Bowel Health",
    step: 3,
    block: HEALTH_HISTORY_BLOCKS.BOWEL_HEALTH,
    fields: [
      { key: "bowel_movement_frequency", label: "Bowel movement frequency" },
      {
        key: "bowel_movement_consistency",
        label: "Bowel consistency",
        format: (v) => (v?.length ? v.join(", ") : "-"),
      },
      {
        key: "bowel_movement_color",
        label: "Bowel color",
        format: (v) => (v?.length ? v.join(", ") : "-"),
      },
      { key: "intestinal_gas", label: "Intestinal gas" },
      { key: "food_poisoning_history", label: "Food poisoning history" },
    ],
  },

  {
    title: "Medical History",
    step: 4,
    block: HEALTH_HISTORY_BLOCKS.MEDICAL_HISTORY,
    fields: [
      // Gastrointestinal
      ...GASTROINTESTINAL.map((item) => ({
        key: toSnakeCase(item.name) as keyof HealthHistory,
        label: item.label,
        format: formatMedicalHistoryField,
      })),

      // Hormones / Metabolic
      ...HORMONES_METABOLIC.map((item) => ({
        key: toSnakeCase(item.name) as keyof HealthHistory,
        label: item.label,
        format: formatMedicalHistoryField,
      })),

      // Cardiovascular
      ...CARDIOVASCULAR.map((item) => ({
        key: toSnakeCase(item.name) as keyof HealthHistory,
        label: item.label,
        format: formatMedicalHistoryField,
      })),

      // Cancer
      ...CANCER.map((item) => ({
        key: toSnakeCase(item.name) as keyof HealthHistory,
        label: item.label,
        format: formatMedicalHistoryField,
      })),

      // Genital & Urinary
      ...GENITAL_URINARY.map((item) => ({
        key: toSnakeCase(item.name) as keyof HealthHistory,
        label: item.label,
        format: formatMedicalHistoryField,
      })),

      // Musculoskeletal / Pain
      ...MUSCULOSKELETAL.map((item) => ({
        key: toSnakeCase(item.name) as keyof HealthHistory,
        label: item.label,
        format: formatMedicalHistoryField,
      })),

      // Immune / Inflammatory
      ...IMMUNE_INFLAMMATORY.map((item) => ({
        key: toSnakeCase(item.name) as keyof HealthHistory,
        label: item.label,
        format: formatMedicalHistoryField,
      })),

      // Respiratory
      ...RESPIRATORY.map((item) => ({
        key: toSnakeCase(item.name) as keyof HealthHistory,
        label: item.label,
        format: formatMedicalHistoryField,
      })),

      // Skin
      ...SKIN.map((item) => ({
        key: toSnakeCase(item.name) as keyof HealthHistory,
        label: item.label,
        format: formatMedicalHistoryField,
      })),

      // Neurologic / Mood
      ...NEUROLOGIC_MOOD.map((item) => ({
        key: toSnakeCase(item.name) as keyof HealthHistory,
        label: item.label,
        format: formatMedicalHistoryField,
      })),

      // Miscellaneous
      ...MISCELLANEOUS.map((item) => ({
        key: toSnakeCase(item.name) as keyof HealthHistory,
        label: item.label,
        format: formatMedicalHistoryField,
      })),

      // Other text fields
      {
        key: "otherConditionsSymptoms" as keyof HealthHistory,
        label: "Other conditions or symptoms",
      },

      // Frequency checks
      ...FREQUENCY_ITEMS.map((item) => ({
        key: toSnakeCase(item.name) as keyof HealthHistory,
        label: item.label,
        format: (v: HealthHistory[keyof HealthHistory]) => (v ?? "-") as string,
      })),

      // Environmental exposures
      {
        key: "chemicalToxicExposure" as keyof HealthHistory,
        label: "Chemical / toxic metal exposure",
      },
      {
        key: "odorSensitivity" as keyof HealthHistory,
        label: "Odor sensitivity",
      },
      {
        key: "secondhandSmokeExposure" as keyof HealthHistory,
        label: "Second-hand smoke exposure",
      },
      { key: "moldExposure" as keyof HealthHistory, label: "Mold exposure" },
    ],
  },

  {
    title: "Oral Health History",
    step: 5,
    block: "ORAL_HEALTH",
    fields: [
      {
        key: "last_dentist_visit",
        label:
          "How long since you last visited the dentist? What was the reason for that visit?",
      },
      {
        key: "dentist_health_discussion",
        label:
          "In the past 12 months has a dentist or hygienist talked to you about your oral health, blood sugar or other health concerns? (Explain.)",
      },
      {
        key: "oral_dental_regimen",
        label:
          "What is your current oral and dental regimen? (Please note whether this regimen is once or twice daily or occasionally and what kind of toothpaste you use.)",
      },
      {
        key: "mercury_amalgams",
        label:
          "Do you have any mercury amalgams? (If no, were they removed? If so, how?)",
      },
      {
        key: "root_canals",
        label: "Have you had any root canals? (If yes, how many and when?)",
      },
      {
        key: "oral_health_concerns",
        label:
          "Do you have any concerns about your oral or dental health? (gums bleed after flossing, receding gums)",
      },
      {
        key: "oral_health_additional_notes",
        label:
          "Is there anything else about your current oral or dental health or health history that you’d like us to know?",
      },
    ],
  },

  {
    title: "Lifestyle History",
    step: 6,
    block: HEALTH_HISTORY_BLOCKS.LIFESTYLE_HISTORY,
    fields: [
      { key: "junk_food_binge_dieting", label: "Junk food binge dieting" },
      { key: "substance_use_history", label: "Substance use" },
      { key: "stress_handling", label: "Stress handling" },
    ],
  },

  {
    title: "Sleep History",
    step: 7,
    block: "SLEEP_HISTORY",
    fields: [
      {
        key: "satisfied_with_sleep",
        label: "Are you satisfied with your sleep?",
      },
      {
        key: "stay_awake_all_day",
        label: "Do you stay awake all day without dozing?",
      },
      {
        key: "asleep_2am_4am",
        label:
          "Are you asleep (or trying to sleep) between 2:00 a.m. and 4:00 a.m.?",
      },
      {
        key: "fall_asleep_under_30min",
        label: "Do you fall asleep in less than 30 minutes?",
      },
      {
        key: "sleep_6_8_hours",
        label: "Do you sleep between 6 and 8 hours per night?",
      },
    ],
  },

  {
    title: "Women’s Health",
    step: 8,
    block: HEALTH_HISTORY_BLOCKS.WOMENS_HEALTH,
    fields: [
      {
        key: "age_first_period",
        label: "How old were you when you first got your period?",
      },
      {
        key: "menses_pms_pain",
        label:
          "How are/were your menses? Do/did you have PMS? Painful periods? If so, explain.",
      },
      {
        key: "cycle_second_half_symptoms",
        label:
          "In the second half of your cycle do you experience any symptoms of breast tenderness, water retention or irritability?",
      },
      {
        key: "yeast_uti_infections",
        label:
          "Have you experienced any yeast infections or urinary tract infections? Are they regular?",
      },
      {
        key: "birth_control_pills",
        label:
          "Have you/do you still take birth control pills? If so, please list length of time and type.",
      },
      {
        key: "conception_pregnancy_problems",
        label: "Have you had any problems with conception or pregnancy?",
      },
      {
        key: "hormone_replacement_herbs",
        label:
          "Are you taking any hormone replacement therapy or hormonal supportive herbs? If so, please list again here.",
      },
    ],
  },

  {
    title: "Sexual History",
    step: 9,
    block: HEALTH_HISTORY_BLOCKS.SEXUAL_HISTORY,
    fields: [
      {
        key: "sexual_functioning_concerns",
        label: "Sexual functioning concerns",
      },
      { key: "sexual_partners_past_year", label: "Partners past year" },
    ],
  },

  {
    title: "Mental Health",
    step: 10,
    block: HEALTH_HISTORY_BLOCKS.MENTAL_HEALTH,
    fields: [
      { key: "general_moods", label: "General moods" },
      { key: "energy_level_scale", label: "Energy level" },
      { key: "best_point_in_life", label: "Best point in life" },
    ],
  },

  {
    title: "Goals & Support",
    step: 11,
    block: HEALTH_HISTORY_BLOCKS.OTHER,
    fields: [
      {
        key: "role_in_wellness_plan",
        label: "What role do you play in your wellness plan?",
      },
      {
        key: "family_friends_support",
        label:
          "Do you think family and friends will be supportive of you making health and lifestyle changes to improve your quality of life? Explain, if no.",
      },
      {
        key: "supportive_person_dietary_change",
        label:
          "Who in your family or on your health care team will be most supportive of you making dietary change?",
      },
      {
        key: "other_useful_information",
        label:
          "Please describe any other information you think would be useful in helping to address your health concern(s).",
      },
      {
        key: "health_goals_aspirations",
        label: "What are your health goals and aspirations?",
      },
      {
        key: "why_achieve_goals",
        label:
          "Though it may seem odd, please consider why you might want to achieve that for yourself.",
      },
    ],
  },
];
