export interface InviteClientPayload {
  full_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  primary_health_challenge: string;
  connection_source: string;
  working_duration: string;
  is_primary_coach: string;
  focus_areas: string[];
  tolu_benefit: string;
  collaborative_usage: string;
  permission_type: string;
}

export interface ClientProfile {
  client_info: {
    id: string;
    name: string;
    gender: string;
    last_activity: string;
    chief_concerns: string;
    recent_updates: string;
    cycle_status: string;
    menopause_status: string;
    learning_now: {
      total_shared: number;
      recent_items: RecentItems[];
    };
    recent_interventions: string;
    recent_labs: string;
  };
  health_profile: {
    intakes: {
      challenges: string;
      symptoms: string;
    };
    health_timeline: {
      diagnosis: string;
      medication: string;
    };
  };
  personal_insights: any;
  labs: any;
}

export interface RecentItems {
  content_id: string;
  shared_at: string;
  title: string;
}

export interface ClientsResponse {
  clients: Client[];
}

export interface Client {
  client_id: string;
  name: string;
  gender: string;
  last_activity: string | null;
  learning_now: LearningNow[];
  status: string;
}

export interface LearningNow {
  content_id: string;
  shared_at: string;
  title: string;
}

export interface GetClientInfoResponse {
  client: ClientDetails;
}

export interface ClientDetails {
  id?: string;
  full_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  primary_health_challenge: string;
  connection_source: string;
  working_duration: string;
  is_primary_coach: string;
  focus_areas: string[];
  tolu_benefit: string;
  collaborative_usage: string;
  created_at?: string;
  permission_type: string;
}

export interface AIChatMessage {
  user_prompt: string;
  is_new: boolean;
  chat_id?: string | null;
  regenerate_id?: string | null;
  chat_title: string;
  instructions: string | null;
}

export interface Status {
  id: string;
  status:
    | "Raw"
    | "Ready for Review"
    | "Waiting"
    | "Second Review Requested"
    | "Ready to Publish"
    | "Live"
    | "Archived";
}

export interface IContentMessage {
  id: string;
  title: string;
  chat_id: string;
  creator_id: string;
  created_at: string;
  reviewer_name: string | null;
  price: string | null;
  status: string | null;
}

export interface ISessionResult {
  id: string;
  creator_id: string;
  chat_id: string;
  folder_id: string;
  query: string;
  content: string;
  created_at: string;
  updated_at: string | null;
  title: string;
  messages: IContentMessage[];
}

export interface ISessionResponse {
  search_results: ISessionResult[];
}

export interface RateContent {
  content_id: string;
  rating: number;
  thumbs_down: boolean;
  comment: string;
}

export interface ShareContentData {
  content_id: string;
  client_id: string;
}

export interface Share {
  client_id: string;
  client_name: string;
  shared_at: string;
}

export interface SharedContent {
  content_id: string;
  shares: Share[];
  total_shares: number;
}

export interface Content {
  content: string;
  created_at: string;
  id: string;
  query: string;
  title: string;
}

export interface ContentResponse {
  content: Content[];
  number_of_content: number;
}

export interface NewChatTitle {
  chat_id: string;
  new_title: string;
}

export interface FmpShareRequest {
  user_id: string;
  tracking_date: string;
}

export interface Fmp {
  food_eaten: string;
  mood: string;
  poop: string;
}

export interface FmpTracker {
  morning: Fmp;
  mid_morning: Fmp;
  lunch: Fmp;
  snack: Fmp;
  dinner: Fmp;
}

export interface Medication {
  id?: string;
  name?: string;
  dosage?: string;
  prescribed_date?: string;
  prescribed_by?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MedicationOperation {
  action?: string;
  operation?: string;
  medication?: Medication;
  medication_id?: string;
}

export interface ComprehensiveProfile {
  family_health_history?: string;
  diagnosed_conditions?: string;
  medications?: string;
  supplements?: string;
  current_health_concerns?: string;
  support_system?: string;
  lifestyle_information?: string;
  specific_diet?: string;
  exercise_habits?: string;
  stress_levels?: string;
  energy_levels?: string;
  lifestyle_limitations?: string;
  edit_reason?: string;
  client_story?: ClientStoryInfo;
  medication_operations?: MedicationOperation[];
}

export interface UpdateHealthHistoryRequest {
  client_id: string;
  custom_message: string;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  location: string | null;
}

export interface HealthSummary {
  primary_complaint: string | null;
  working_with_client_since: string | null;
  client_age: number | null;
  menopause_cycle_status: string | null;
  working_on_now: string[];
  recent_labs: string | null;
  learning_now: {
    content_id: string;
    shared_at: string;
    title: string;
  }[];
  tracking: string[];
  personal_insights: {
    date: string;
    note: string;
  }[];
}

export interface ClientStoryInfo {
  genetic_influences: {
    notes?: string;
  };
  pivotal_incidents: {
    year?: string | number | undefined;
    description?: string | undefined;
  }[];
  symptom_influencers: Record<string, string>;
}

export interface SymptomsInfo {
  hormones_and_neurotransmitters_reported_symptoms: string[];
  mind_spirit_emotions_community_reported_state: string | null;
}

export interface MedicationInfo {
  medication_id: string;
  name: string;
  dosage: string;
  prescribed_date: string;
  prescribed_by: string;
  status: string;
}

export interface MedicationsAndSupplements {
  previous_medications: MedicationInfo[];
  current_medications: MedicationInfo[];
}

export interface BiometricsInfo {
  hrv: string | null;
  sleep_quality: string | null;
  movement_and_intensity: string | null;
  cycle_tracking: string | null;
  blood_pressure: string | null;
  fertility_tracking: string | null;
  glucose_tracking: string | null;
}

export interface HealthTimeline {
  genetic_health: string[];
  history_of_diagnosis: string[];
}

export interface LifestyleSkillsInfo {
  [key: string]: string | string[] | undefined;
}

export interface FoodMoodPoopJournal {
  [key: string]: any;
}

export type LabsInfo = Record<string, any>;

export interface ClientComprehensiveProfile {
  personal_info: PersonalInfo;
  health_summary: HealthSummary;
  food_mood_poop_journal: FoodMoodPoopJournal[];
  health_timeline: HealthTimeline;
  client_story: ClientStoryInfo;
  symptoms: SymptomsInfo;
  lifestyle_skills: LifestyleSkillsInfo;
  medications_and_supplements: MedicationsAndSupplements;
  biometrics: BiometricsInfo;
  labs: LabsInfo[];
}
export interface UpdateFolderRequest {
  folder_id: string;
  new_name?: string;
  parent_folder_id?: string | null;
  status?: string;
  instructions?: string;
  reviewer_ids?: string[];
  reviewer_ids_to_delete?: string[];
  files_to_delete?: number[];
}
