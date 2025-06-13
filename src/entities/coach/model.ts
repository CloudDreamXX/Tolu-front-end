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
      recent_items: string[];
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

export interface ClientsResponse {
  clients: Client[];
}

export interface Client {
  client_id: string;
  name: string;
  gender: string;
  last_activity: string | null;
  learning_now: string[];
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
