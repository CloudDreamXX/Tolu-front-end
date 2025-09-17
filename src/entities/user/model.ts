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
  onboarding_filled?: string;
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
  languages: string[];
}

export interface ProfileCredentials {
  verified: string[];
  years_experience: number | null;
  certifications: string[];
}
export interface Testimonial {
  [key: string]: unknown;
}

export interface ReferFriendRequest {
  name?: string;
  age?: number;
  gender?: string;
  health_concern?: string;
  diagnosed_condition?: string;
  email: string;
  goal?: string;
  phone?: string;
}

export interface OnboardClient {
  profile: {
    basic_info: ProfileBasicInfo;
    background: ProfileBackground;
    goals_values: ProfileGoalsValues;
    preferences: ProfilePreferences;
    metadata: ProfileMetadata;
  };
}

export interface ProfileBasicInfo {
  age: number;
  language: string[];
  date_of_birth: string;
  ai_experience: "yes" | "no" | "not_sure";

  country?: string;
  gender?: string;
  menopause_status?: string;
}

export interface ProfileBackground {
  occupation?: string;
}

export interface ProfileGoalsValues {
  important_values: string[];
  support_network: string[];

  main_goal?: string;
  obstacles?: string;
}

export interface ProfilePreferences {
  personality_type?: string;
  readiness_for_change?: string;
  [key: string]: unknown;
}

export interface ProfileMetadata {
  created_at: string;
  updated_at: string;
}
