import { z } from "zod";
import { HealthHistory } from "entities/health-history";
import { formSchema } from "./ui";

type FormValues = z.infer<typeof formSchema>;

export const mapHealthHistoryToFormDefaults = (
  healthHistory?: HealthHistory
): Partial<FormValues> => {
  if (!healthHistory) return {};

  return {
    email: "",
    fullName: "",

    age: healthHistory.age ?? "",
    birthDate: healthHistory.birth_date ?? "",
    genderAtBirth: healthHistory.gender_at_birth ?? "",
    chosenGenderAfterBirth: healthHistory.chosen_gender_after_birth ?? "",

    breastfedOrBottle: healthHistory.breastfed_or_bottle,
    birthDeliveryMethod: healthHistory.birth_delivery_method,

    height: healthHistory.height ?? "",
    bloodType: healthHistory.blood_type ?? "",

    currentWeightLbs: healthHistory.current_weight_lbs ?? "",
    idealWeightLbs: healthHistory.ideal_weight_lbs ?? "",
    weightOneYearAgoLbs: healthHistory.weight_one_year_ago_lbs ?? "",
    birthWeightLbs: healthHistory.birth_weight_lbs ?? "",

    birthOrderSiblings: healthHistory.birth_order_siblings ?? "",
    familyLivingSituation: healthHistory.family_living_situation ?? "",

    partnerGenderAtBirth: healthHistory.partner_gender_at_birth ?? "",
    partnerChosenGender: healthHistory.partner_chosen_gender ?? "",
    children: healthHistory.children ?? "",
    exerciseRecreation: healthHistory.exercise_recreation ?? "",

    mainHealthConcerns: healthHistory.main_health_concerns ?? "",
    whenFirstExperienced: healthHistory.when_first_experienced ?? "",
    howDealtWithConcerns: healthHistory.how_dealt_with_concerns ?? "",
    successWithApproaches: healthHistory.success_with_approaches ?? "",
    otherHealthPractitioners: healthHistory.other_health_practitioners ?? "",
    surgicalProcedures: healthHistory.surgical_procedures ?? "",
    antibioticsInfancyChildhood:
      healthHistory.antibiotics_infancy_childhood ?? "",
    antibioticsTeen: healthHistory.antibiotics_teen ?? "",
    antibioticsAdult: healthHistory.antibiotics_adult ?? "",
    currentMedications: healthHistory.current_medications ?? "",
    currentSupplements: healthHistory.current_supplements ?? "",
    familySimilarProblems: healthHistory.family_similar_problems ?? "",
    foodsAvoidSymptoms: healthHistory.foods_avoid_symptoms ?? "",
    immediateSymptomsAfterEating:
      healthHistory.immediate_symptoms_after_eating ?? "",
    delayedSymptomsAfterEating:
      healthHistory.delayed_symptoms_after_eating ?? "",
    foodCravings: healthHistory.food_cravings ?? "",
    dietAtOnset: healthHistory.diet_at_onset ?? "",
    knownFoodAllergies: healthHistory.known_food_allergies ?? "",
    regularFoodConsumption: healthHistory.regular_food_consumption ?? [],
    specialDiet: healthHistory.special_diet ?? [],
    homeCookedPercentage: healthHistory.home_cooked_percentage ?? 0,
    dietRelationshipNotes: healthHistory.diet_relationship_notes ?? "",

    bowelMovementFrequency: healthHistory.bowel_movement_frequency,
    bowelMovementConsistency: healthHistory.bowel_movement_consistency ?? [],
    bowelMovementColor: healthHistory.bowel_movement_color ?? [],
    intestinalGas: healthHistory.intestinal_gas ?? "",
    foodPoisoningHistory: healthHistory.food_poisoning_history ?? "",

    traumaDeathFamily: healthHistory.trauma_death_family,
    traumaDeathAccident: healthHistory.trauma_death_accident,
    traumaSexualPhysicalAbuse: healthHistory.trauma_sexual_physical_abuse,
    traumaEmotionalNeglect: healthHistory.trauma_emotional_neglect,
    traumaDiscrimination: healthHistory.trauma_discrimination,
    traumaLifeThreateningAccident:
      healthHistory.trauma_life_threatening_accident,
    traumaLifeThreateningIllness: healthHistory.trauma_life_threatening_illness,
    traumaRobberyMugging: healthHistory.trauma_robbery_mugging,
    traumaWitnessViolence: healthHistory.trauma_witness_violence,

    livedTraveledOutsideUs: healthHistory.lived_traveled_outside_us ?? "",
    recentMajorLifeChanges: healthHistory.recent_major_life_changes ?? "",
    workSchoolTimeOff: healthHistory.work_school_time_off ?? "does_not_apply",
    traumaAdditionalNotes: healthHistory.trauma_additional_notes ?? "",

    conditionIbs: healthHistory.condition_ibs,
    conditionCrohns: healthHistory.condition_crohns,
    conditionUlcerativeColitis: healthHistory.condition_ulcerative_colitis,
    conditionGastritisUlcer: healthHistory.condition_gastritis_ulcer,
    conditionGerd: healthHistory.condition_gerd,
    conditionCeliac: healthHistory.condition_celiac,

    gastrointestinalDates: healthHistory.gastrointestinal_dates ?? "",

    chemicalToxicExposure: healthHistory.chemical_toxic_exposure ?? "",
    odorSensitivity: healthHistory.odor_sensitivity ?? "",
    secondhandSmokeExposure: healthHistory.secondhand_smoke_exposure ?? "",
    moldExposure: healthHistory.mold_exposure ?? "",

    otherConditionsSymptoms: healthHistory.other_conditions_symptoms ?? "",

    freqMemoryImpairment: healthHistory.freq_memory_impairment,
    freqShortenedFocus: healthHistory.freq_shortened_focus,
    freqCoordinationBalance: healthHistory.freq_coordination_balance,
    freqLackInhibition: healthHistory.freq_lack_inhibition,
    freqPoorOrganization: healthHistory.freq_poor_organization,
    freqTimeManagement: healthHistory.freq_time_management,
    freqMoodInstability: healthHistory.freq_mood_instability,
    freqSpeechWordFinding: healthHistory.freq_speech_word_finding,
    freqBrainFog: healthHistory.freq_brain_fog,
    freqLowerEffectiveness: healthHistory.freq_lower_effectiveness,
    freqJudgmentProblems: healthHistory.freq_judgment_problems,

    lastDentistVisit: healthHistory.last_dentist_visit ?? "",
    oralDentalRegimen: healthHistory.oral_dental_regimen ?? "",

    junkFoodBingeDieting: healthHistory.junk_food_binge_dieting ?? "",
    substanceUseHistory: healthHistory.substance_use_history ?? "",
    stressHandling: healthHistory.stress_handling ?? "",

    satisfiedWithSleep: healthHistory.satisfied_with_sleep ?? "no",
    stayAwakeAllDay: healthHistory.stay_awake_all_day ?? "no",
    asleep2am4am: healthHistory.asleep_2am_4am ?? "no",
    fallAsleepUnder30min: healthHistory.fall_asleep_under_30min ?? "no",
    sleep6to8Hours: healthHistory.sleep_6_8_hours ?? "no",

    ageFirstPeriod: healthHistory.age_first_period ?? "",
    mensesPmsPain: healthHistory.menses_pms_pain ?? "",
    birthControlPills: healthHistory.birth_control_pills ?? "",

    sexualFunctioningConcerns: healthHistory.sexual_functioning_concerns ?? "",
    sexualPartnersPastYear: healthHistory.sexual_partners_past_year ?? "",

    generalMoods: healthHistory.general_moods ?? "",
    energyLevelScale: healthHistory.energy_level_scale ?? "",

    healthGoalsAspirations: healthHistory.health_goals_aspirations ?? "",
    whyAchieveGoals: healthHistory.why_achieve_goals ?? "",
  };
};

export const prune = (obj: Record<string, any>): Record<string, any> => {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    if (typeof v === "object" && Object.keys(prune(v)).length === 0) continue;
    out[k] = v;
  }
  return out;
};

export const mapFormValuesToHealthHistoryPayload = (
  values: Partial<FormValues>
): Partial<HealthHistory> => {
  return prune(values as Record<string, any>);
};
