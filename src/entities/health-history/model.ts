export interface HealthHistory {
  id?: string;
  user_id?: string;

  age?: string;
  birth_date?: string;
  gender_at_birth?: string;
  chosen_gender_after_birth?: string;
  breastfed_or_bottle?: string;
  birth_delivery_method?: string;
  height?: string;
  blood_type?: string;
  current_weight_lbs?: string;
  ideal_weight_lbs?: string;
  weight_one_year_ago_lbs?: string;
  birth_weight_lbs?: string;
  birth_order_siblings?: string;
  family_living_situation?: string;
  partner_gender_at_birth?: string;
  partner_chosen_gender?: string;
  children?: string;
  exercise_recreation?: string;

  lived_traveled_outside_us?: string;
  recent_major_life_changes?: string;
  work_school_time_off?: string;

  trauma_death_family?: TraumaEvent;
  trauma_death_accident?: TraumaEvent;
  trauma_sexual_physical_abuse?: TraumaEvent;
  trauma_emotional_neglect?: TraumaEvent;
  trauma_discrimination?: TraumaEvent;
  trauma_life_threatening_accident?: TraumaEvent;
  trauma_life_threatening_illness?: TraumaEvent;
  trauma_robbery_mugging?: TraumaEvent;
  trauma_witness_violence?: TraumaEvent;
  trauma_additional_notes?: string;

  main_health_concerns?: string;
  when_first_experienced?: string;
  how_dealt_with_concerns?: string;
  success_with_approaches?: string;
  other_health_practitioners?: string;
  surgical_procedures?: string;
  antibiotics_infancy_childhood?: string;
  antibiotics_teen?: string;
  antibiotics_adult?: string;
  current_medications?: string;
  current_supplements?: string;
  family_similar_problems?: string;
  foods_avoid_symptoms?: string;
  immediate_symptoms_after_eating?: string;
  delayed_symptoms_after_eating?: string;
  food_cravings?: string;
  diet_at_onset?: string;
  known_food_allergies?: string;
  regular_food_consumption?: string[];
  special_diet?: string[];
  home_cooked_percentage?: number;
  diet_relationship_notes?: string;

  bowel_movement_frequency?: string;
  bowel_movement_consistency?: string[];
  bowel_movement_color?: string[];
  intestinal_gas?: string;
  food_poisoning_history?: string;

  condition_ibs?: MedicalCondition;
  condition_crohns?: MedicalCondition;
  condition_ulcerative_colitis?: MedicalCondition;
  condition_gastritis_ulcer?: MedicalCondition;
  condition_gerd?: MedicalCondition;
  condition_celiac?: MedicalCondition;
  condition_sibo?: MedicalCondition;
  condition_gut_infections?: MedicalCondition;
  condition_dysbiosis?: MedicalCondition;
  condition_leaky_gut?: MedicalCondition;
  condition_food_allergies?: MedicalCondition;
  condition_gallstones?: MedicalCondition;
  condition_absorption_issues?: MedicalCondition;
  gastrointestinal_dates?: string;

  condition_type1_diabetes?: MedicalCondition;
  condition_type2_diabetes?: MedicalCondition;
  condition_hypoglycemia?: MedicalCondition;
  condition_metabolic_syndrome?: MedicalCondition;
  condition_insulin_resistance?: MedicalCondition;
  condition_hypothyroidism?: MedicalCondition;
  condition_hyperthyroidism?: MedicalCondition;
  condition_hashimotos?: MedicalCondition;
  condition_graves_disease?: MedicalCondition;
  condition_endocrine_problems?: MedicalCondition;
  condition_pcos?: MedicalCondition;
  condition_infertility?: MedicalCondition;
  condition_weight_gain?: MedicalCondition;
  condition_weight_loss?: MedicalCondition;
  condition_weight_fluctuations?: MedicalCondition;
  condition_eating_disorder?: MedicalCondition;
  hormones_metabolic_dates?: string;

  condition_heart_attack?: MedicalCondition;
  condition_heart_disease?: MedicalCondition;
  condition_stroke?: MedicalCondition;
  condition_elevated_cholesterol?: MedicalCondition;
  condition_arrhythmia?: MedicalCondition;
  condition_hypertension?: MedicalCondition;
  condition_rheumatic_fever?: MedicalCondition;
  condition_mitral_valve_prolapse?: MedicalCondition;
  cardiovascular_dates?: string;

  condition_lung_cancer?: MedicalCondition;
  condition_breast_cancer?: MedicalCondition;
  condition_colon_cancer?: MedicalCondition;
  condition_ovarian_cancer?: MedicalCondition;
  condition_prostate_cancer?: MedicalCondition;
  condition_skin_cancer_melanoma?: MedicalCondition;
  condition_skin_cancer_squamous_basal?: MedicalCondition;
  cancer_dates?: string;

  condition_kidney_stones?: MedicalCondition;
  condition_gout?: MedicalCondition;
  condition_interstitial_cystitis?: MedicalCondition;
  condition_frequent_uti?: MedicalCondition;
  condition_sexual_dysfunction?: MedicalCondition;
  condition_frequent_yeast?: MedicalCondition;
  genital_urinary_dates?: string;

  condition_osteoarthritis?: MedicalCondition;
  condition_fibromyalgia?: MedicalCondition;
  condition_chronic_pain?: MedicalCondition;
  condition_sore_muscles_joints?: MedicalCondition;
  musculoskeletal_dates?: string;

  condition_chronic_fatigue?: MedicalCondition;
  condition_rheumatoid_arthritis?: MedicalCondition;
  condition_lupus?: MedicalCondition;
  condition_raynauds?: MedicalCondition;
  condition_psoriasis?: MedicalCondition;
  condition_mctd?: MedicalCondition;
  condition_poor_immune?: MedicalCondition;
  condition_food_allergies_immune?: MedicalCondition;
  condition_environmental_allergies?: MedicalCondition;
  condition_chemical_sensitivities?: MedicalCondition;
  condition_latex_allergy?: MedicalCondition;
  condition_hepatitis?: MedicalCondition;
  condition_lyme?: MedicalCondition;
  condition_chronic_infections?: MedicalCondition;
  immune_inflammatory_dates?: string;

  condition_asthma?: MedicalCondition;
  condition_chronic_sinusitis?: MedicalCondition;
  condition_bronchitis?: MedicalCondition;
  condition_emphysema?: MedicalCondition;
  condition_pneumonia?: MedicalCondition;
  condition_sleep_apnea?: MedicalCondition;
  condition_frequent_colds_flus?: MedicalCondition;
  respiratory_dates?: string;

  condition_eczema?: MedicalCondition;
  condition_psoriasis_skin?: MedicalCondition;
  condition_dermatitis?: MedicalCondition;
  condition_hives?: MedicalCondition;
  condition_rash_undiagnosed?: MedicalCondition;
  condition_acne?: MedicalCondition;
  condition_skin_cancer_melanoma_dup?: MedicalCondition;
  condition_skin_cancer_squamous_basal_dup?: MedicalCondition;
  skin_conditions_dates?: string;

  condition_depression?: MedicalCondition;
  condition_anxiety?: MedicalCondition;
  condition_bipolar?: MedicalCondition;
  condition_schizophrenia?: MedicalCondition;
  condition_headaches?: MedicalCondition;
  condition_migraines?: MedicalCondition;
  condition_add_adhd?: MedicalCondition;
  condition_autism?: MedicalCondition;
  condition_mild_cognitive_impairment?: MedicalCondition;
  condition_memory_problems?: MedicalCondition;
  condition_parkinsons?: MedicalCondition;
  condition_multiple_sclerosis?: MedicalCondition;
  condition_als?: MedicalCondition;
  condition_seizures?: MedicalCondition;
  condition_alzheimers?: MedicalCondition;
  condition_concussion_tbi?: MedicalCondition;
  neurologic_mood_dates?: string;

  condition_anemia?: MedicalCondition;
  condition_chicken_pox?: MedicalCondition;
  condition_german_measles?: MedicalCondition;
  condition_measles?: MedicalCondition;
  condition_mononucleosis?: MedicalCondition;
  condition_mumps?: MedicalCondition;
  condition_whooping_cough?: MedicalCondition;
  condition_tuberculosis?: MedicalCondition;
  condition_genetic_variants?: MedicalCondition;
  miscellaneous_dates?: string;

  other_conditions_symptoms?: string;

  freq_memory_impairment?: YesNoSometimes;
  freq_shortened_focus?: YesNoSometimes;
  freq_coordination_balance?: YesNoSometimes;
  freq_lack_inhibition?: YesNoSometimes;
  freq_poor_organization?: YesNoSometimes;
  freq_time_management?: YesNoSometimes;
  freq_mood_instability?: YesNoSometimes;
  freq_speech_word_finding?: YesNoSometimes;
  freq_brain_fog?: YesNoSometimes;
  freq_lower_effectiveness?: YesNoSometimes;
  freq_judgment_problems?: YesNoSometimes;

  chemical_toxic_exposure?: string;
  odor_sensitivity?: string;
  secondhand_smoke_exposure?: string;
  mold_exposure?: string;

  last_dentist_visit?: string;
  dentist_health_discussion?: string;
  oral_dental_regimen?: string;
  mercury_amalgams?: string;
  root_canals?: string;
  oral_health_concerns?: string;
  oral_health_additional_notes?: string;

  junk_food_binge_dieting?: string;
  substance_use_history?: string;
  stress_handling?: string;

  satisfied_with_sleep?: string;
  stay_awake_all_day?: string;
  asleep_2am_4am?: string;
  fall_asleep_under_30min?: string;
  sleep_6_8_hours?: string;

  age_first_period?: string;
  menses_pms_pain?: string;
  cycle_second_half_symptoms?: string;
  yeast_uti_infections?: string;
  birth_control_pills?: string;
  conception_pregnancy_problems?: string;
  hormone_replacement_herbs?: string;

  sexual_functioning_concerns?: string;
  sexual_partners_past_year?: string;

  general_moods?: string;
  energy_level_scale?: string;
  best_point_in_life?: string;

  role_in_wellness_plan?: string;
  family_friends_support?: string;
  supportive_person_dietary_change?: string;
  other_useful_information?: string;
  health_goals_aspirations?: string;
  why_achieve_goals?: string;

  created_at?: string;
  updated_at?: string;
}

export type YesNo = "yes" | "no";
export type YesNoSometimes = "yes" | "no" | "sometimes";

export interface MedicalCondition {
  status: "past" | "now" | "never";
  date?: string; // YYYY-MM-DD
}

export interface TraumaEvent {
  status: "yes" | "no";
  date_from?: string; // YYYY-MM-DD
  date_to?: string;   // YYYY-MM-DD | "current"
}

export interface LabResultFile {
  filename: string;
  content: string;
  content_type: string;
  upload_timestamp: string;
}

export type UploadedFile = {
  filename: string;
  content_type: string;
  upload_timestamp: string;
  original_filename: string;
};

export interface HealthHistoryResponse {
  health_history: HealthHistory;
}

export interface GetLabReportRequest {
  filename: string;
  client_id?: string | null;
}

export interface Medication {
  id: string;
  chat_id: string;
  title?: string;
  content: string;
  file_info: {
    file_url: string;
    file_name: string;
    file_size: number;
    file_type: string;
    file_category: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Supplement {
  id: string;
  chat_id: string;
  title?: string;
  content: string;
  file_info: {
    file_url: string;
    file_name: string;
    file_size: number;
    file_type: string;
    file_category: string;
  };
  created_at: string;
  updated_at: string;
}

export interface GetMedicationsParams {
  chatId: string;
  limit?: number;
  offset?: number;
}

export interface GetSupplementsParams {
  chatId: string;
  limit?: number;
  offset?: number;
}

export interface CreateMedicationParams {
  medicationData: {
    chat_id?: string;
    target_user_id?: string;
    title?: string;
    content: string;
  };
  file?: File;
}

export interface CreateSupplementParams {
  supplementData: {
    chat_id?: string;
    target_user_id?: string;
    title?: string;
    content: string;
  };
  file?: File;
}

export interface UpdateMedicationParams {
  medicationId: string;
  medicationData: {
    title?: string;
    content?: string;
    remove_file?: boolean;
  };
  file?: File;
}

export interface UpdateSupplementParams {
  supplementId: string;
  supplementData: {
    title?: string;
    content?: string;
    remove_file?: boolean;
  };
  file?: File;
}
