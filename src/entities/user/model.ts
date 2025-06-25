export interface IUser {
  name: string;
  email: string;
  dob: string;
  password: string;
  type?: string;
  role: string;
  roleID?: number;
  location: string;
  num_clients: string;
  priority: string[];
  roleName: string;
}

export interface IRegisterUser {
  name: string;
  email: string;
  dob: string;
  password: string;
  phone_number: string;
  roleID: number;
}

export interface MenopauseSubmissionRequest {
  symptoms: string[];
  desired_health_change: string[];
  genetic_conditions: string[];
  helpful_management: string[];
  allergies_sensitivities: string[];
  menstrual_changes: string[];
}

export interface Symptom {
  id: string;
  name: string;
}

export interface SymptomsResponse {
  Symptoms: Symptom[];
}

export interface Recommendation {
  id: string;
  title: string;
  content: string;
  folder_id: string;
  created_at: string;
  hashtags: string[];
  read_count: number;
  saved_for_later_count: number;
}

export interface RecommendationsResponse {
  message: string;
  total_items: number;
  content: Recommendation[];
}
