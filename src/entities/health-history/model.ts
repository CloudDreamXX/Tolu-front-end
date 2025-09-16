export interface HealthHistory {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  age: number;
  gender: string;
  gender_identity: string;
  height: string;
  weight: string;
  ethnicity: string;
  language: string;
  location: string;
  household: string;
  education: string;
  religion: string;

  marital_status: string;
  job: string;
  no_children: string;
  menopause_status: string;

  current_health_concerns: string;
  other_challenges: string;
  tried_strategies: string;
  diagnosed_conditions: string;

  maternal_health_history: string;
  paternal_health_history: string;
  family_health_history: string;

  genetic_traits?: string | null;
  lifestyle_information: string;
  lifestyle_limitations: string;

  takeout_food: string;
  cook_at_home: string;
  specific_diet: string;
  exercise_habits: string;
  eat_decision: string;

  medications: string;
  supplements: string;
  allergies_intolerances: string;

  menstrual_cycle_status: string;
  sex_life: string;
  support_system: string;

  health_goals: string;
  why_these_goals: string;
  desired_results_timeline: string;
  health_approach_preference: string;

  kind_of_food: string;
  diet_pattern: string;
  sleep_quality: string;
  stress_levels: string;
  energy_levels: string;

  hormone_replacement_therapy: string;
  fertility_concerns: string;
  birth_control_use: string;
  blood_sugar_concerns: string;
  digestive_issues: string;

  recent_lab_tests: boolean;
  lab_results_file: string | null;

  privacy_consent: boolean;
  follow_up_recommendation: string | null;
  recommendation_destination: string;
}

export interface HealthHistoryResponse {
  health_history: HealthHistory;
}

export interface HealthHistoryPostData {
  age?: number;
  marital_status?: string;
  gender_identity?: string;
  location?: string;
  language?: string;
  ethnicity?: string;
  household?: string;
  job?: string;
  education?: string;
  religion?: string;
  no_children?: string;
  menopause_status?: string;
  current_health_concerns?: string;
  other_challenges?: string;
  tried_strategies?: string;
  diagnosed_conditions?: string;
  maternal_health_history?: string;
  paternal_health_history?: string;
  family_health_history?: string;
  lifestyle_information?: string;
  takeout_food?: string;
  cook_at_home?: string;
  specific_diet?: string;
  exercise_habits?: string;
  lifestyle_limitations?: string;
  medications?: string;
  menstrual_cycle_status?: string;
  sex_life?: string;
  support_system?: string;
  health_goals?: string;
  gender?: string;
  height?: string;
  weight?: string;
  supplements?: string;
  allergies_intolerances?: string;
  eat_decision?: string;
  kind_of_food?: string;
  diet_pattern?: string;
  sleep_quality?: string;
  stress_levels?: string;
  energy_levels?: string;
  hormone_replacement_therapy?: string;
  fertility_concerns?: string;
  birth_control_use?: string;
  blood_sugar_concerns?: string;
  digestive_issues?: string;
  recent_lab_tests?: boolean;
  why_these_goals?: string;
  desired_results_timeline?: string;
  health_approach_preference?: string;
  privacy_consent?: boolean;
  follow_up_recommendation?: string;
  recommendation_destination?: string;
}
