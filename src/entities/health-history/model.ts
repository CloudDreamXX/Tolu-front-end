export interface HealthHistory {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  age: number;
  gender: string;
  height: string;
  weight: string;

  current_health_concerns: string;
  diagnosed_conditions: string;
  medications: string;
  supplements: string;
  allergies_intolerances: string;
  family_health_history: string;
  specific_diet: string;
  diet_pattern: string;
  kind_of_food: string;
  eat_decision: string;
  cook_at_home: string;
  takeout_food: string;
  exercise_habits: string;
  sleep_quality: string;
  stress_levels: string;
  energy_levels: string;
  menstrual_cycle_status: string;
  hormone_replacement_therapy: string;
  fertility_concerns: string;
  birth_control_use: string;
  blood_sugar_concerns: string;
  digestive_issues: string;
  recent_lab_tests: boolean;
  lab_results_file: string | null;
  health_goals: string;
  why_these_goals: string;
  desired_results_timeline: string;
  health_approach_preference: string;
  privacy_consent: boolean;
  follow_up_recommendation: string | null;
  recommendation_destination: string;
}

export interface HealthHistoryResponse {
  health_history: HealthHistory;
}

export interface HealthHistoryPostData {
  age: number;
  gender: string;
  height: string;
  weight: string;
  current_health_concerns: string;
  diagnosed_conditions: string;
  medications?: string;
  supplements: string;
  allergies_intolerances: string;
  family_health_history: string;
  specific_diet?: string;
  exercise_habits?: string;
  eat_decision: string;
  cook_at_home: string;
  takeout_food: string;
  kind_of_food: string;
  diet_pattern: string;
  sleep_quality: string;
  stress_levels: string;
  energy_levels: string;
  menstrual_cycle_status: string;
  hormone_replacement_therapy: string;
  fertility_concerns: string;
  birth_control_use: string;
  blood_sugar_concerns?: string;
  digestive_issues?: string;
  recent_lab_tests: boolean;
  health_goals: string;
  why_these_goals: string;
  desired_results_timeline: string;
  health_approach_preference: string;
  privacy_consent: boolean;
  follow_up_recommendations: string;
  recommendation_destination?: string;
}
