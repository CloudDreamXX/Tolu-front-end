import { z } from "zod";
import { HealthHistory, HealthHistoryPostData } from "entities/health-history";
import { formSchema } from "./ui";

type FormValues = z.infer<typeof formSchema>;

const defaultMedicalCondition = {
  status: "never" as const,
};

const defaultTraumaEvent = {
  status: "no" as const,
};

export const mapHealthHistoryToFormDefaults = (
  healthHistory?: HealthHistory
): Partial<FormValues> => {
  if (!healthHistory) return {};

  return {
    /* ==================== STRESSFUL EVENTS ==================== */
    stressfulEvents: {
      death_close_person:
        healthHistory.trauma_death_family ?? defaultTraumaEvent.status,
      sexual_physical_abuse:
        healthHistory.trauma_sexual_physical_abuse ?? defaultTraumaEvent,
      emotional_abuse:
        healthHistory.trauma_emotional_neglect ?? defaultTraumaEvent,
      discrimination:
        healthHistory.trauma_discrimination ?? defaultTraumaEvent,
      life_threatening_event:
        healthHistory.trauma_life_threatening_accident ?? defaultTraumaEvent,
      life_threatening_illness:
        healthHistory.trauma_life_threatening_illness ?? defaultTraumaEvent,
      weapon_threat:
        healthHistory.trauma_robbery_mugging ?? defaultTraumaEvent,
      witnessed_violence:
        healthHistory.trauma_witness_violence ?? defaultTraumaEvent,
    },

    timeOffWork: healthHistory.work_school_time_off,
    livedOutsideUS: healthHistory.lived_traveled_outside_us ?? "",
    majorLifeChanges: healthHistory.recent_major_life_changes ?? "",
    additionalNotes: healthHistory.trauma_additional_notes ?? "",

    /* ==================== MEDICAL STATUS ==================== */
    conditions: {
      /* Gastrointestinal */
      ibs: healthHistory.condition_ibs ?? defaultMedicalCondition,
      crohns: healthHistory.condition_crohns ?? defaultMedicalCondition,
      ulcerative_colitis:
        healthHistory.condition_ulcerative_colitis ?? defaultMedicalCondition,
      gastritis_ulcer:
        healthHistory.condition_gastritis_ulcer ?? defaultMedicalCondition,
      gerd: healthHistory.condition_gerd ?? defaultMedicalCondition,
      celiac: healthHistory.condition_celiac ?? defaultMedicalCondition,

      /* Hormonal / Metabolic */
      hypothyroidism:
        healthHistory.condition_hypothyroidism ?? defaultMedicalCondition,
      hyperthyroidism:
        healthHistory.condition_hyperthyroidism ?? defaultMedicalCondition,
      hashimotos:
        healthHistory.condition_hashimotos ?? defaultMedicalCondition,
      pcos: healthHistory.condition_pcos ?? defaultMedicalCondition,

      /* Cardiovascular */
      heart_disease:
        healthHistory.condition_heart_disease ?? defaultMedicalCondition,
      hypertension:
        healthHistory.condition_hypertension ?? defaultMedicalCondition,

      /* Neurologic / Mood */
      depression:
        healthHistory.condition_depression ?? defaultMedicalCondition,
      anxiety: healthHistory.condition_anxiety ?? defaultMedicalCondition,
    },

    other_conditions_symptoms:
      healthHistory.other_conditions_symptoms ?? "",

    /* ==================== ORAL HEALTH ==================== */
    last_dentist_visit: healthHistory.last_dentist_visit ?? "",
    dentist_health_discussion:
      healthHistory.dentist_health_discussion ?? "",
    oral_dental_regimen: healthHistory.oral_dental_regimen ?? "",
    mercury_amalgams: healthHistory.mercury_amalgams ?? "",
    root_canals: healthHistory.root_canals ?? "",
    oral_health_concerns: healthHistory.oral_health_concerns ?? "",
    oral_health_additional_notes:
      healthHistory.oral_health_additional_notes ?? "",

    /* ==================== LIFESTYLE ==================== */
    junk_food_binge_dieting:
      healthHistory.junk_food_binge_dieting ?? "",
    substance_use_history:
      healthHistory.substance_use_history ?? "",
    stress_handling: healthHistory.stress_handling ?? "",

    /* ==================== SLEEP ==================== */
    satisfied_with_sleep: healthHistory.satisfied_with_sleep ?? "no",
    stay_awake_all_day: healthHistory.stay_awake_all_day ?? "no",
    asleep_2am_4am: healthHistory.asleep_2am_4am ?? "no",
    fall_asleep_under_30min:
      healthHistory.fall_asleep_under_30min ?? "no",
    sleep_6_8_hours: healthHistory.sleep_6_8_hours ?? "no",

    /* ==================== WOMEN ==================== */
    age_first_period: healthHistory.age_first_period ?? "",
    menses_pms_pain: healthHistory.menses_pms_pain ?? "",
    birth_control_pills: healthHistory.birth_control_pills ?? "",

    /* ==================== SEXUAL ==================== */
    sexual_functioning_concerns:
      healthHistory.sexual_functioning_concerns ?? "",
    sexual_partners_past_year:
      healthHistory.sexual_partners_past_year ?? "",

    /* ==================== MENTAL HEALTH ==================== */
    general_moods: healthHistory.general_moods ?? "",
    energy_level_scale:
      healthHistory.energy_level_scale
        ? Number(healthHistory.energy_level_scale)
        : 5,
    best_point_in_life: healthHistory.best_point_in_life ?? "",

    /* ==================== OTHER ==================== */
    role_in_wellness_plan:
      healthHistory.role_in_wellness_plan ?? "",
    family_friends_support:
      healthHistory.family_friends_support ?? "",
    supportive_person_dietary_change:
      healthHistory.supportive_person_dietary_change ?? "",
    other_useful_information:
      healthHistory.other_useful_information ?? "",
    health_goals_aspirations:
      healthHistory.health_goals_aspirations ?? "",
    why_achieve_goals:
      healthHistory.why_achieve_goals ?? "",
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
  return prune(values as Record<string, any>);
};

