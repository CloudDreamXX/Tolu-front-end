import { BaseResponse } from "entities/models";

export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
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

export interface SignUpDetails {
  user: IRegisterUser;
  access_code: string;
}

export interface IRegisterUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  roleID: number;
  country: string;
  state?: string;
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
  target_targets: string;
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
  uses_ai: string | null;
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
  first_name?: string;
  last_name?: string;
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

export interface OnboardingStatus {
  onboarding_filled: boolean;
}

export interface ClientOnboarding {
  basic_info: {
    menopause_status: string;
    date_of_birth: string;
  };
  health_lifestyle: {
    health_conditions: string;
    stress_levels: string;
    weekly_meal_choice: string;
    support_network: string[];
    physical_activity: string;
    sleep_quality: string;
    hydration_levels: string;
  };
  goals_values: {
    main_goal: string;
    symptoms_severity: {
      [symptom: string]: number;
    };
  };
}

export interface ClientOnboardingResponse {
  profile: ClientOnboarding;
}

export interface CheckInviteResponse {
  has_pending_invite: boolean;
  email: string;
  user_exists: boolean;
  token: string | null;
}

export interface PasswordlessLoginRequest {
  email: string;
}

export interface VerifyPasswordlessLogin {
  email: string;
  code: string;
}

export interface AccessCodeRequest {
  access_code: string;
}

export interface User {
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  last_login: string | null;
  last_activity: string | null;
  roleID: number;
  roleName: string;
  onboarding_filled: boolean;
}

export interface LoginResponseData {
  accessToken: string;
  user: User;
}

export type LoginResponse = BaseResponse<LoginResponseData>;

