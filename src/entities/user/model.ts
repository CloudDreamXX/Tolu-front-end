export interface IUser {
  id: string;
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
  photo?: string;
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

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface UserOnboardingInfo {
  onboarding: Onboarding;
  profile: ProfileSection;
  onboarding_completed: boolean;
}
export interface Onboarding {
  id: string;
  agreements: Agreements;
  practitioner_info: PractitionerInfo;
  business_setup: BusinessSetup;
  client_tools: ClientTools;
}

export interface Agreements {
  coach_admin_privacy: boolean;
  independent_contractor: boolean;
  content_licensing: boolean;
  affiliate_terms: boolean;
  confidentiality: boolean;
  terms_of_use: boolean;
  media_release: boolean;
}

export interface PractitionerInfo {
  types: string[];
  niches: string[];
  school: string | null;
  license_files: string[];
  recent_clients: string | null;
  target_clients: string | null;
  uses_labs_supplements: boolean | null;
}
export interface BusinessSetup {
  challenges: string[];
  uses_ai: boolean | null;
  practice_software: string | null;
  supplement_method: string | null;
}
export interface ClientTools {
  biometrics: boolean | null;
  lab_ordering: boolean | null;
  supplement_ordering: boolean | null;
}
export interface ProfileSection {
  basic_info: BasicInfo;
  expertise: string[];
  credentials: ProfileCredentials;
  story: string | null;
  testimonials: Testimonial[];
  content_topics: string[];
}

export interface BasicInfo {
  first_name: string | null;
  last_name: string | null;
  name: string | null;
  alternate_name: string | null;
  email: string;
  phone: string;
  dob: string | null;
  credentials: string | null;
  location: string | null;
  timezone: string | null;
  headshot: string | null;
  roleID: number;
  roleName: string;
  age: number;
  gender: string;
  bio: string;
}

export interface ProfileCredentials {
  verified: string[];
  years_experience: number | null;
  certifications: string[];
}
export interface Testimonial {
  [key: string]: unknown;
}
