import { z } from "zod";
import { HealthHistory } from "entities/health-history";
import { formSchema } from "./ui";

type FormValues = z.infer<typeof formSchema>;

export const mapHealthHistoryToFormDefaults = (
  healthHistory?: HealthHistory
): Partial<FormValues> => {
  if (!healthHistory) return {};

  return {
    // Basic Info
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

    // Travel & Life Changes
    livedTraveledOutsideUs: healthHistory.lived_traveled_outside_us ?? "",
    recentMajorLifeChanges: healthHistory.recent_major_life_changes ?? "",
    workSchoolTimeOff: healthHistory.work_school_time_off ?? "does_not_apply",
    traumaAdditionalNotes: healthHistory.trauma_additional_notes ?? "",

    traumaDeathFamily: healthHistory.trauma_death_family,
    traumaDeathAccident: healthHistory.trauma_death_accident,
    traumaSexualPhysicalAbuse: healthHistory.trauma_sexual_physical_abuse,
    traumaEmotionalNeglect: healthHistory.trauma_emotional_neglect,
    traumaDiscrimination: healthHistory.trauma_discrimination,
    traumaLifeThreateningAccident: healthHistory.trauma_life_threatening_accident,
    traumaLifeThreateningIllness: healthHistory.trauma_life_threatening_illness,
    traumaRobberyMugging: healthHistory.trauma_robbery_mugging,
    traumaWitnessViolence: healthHistory.trauma_witness_violence,

    // Health Concerns
    mainHealthConcerns: healthHistory.main_health_concerns ?? "",
    whenFirstExperienced: healthHistory.when_first_experienced ?? "",
    howDealtWithConcerns: healthHistory.how_dealt_with_concerns ?? "",
    successWithApproaches: healthHistory.success_with_approaches ?? "",
    otherHealthPractitioners: healthHistory.other_health_practitioners ?? "",
    surgicalProcedures: healthHistory.surgical_procedures ?? "",
    antibioticsInfancyChildhood: healthHistory.antibiotics_infancy_childhood ?? "",
    antibioticsTeen: healthHistory.antibiotics_teen ?? "",
    antibioticsAdult: healthHistory.antibiotics_adult ?? "",
    currentMedications: healthHistory.current_medications ?? "",
    currentSupplements: healthHistory.current_supplements ?? "",
    familySimilarProblems: healthHistory.family_similar_problems ?? "",
    foodsAvoidSymptoms: healthHistory.foods_avoid_symptoms ?? "",
    immediateSymptomsAfterEating: healthHistory.immediate_symptoms_after_eating ?? "",
    delayedSymptomsAfterEating: healthHistory.delayed_symptoms_after_eating ?? "",
    foodCravings: healthHistory.food_cravings ?? "",
    dietAtOnset: healthHistory.diet_at_onset ?? "",
    knownFoodAllergies: healthHistory.known_food_allergies ?? "",
    regularFoodConsumption: healthHistory.regular_food_consumption ?? [],
    specialDiet: healthHistory.special_diet ?? [],
    homeCookedPercentage: healthHistory.home_cooked_percentage ?? 0,
    dietRelationshipNotes: healthHistory.diet_relationship_notes ?? "",

    // Bowel & Digestive
    bowelMovementFrequency: healthHistory.bowel_movement_frequency,
    bowelMovementConsistency: healthHistory.bowel_movement_consistency ?? [],
    bowelMovementColor: healthHistory.bowel_movement_color ?? [],
    intestinalGas: healthHistory.intestinal_gas ?? "",
    foodPoisoningHistory: healthHistory.food_poisoning_history ?? "",

    // Medical Conditions
    conditionIbs: healthHistory.condition_ibs,
    conditionCrohns: healthHistory.condition_crohns,
    conditionUlcerativeColitis: healthHistory.condition_ulcerative_colitis,
    conditionGastritisUlcer: healthHistory.condition_gastritis_ulcer,
    conditionGerd: healthHistory.condition_gerd,
    conditionCeliac: healthHistory.condition_celiac,
    conditionSibo: healthHistory.condition_sibo,
    conditionGutInfections: healthHistory.condition_gut_infections,
    conditionDysbiosis: healthHistory.condition_dysbiosis,
    conditionLeakyGut: healthHistory.condition_leaky_gut,
    conditionFoodAllergies: healthHistory.condition_food_allergies,
    conditionGallstones: healthHistory.condition_gallstones,
    conditionAbsorptionIssues: healthHistory.condition_absorption_issues,
    gastrointestinalDates: healthHistory.gastrointestinal_dates ?? "",

    // Hormones / Metabolic
    conditionType1Diabetes: healthHistory.condition_type1_diabetes,
    conditionType2Diabetes: healthHistory.condition_type2_diabetes,
    conditionHypoglycemia: healthHistory.condition_hypoglycemia,
    conditionMetabolicSyndrome: healthHistory.condition_metabolic_syndrome,
    conditionInsulinResistance: healthHistory.condition_insulin_resistance,
    conditionHypothyroidism: healthHistory.condition_hypothyroidism,
    conditionHyperthyroidism: healthHistory.condition_hyperthyroidism,
    conditionHashimotos: healthHistory.condition_hashimotos,
    conditionGravesDisease: healthHistory.condition_graves_disease,
    conditionEndocrineProblems: healthHistory.condition_endocrine_problems,
    conditionPcos: healthHistory.condition_pcos,
    conditionInfertility: healthHistory.condition_infertility,
    conditionWeightGain: healthHistory.condition_weight_gain,
    conditionWeightLoss: healthHistory.condition_weight_loss,
    conditionWeightFluctuations: healthHistory.condition_weight_fluctuations,
    conditionEatingDisorder: healthHistory.condition_eating_disorder,
    hormonesMetabolicDates: healthHistory.hormones_metabolic_dates ?? "",

    // Cardiovascular
    conditionHeartAttack: healthHistory.condition_heart_attack,
    conditionHeartDisease: healthHistory.condition_heart_disease,
    conditionStroke: healthHistory.condition_stroke,
    conditionElevatedCholesterol: healthHistory.condition_elevated_cholesterol,
    conditionArrhythmia: healthHistory.condition_arrhythmia,
    conditionHypertension: healthHistory.condition_hypertension,
    conditionRheumaticFever: healthHistory.condition_rheumatic_fever,
    conditionMitralValveProlapse: healthHistory.condition_mitral_valve_prolapse,
    cardiovascularDates: healthHistory.cardiovascular_dates ?? "",

    // Cancer
    conditionLungCancer: healthHistory.condition_lung_cancer,
    conditionBreastCancer: healthHistory.condition_breast_cancer,
    conditionColonCancer: healthHistory.condition_colon_cancer,
    conditionOvarianCancer: healthHistory.condition_ovarian_cancer,
    conditionProstateCancer: healthHistory.condition_prostate_cancer,
    conditionSkinCancerMelanoma: healthHistory.condition_skin_cancer_melanoma,
    conditionSkinCancerSquamousBasal: healthHistory.condition_skin_cancer_squamous_basal,
    cancerDates: healthHistory.cancer_dates ?? "",

    // Genital / Urinary
    conditionKidneyStones: healthHistory.condition_kidney_stones,
    conditionGout: healthHistory.condition_gout,
    conditionInterstitialCystitis: healthHistory.condition_interstitial_cystitis,
    conditionFrequentUti: healthHistory.condition_frequent_uti,
    conditionSexualDysfunction: healthHistory.condition_sexual_dysfunction,
    conditionFrequentYeast: healthHistory.condition_frequent_yeast,
    genitalUrinaryDates: healthHistory.genital_urinary_dates ?? "",

    // Musculoskeletal
    conditionOsteoarthritis: healthHistory.condition_osteoarthritis,
    conditionFibromyalgia: healthHistory.condition_fibromyalgia,
    conditionChronicPain: healthHistory.condition_chronic_pain,
    conditionSoreMusclesJoints: healthHistory.condition_sore_muscles_joints,
    musculoskeletalDates: healthHistory.musculoskeletal_dates ?? "",

    // Immune / Inflammatory
    conditionChronicFatigue: healthHistory.condition_chronic_fatigue,
    conditionRheumatoidArthritis: healthHistory.condition_rheumatoid_arthritis,
    conditionLupus: healthHistory.condition_lupus,
    conditionRaynauds: healthHistory.condition_raynauds,
    conditionPsoriasis: healthHistory.condition_psoriasis,
    conditionMctd: healthHistory.condition_mctd,
    conditionPoorImmune: healthHistory.condition_poor_immune,
    conditionFoodAllergiesImmune: healthHistory.condition_food_allergies_immune,
    conditionEnvironmentalAllergies: healthHistory.condition_environmental_allergies,
    conditionChemicalSensitivities: healthHistory.condition_chemical_sensitivities,
    conditionLatexAllergy: healthHistory.condition_latex_allergy,
    conditionHepatitis: healthHistory.condition_hepatitis,
    conditionLyme: healthHistory.condition_lyme,
    conditionChronicInfections: healthHistory.condition_chronic_infections,
    immuneInflammatoryDates: healthHistory.immune_inflammatory_dates ?? "",

    // Respiratory
    conditionAsthma: healthHistory.condition_asthma,
    conditionChronicSinusitis: healthHistory.condition_chronic_sinusitis,
    conditionBronchitis: healthHistory.condition_bronchitis,
    conditionEmphysema: healthHistory.condition_emphysema,
    conditionPneumonia: healthHistory.condition_pneumonia,
    conditionSleepApnea: healthHistory.condition_sleep_apnea,
    conditionFrequentColdsFlus: healthHistory.condition_frequent_colds_flus,
    respiratoryDates: healthHistory.respiratory_dates ?? "",

    // Skin
    conditionEczema: healthHistory.condition_eczema,
    conditionPsoriasisSkin: healthHistory.condition_psoriasis_skin,
    conditionDermatitis: healthHistory.condition_dermatitis,
    conditionHives: healthHistory.condition_hives,
    conditionRashUndiagnosed: healthHistory.condition_rash_undiagnosed,
    conditionAcne: healthHistory.condition_acne,
    conditionSkinCancerMelanomaDup: healthHistory.condition_skin_cancer_melanoma_dup,
    conditionSkinCancerSquamousBasalDup: healthHistory.condition_skin_cancer_squamous_basal_dup,
    skinConditionsDates: healthHistory.skin_conditions_dates ?? "",

    // Neurologic / Mood
    conditionDepression: healthHistory.condition_depression,
    conditionAnxiety: healthHistory.condition_anxiety,
    conditionBipolar: healthHistory.condition_bipolar,
    conditionSchizophrenia: healthHistory.condition_schizophrenia,
    conditionHeadaches: healthHistory.condition_headaches,
    conditionMigraines: healthHistory.condition_migraines,
    conditionAddAdhd: healthHistory.condition_add_adhd,
    conditionAutism: healthHistory.condition_autism,
    conditionMildCognitiveImpairment: healthHistory.condition_mild_cognitive_impairment,
    conditionMemoryProblems: healthHistory.condition_memory_problems,
    conditionParkinsons: healthHistory.condition_parkinsons,
    conditionMultipleSclerosis: healthHistory.condition_multiple_sclerosis,
    conditionAls: healthHistory.condition_als,
    conditionSeizures: healthHistory.condition_seizures,
    conditionAlzheimers: healthHistory.condition_alzheimers,
    conditionConcussionTbi: healthHistory.condition_concussion_tbi,
    neurologicMoodDates: healthHistory.neurologic_mood_dates ?? "",

    // Miscellaneous
    conditionAnemia: healthHistory.condition_anemia,
    conditionChickenPox: healthHistory.condition_chicken_pox,
    conditionGermanMeasles: healthHistory.condition_german_measles,
    conditionMeasles: healthHistory.condition_measles,
    conditionMononucleosis: healthHistory.condition_mononucleosis,
    conditionMumps: healthHistory.condition_mumps,
    conditionWhoopingCough: healthHistory.condition_whooping_cough,
    conditionTuberculosis: healthHistory.condition_tuberculosis,
    conditionGeneticVariants: healthHistory.condition_genetic_variants,
    miscellaneousDates: healthHistory.miscellaneous_dates ?? "",
    otherConditionsSymptoms: healthHistory.other_conditions_symptoms ?? "",

    // Frequency
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

    // Environmental exposures
    chemicalToxicExposure: healthHistory.chemical_toxic_exposure ?? "",
    odorSensitivity: healthHistory.odor_sensitivity ?? "",
    secondhandSmokeExposure: healthHistory.secondhand_smoke_exposure ?? "",
    moldExposure: healthHistory.mold_exposure ?? "",

    // Oral/Dental
    lastDentistVisit: healthHistory.last_dentist_visit ?? "",
    dentistHealthDiscussion: healthHistory.dentist_health_discussion ?? "",
    oralDentalRegimen: healthHistory.oral_dental_regimen ?? "",
    mercuryAmalgams: healthHistory.mercury_amalgams ?? "",
    rootCanals: healthHistory.root_canals ?? "",
    oralHealthConcerns: healthHistory.oral_health_concerns ?? "",
    oralHealthAdditionalNotes: healthHistory.oral_health_additional_notes ?? "",

    // Sleep
    satisfiedWithSleep: healthHistory.satisfied_with_sleep ?? "no",
    stayAwakeAllDay: healthHistory.stay_awake_all_day ?? "no",
    asleep2am4am: healthHistory.asleep_2am_4am ?? "no",
    fallAsleepUnder30min: healthHistory.fall_asleep_under_30min ?? "no",
    sleep6to8Hours: healthHistory.sleep_6_8_hours ?? "no",

    // Menstrual / Hormonal
    ageFirstPeriod: healthHistory.age_first_period ?? "",
    mensesPmsPain: healthHistory.menses_pms_pain ?? "",
    cycleSecondHalfSymptoms: healthHistory.cycle_second_half_symptoms ?? "",
    yeastUtiInfections: healthHistory.yeast_uti_infections ?? "",
    birthControlPills: healthHistory.birth_control_pills ?? "",
    conceptionPregnancyProblems: healthHistory.conception_pregnancy_problems ?? "",
    hormoneReplacementHerbs: healthHistory.hormone_replacement_herbs ?? "",

    // Sexual Health
    sexualFunctioningConcerns: healthHistory.sexual_functioning_concerns ?? "",
    sexualPartnersPastYear: healthHistory.sexual_partners_past_year ?? "",

    // Mood & Energy
    generalMoods: healthHistory.general_moods ?? "",
    energyLevelScale: healthHistory.energy_level_scale ?? "",
    bestPointInLife: healthHistory.best_point_in_life ?? "",

    // Support / Wellness
    roleInWellnessPlan: healthHistory.role_in_wellness_plan ?? "",
    familyFriendsSupport: healthHistory.family_friends_support ?? "",
    supportivePersonDietaryChange: healthHistory.supportive_person_dietary_change ?? "",
    otherUsefulInformation: healthHistory.other_useful_information ?? "",
    healthGoalsAspirations: healthHistory.health_goals_aspirations ?? "",
    whyAchieveGoals: healthHistory.why_achieve_goals ?? "",

    // Lifestyle
    junkFoodBingeDieting: healthHistory.junk_food_binge_dieting ?? "",
    substanceUseHistory: healthHistory.substance_use_history ?? "",
    stressHandling: healthHistory.stress_handling ?? "",
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

export const FORM_TO_API_FIELD_MAP: Record<string, keyof HealthHistory> = {
  // Basic
  age: "age",
  birthDate: "birth_date",
  genderAtBirth: "gender_at_birth",
  chosenGenderAfterBirth: "chosen_gender_after_birth",

  // Birth & body
  breastfedOrBottle: "breastfed_or_bottle",
  birthDeliveryMethod: "birth_delivery_method",
  height: "height",
  bloodType: "blood_type",
  currentWeightLbs: "current_weight_lbs",
  idealWeightLbs: "ideal_weight_lbs",
  weightOneYearAgoLbs: "weight_one_year_ago_lbs",
  birthWeightLbs: "birth_weight_lbs",
  birthOrderSiblings: "birth_order_siblings",
  familyLivingSituation: "family_living_situation",

  // Partner / family
  partnerGenderAtBirth: "partner_gender_at_birth",
  partnerChosenGender: "partner_chosen_gender",
  children: "children",

  // Lifestyle
  exerciseRecreation: "exercise_recreation",
  livedTraveledOutsideUs: "lived_traveled_outside_us",
  recentMajorLifeChanges: "recent_major_life_changes",
  workSchoolTimeOff: "work_school_time_off",

  // Trauma
  traumaDeathFamily: "trauma_death_family",
  traumaDeathAccident: "trauma_death_accident",
  traumaSexualPhysicalAbuse: "trauma_sexual_physical_abuse",
  traumaEmotionalNeglect: "trauma_emotional_neglect",
  traumaDiscrimination: "trauma_discrimination",
  traumaLifeThreateningAccident: "trauma_life_threatening_accident",
  traumaLifeThreateningIllness: "trauma_life_threatening_illness",
  traumaRobberyMugging: "trauma_robbery_mugging",
  traumaWitnessViolence: "trauma_witness_violence",
  traumaAdditionalNotes: "trauma_additional_notes",

  // Health concerns
  mainHealthConcerns: "main_health_concerns",
  whenFirstExperienced: "when_first_experienced",
  howDealtWithConcerns: "how_dealt_with_concerns",
  successWithApproaches: "success_with_approaches",
  otherHealthPractitioners: "other_health_practitioners",
  surgicalProcedures: "surgical_procedures",
  antibioticsInfancyChildhood: "antibiotics_infancy_childhood",
  antibioticsTeen: "antibiotics_teen",
  antibioticsAdult: "antibiotics_adult",
  currentMedications: "current_medications",
  currentSupplements: "current_supplements",

  // Diet
  familySimilarProblems: "family_similar_problems",
  foodsAvoidSymptoms: "foods_avoid_symptoms",
  immediateSymptomsAfterEating: "immediate_symptoms_after_eating",
  delayedSymptomsAfterEating: "delayed_symptoms_after_eating",
  foodCravings: "food_cravings",
  dietAtOnset: "diet_at_onset",
  knownFoodAllergies: "known_food_allergies",
  regularFoodConsumption: "regular_food_consumption",
  specialDiet: "special_diet",
  homeCookedPercentage: "home_cooked_percentage",
  dietRelationshipNotes: "diet_relationship_notes",

  // Bowel
  bowelMovementFrequency: "bowel_movement_frequency",
  bowelMovementConsistency: "bowel_movement_consistency",
  bowelMovementColor: "bowel_movement_color",
  intestinalGas: "intestinal_gas",
  foodPoisoningHistory: "food_poisoning_history",

  // Gastrointestinal conditions
  conditionIbs: "condition_ibs",
  conditionCrohns: "condition_crohns",
  conditionUlcerativeColitis: "condition_ulcerative_colitis",
  conditionGastritisUlcer: "condition_gastritis_ulcer",
  conditionGerd: "condition_gerd",
  conditionCeliac: "condition_celiac",
  conditionSibo: "condition_sibo",
  conditionGutInfections: "condition_gut_infections",
  conditionDysbiosis: "condition_dysbiosis",
  conditionLeakyGut: "condition_leaky_gut",
  conditionFoodAllergies: "condition_food_allergies",
  conditionGallstones: "condition_gallstones",
  conditionAbsorptionIssues: "condition_absorption_issues",
  gastrointestinalDates: "gastrointestinal_dates",

  // Hormones & metabolic
  conditionType1Diabetes: "condition_type1_diabetes",
  conditionType2Diabetes: "condition_type2_diabetes",
  conditionHypoglycemia: "condition_hypoglycemia",
  conditionMetabolicSyndrome: "condition_metabolic_syndrome",
  conditionInsulinResistance: "condition_insulin_resistance",
  conditionHypothyroidism: "condition_hypothyroidism",
  conditionHyperthyroidism: "condition_hyperthyroidism",
  conditionHashimotos: "condition_hashimotos",
  conditionGravesDisease: "condition_graves_disease",
  conditionEndocrineProblems: "condition_endocrine_problems",
  conditionPcos: "condition_pcos",
  conditionInfertility: "condition_infertility",
  conditionWeightGain: "condition_weight_gain",
  conditionWeightLoss: "condition_weight_loss",
  conditionWeightFluctuations: "condition_weight_fluctuations",
  conditionEatingDisorder: "condition_eating_disorder",
  hormonesMetabolicDates: "hormones_metabolic_dates",

  // Cardiovascular
  conditionHeartAttack: "condition_heart_attack",
  conditionHeartDisease: "condition_heart_disease",
  conditionStroke: "condition_stroke",
  conditionElevatedCholesterol: "condition_elevated_cholesterol",
  conditionArrhythmia: "condition_arrhythmia",
  conditionHypertension: "condition_hypertension",
  conditionRheumaticFever: "condition_rheumatic_fever",
  conditionMitralValveProlapse: "condition_mitral_valve_prolapse",
  cardiovascularDates: "cardiovascular_dates",

  // Cancer
  conditionLungCancer: "condition_lung_cancer",
  conditionBreastCancer: "condition_breast_cancer",
  conditionColonCancer: "condition_colon_cancer",
  conditionOvarianCancer: "condition_ovarian_cancer",
  conditionProstateCancer: "condition_prostate_cancer",
  conditionSkinCancerMelanoma: "condition_skin_cancer_melanoma",
  conditionSkinCancerSquamousBasal: "condition_skin_cancer_squamous_basal",
  cancerDates: "cancer_dates",

  // Genitourinary
  conditionKidneyStones: "condition_kidney_stones",
  conditionGout: "condition_gout",
  conditionInterstitialCystitis: "condition_interstitial_cystitis",
  conditionFrequentUti: "condition_frequent_uti",
  conditionSexualDysfunction: "condition_sexual_dysfunction",
  conditionFrequentYeast: "condition_frequent_yeast",
  genitalUrinaryDates: "genital_urinary_dates",

  // Musculoskeletal
  conditionOsteoarthritis: "condition_osteoarthritis",
  conditionFibromyalgia: "condition_fibromyalgia",
  conditionChronicPain: "condition_chronic_pain",
  conditionSoreMusclesJoints: "condition_sore_muscles_joints",
  musculoskeletalDates: "musculoskeletal_dates",

  // Immune & inflammatory
  conditionChronicFatigue: "condition_chronic_fatigue",
  conditionRheumatoidArthritis: "condition_rheumatoid_arthritis",
  conditionLupus: "condition_lupus",
  conditionRaynauds: "condition_raynauds",
  conditionPsoriasis: "condition_psoriasis",
  conditionMctd: "condition_mctd",
  conditionPoorImmune: "condition_poor_immune",
  conditionFoodAllergiesImmune: "condition_food_allergies_immune",
  conditionEnvironmentalAllergies: "condition_environmental_allergies",
  conditionChemicalSensitivities: "condition_chemical_sensitivities",
  conditionLatexAllergy: "condition_latex_allergy",
  conditionHepatitis: "condition_hepatitis",
  conditionLyme: "condition_lyme",
  conditionChronicInfections: "condition_chronic_infections",
  immuneInflammatoryDates: "immune_inflammatory_dates",

  // Respiratory
  conditionAsthma: "condition_asthma",
  conditionChronicSinusitis: "condition_chronic_sinusitis",
  conditionBronchitis: "condition_bronchitis",
  conditionEmphysema: "condition_emphysema",
  conditionPneumonia: "condition_pneumonia",
  conditionSleepApnea: "condition_sleep_apnea",
  conditionFrequentColdsFlus: "condition_frequent_colds_flus",
  respiratoryDates: "respiratory_dates",

  // Skin
  conditionEczema: "condition_eczema",
  conditionPsoriasisSkin: "condition_psoriasis_skin",
  conditionDermatitis: "condition_dermatitis",
  conditionHives: "condition_hives",
  conditionRashUndiagnosed: "condition_rash_undiagnosed",
  conditionAcne: "condition_acne",
  conditionSkinCancerMelanomaDup: "condition_skin_cancer_melanoma_dup",
  conditionSkinCancerSquamousBasalDup: "condition_skin_cancer_squamous_basal_dup",
  skinConditionsDates: "skin_conditions_dates",

  // Neurologic / mood
  conditionDepression: "condition_depression",
  conditionAnxiety: "condition_anxiety",
  conditionBipolar: "condition_bipolar",
  conditionSchizophrenia: "condition_schizophrenia",
  conditionHeadaches: "condition_headaches",
  conditionMigraines: "condition_migraines",
  conditionAddAdhd: "condition_add_adhd",
  conditionAutism: "condition_autism",
  conditionMildCognitiveImpairment: "condition_mild_cognitive_impairment",
  conditionMemoryProblems: "condition_memory_problems",
  conditionParkinsons: "condition_parkinsons",
  conditionMultipleSclerosis: "condition_multiple_sclerosis",
  conditionAls: "condition_als",
  conditionSeizures: "condition_seizures",
  conditionAlzheimers: "condition_alzheimers",
  conditionConcussionTbi: "condition_concussion_tbi",
  neurologicMoodDates: "neurologic_mood_dates",

  // Miscellaneous
  conditionAnemia: "condition_anemia",
  conditionChickenPox: "condition_chicken_pox",
  conditionGermanMeasles: "condition_german_measles",
  conditionMeasles: "condition_measles",
  conditionMononucleosis: "condition_mononucleosis",
  conditionMumps: "condition_mumps",
  conditionWhoopingCough: "condition_whooping_cough",
  conditionTuberculosis: "condition_tuberculosis",
  conditionGeneticVariants: "condition_genetic_variants",
  miscellaneousDates: "miscellaneous_dates",
  otherConditionsSymptoms: "other_conditions_symptoms",

  // Cognitive / focus
  freqMemoryImpairment: "freq_memory_impairment",
  freqShortenedFocus: "freq_shortened_focus",
  freqCoordinationBalance: "freq_coordination_balance",
  freqLackInhibition: "freq_lack_inhibition",
  freqPoorOrganization: "freq_poor_organization",
  freqTimeManagement: "freq_time_management",
  freqMoodInstability: "freq_mood_instability",
  freqSpeechWordFinding: "freq_speech_word_finding",
  freqBrainFog: "freq_brain_fog",
  freqLowerEffectiveness: "freq_lower_effectiveness",
  freqJudgmentProblems: "freq_judgment_problems",

  // Environmental exposures
  chemicalToxicExposure: "chemical_toxic_exposure",
  odorSensitivity: "odor_sensitivity",
  secondhandSmokeExposure: "secondhand_smoke_exposure",
  moldExposure: "mold_exposure",

  // Oral health
  lastDentistVisit: "last_dentist_visit",
  dentistHealthDiscussion: "dentist_health_discussion",
  oralDentalRegimen: "oral_dental_regimen",
  mercuryAmalgams: "mercury_amalgams",
  rootCanals: "root_canals",
  oralHealthConcerns: "oral_health_concerns",
  oralHealthAdditionalNotes: "oral_health_additional_notes",

  // Lifestyle / sleep
  junkFoodBingeDieting: "junk_food_binge_dieting",
  substanceUseHistory: "substance_use_history",
  stressHandling: "stress_handling",
  satisfiedWithSleep: "satisfied_with_sleep",
  stayAwakeAllDay: "stay_awake_all_day",
  asleep2am4am: "asleep_2am_4am",
  fallAsleepUnder30min: "fall_asleep_under_30min",
  sleep6to8Hours: "sleep_6_8_hours",

  // Women’s health
  ageFirstPeriod: "age_first_period",
  mensesPmsPain: "menses_pms_pain",
  cycleSecondHalfSymptoms: "cycle_second_half_symptoms",
  yeastUtiInfections: "yeast_uti_infections",
  birthControlPills: "birth_control_pills",
  conceptionPregnancyProblems: "conception_pregnancy_problems",
  hormoneReplacementHerbs: "hormone_replacement_herbs",

  // Sexual / mental health
  sexualFunctioningConcerns: "sexual_functioning_concerns",
  sexualPartnersPastYear: "sexual_partners_past_year",
  generalMoods: "general_moods",
  energyLevelScale: "energy_level_scale",
  bestPointInLife: "best_point_in_life",

  // Support / goals
  roleInWellnessPlan: "role_in_wellness_plan",
  familyFriendsSupport: "family_friends_support",
  supportivePersonDietaryChange: "supportive_person_dietary_change",
  otherUsefulInformation: "other_useful_information",
  healthGoalsAspirations: "health_goals_aspirations",
  whyAchieveGoals: "why_achieve_goals",

  // Metadata
  createdAt: "created_at",
  updatedAt: "updated_at",
};

export const mapFormValuesToHealthHistoryPayload = (
  values: Partial<FormValues>
): Partial<HealthHistory> => {
  const payload: Partial<HealthHistory> = {};

  for (const [formKey, value] of Object.entries(values)) {
    const apiKey = FORM_TO_API_FIELD_MAP[formKey];
    if (!apiKey) continue;

    (payload as any)[apiKey] = value;
  }

  return prune(payload as Record<string, any>);
};
