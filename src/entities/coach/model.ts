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
  permission_type?: string;
}

export interface AIChatMessage {
  user_prompt: string;
  is_new: boolean;
  chat_id?: string | null;
  regenerate_id?: string | null;
  chat_title: string;
  instruction?: string | null;
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
