export interface ContentItemResponse {
  id: string;
  title: string;
  query: string;
  content: string;
  created_at: string;
  original_folder_id: string;
  original_folder_name: string;
  original_instructions: string | null;
  original_files: any[];
  shared_with: {
    total_shares: number;
    clients: any[];
  };
  revenue_generated: string;
  read_count: number;
  saved_count: number;
  feedback_count: string;
  comments: string;
  social_media_shares: string;
  creator_name: string;
  creator_id: string;
  published_date: string;
}

export interface ContentToEdit {
  content_id: string;
  new_title: string;
  new_content: string;
  new_query: string;
}

type QuizAttempt = {
  question_id: string;
  answer: string;
  is_correct: boolean;
};

type StatusData = {
  status: "read" | "saved_for_later" | "currently_reading";
  is_archived?: boolean;
  current_card_number?: string;
  quiz_attempt?: QuizAttempt;
};

export type AdminStatus = {
  content_id: string;
  status: string;
};

export type ContentStatus = {
  content_id: string;
  status_data: StatusData;
};
export interface Feedback {
  source_id: string;
  satisfaction_score: string;
  comments: string;
  content_preference: string;
  location: string;
  feedback_type: string;
  membership_type: string;
  severity: string;
  device: string;
}

export interface FeedbackResponse {
  id: string;
  satisfaction_score: number;
  comments: string;
  content_preference: string;
  created_at: string;
};

export interface ContentHashtags {
  content_id: string;
  hashtags: string[];
}

export type YesNo = "Yes" | "No";

export interface CreatorProfile {
  creator_id: string;
  basic_info: BasicInfo;
  detailed_profile: DetailedProfile;
  content_statistics: ContentStatistics;
}

export interface BasicInfo {
  name: string;
  email: string;
  role_id: number;
  role_name: string;
}

export interface DetailedProfile {
  personal_info: PersonalInfo;
  professional_info: ProfessionalInfo;
  about: AboutInfo;
  practice_info: PracticeInfo;
  tools_methods: ToolsMethods;
}

export interface PersonalInfo {
  first_name: string;
  last_name: string;
  bio: string;
  alternate_name: string;
  calculated_age: number;
  gender: string;
  location: string;
  timezone: string;
  headshot_url: string;
}

export interface ProfessionalInfo {
  credentials: string;
  years_experience: number;
  certifications: string[];
  expertise_areas: string[];
  practitioner_types: string[];
  primary_niches: string[];
  school: string;
  verified_credentials: string[];
}

export interface AboutInfo {
  personal_story: string;
  testimonials: string[];
  content_specialties: string[];
}

export interface PracticeInfo {
  recent_client_count: string;
  target_client_count: string;
  uses_labs_supplements: YesNo | string;
  business_challenges: string[];
  uses_ai: YesNo | string;
  practice_software: string;
  supplement_method: string;
}

export interface ToolsMethods {
  biometrics_monitoring: YesNo | string;
  lab_ordering: YesNo | string;
  supplement_ordering: YesNo | string;
}

export interface ContentStatistics {
  total_content: number;
  average_rating: number;
  total_reads: number;
  total_saves: number;
}

export interface ShareViaEmail {
  content_id: string;
  recipient_email: string;
  personal_message: string;
}

export interface ShareWithCoach {
  content_id: string;
  coach_id: string;
  message: string;
}

export interface LibraryContentStatus {
  id: string;
  status: string;
  reviewer_comment?: string;
}

export interface QuizQuestion {
  question_id: string;
  answer: string;
  is_correct: boolean;
  attempted_at: string;
}

export interface QuizResult {
  content_id: string;
  total_questions: number;
  correct_questions: number;
  score_percent: number;
  questions: QuizQuestion[];
}

