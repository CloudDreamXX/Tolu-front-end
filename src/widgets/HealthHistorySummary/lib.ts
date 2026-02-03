import { HealthHistory } from "entities/health-history";

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

export const HEALTH_HISTORY_SUMMARY: SummarySection<HealthHistory>[] = [
  {
    title: "Birth & Body",
    step: 1,
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
    title: "Stressful Events",
    step: 4,
    block: HEALTH_HISTORY_BLOCKS.STRESSFUL_EVENTS,
    fields: [
      {
        key: "trauma_death_family",
        label: "Death in family",
        format: (v) => v?.status,
      },
      {
        key: "trauma_death_accident",
        label: "Accidental death",
        format: (v) => v?.status,
      },
      {
        key: "trauma_sexual_physical_abuse",
        label: "Sexual / physical abuse",
        format: (v) => v?.status,
      },
      {
        key: "trauma_emotional_neglect",
        label: "Emotional neglect",
        format: (v) => v?.status,
      },
      {
        key: "trauma_discrimination",
        label: "Discrimination",
        format: (v) => v?.status,
      },
      { key: "trauma_additional_notes", label: "Additional notes" },
    ],
  },

  {
    title: "Medical History",
    step: 5,
    block: HEALTH_HISTORY_BLOCKS.MEDICAL_HISTORY,
    fields: [
      { key: "gastrointestinal_dates", label: "GI conditions" },
      { key: "hormones_metabolic_dates", label: "Hormonal / metabolic" },
      { key: "cardiovascular_dates", label: "Cardiovascular" },
      { key: "cancer_dates", label: "Cancer history" },
      { key: "neurologic_mood_dates", label: "Neurologic / mood" },
      { key: "other_conditions_symptoms", label: "Other conditions" },
    ],
  },

  {
    title: "Oral Health",
    step: 6,
    block: HEALTH_HISTORY_BLOCKS.ORAL_HEALTH,
    fields: [
      { key: "last_dentist_visit", label: "Last dentist visit" },
      { key: "oral_dental_regimen", label: "Dental regimen" },
      { key: "oral_health_concerns", label: "Oral health concerns" },
      { key: "oral_health_additional_notes", label: "Additional notes" },
    ],
  },

  {
    title: "Lifestyle History",
    step: 7,
    block: HEALTH_HISTORY_BLOCKS.LIFESTYLE_HISTORY,
    fields: [
      { key: "exercise_recreation", label: "Exercise / recreation" },
      { key: "substance_use_history", label: "Substance use" },
      { key: "stress_handling", label: "Stress handling" },
    ],
  },

  {
    title: "Sleep History",
    step: 8,
    block: HEALTH_HISTORY_BLOCKS.SLEEP_HISTORY,
    fields: [
      { key: "satisfied_with_sleep", label: "Satisfied with sleep" },
      { key: "stay_awake_all_day", label: "Stay awake all day" },
      { key: "sleep_6_8_hours", label: "Sleep 6–8 hours" },
    ],
  },

  {
    title: "Women’s Health",
    step: 9,
    block: HEALTH_HISTORY_BLOCKS.WOMENS_HEALTH,
    fields: [
      { key: "age_first_period", label: "Age first period" },
      { key: "menses_pms_pain", label: "PMS / pain" },
      { key: "birth_control_pills", label: "Birth control" },
      { key: "conception_pregnancy_problems", label: "Pregnancy concerns" },
    ],
  },

  {
    title: "Sexual History",
    step: 10,
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
    step: 11,
    block: HEALTH_HISTORY_BLOCKS.MENTAL_HEALTH,
    fields: [
      { key: "general_moods", label: "General moods" },
      { key: "energy_level_scale", label: "Energy level" },
      { key: "best_point_in_life", label: "Best point in life" },
    ],
  },

  {
    title: "Goals & Support",
    step: 12,
    block: HEALTH_HISTORY_BLOCKS.OTHER,
    fields: [
      { key: "health_goals_aspirations", label: "Health goals" },
      { key: "why_achieve_goals", label: "Why achieve goals" },
      { key: "family_friends_support", label: "Support system" },
    ],
  },
];
