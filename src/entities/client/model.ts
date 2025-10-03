export interface ClientInvitationInfo {
  client: ClientDetailsForInvite;
  invitation: InvitationMetadata;
}

export interface ClientDetailsForInvite {
  full_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  primary_health_challenge: string;
  focus_areas: string[];
}

export interface InvitationMetadata {
  permission_type: string;
  expires_at: string;
  practitioner_name: string;
}

export interface AcceptInvitePayload {
  token: string;
}

export interface AcceptInviteResponse {
  success: boolean;
  message: string;
}

export interface ContentItem {
  id: string;
  title: string;
  ai_title: string;
  created_at: string;
  read_count: number;
  saved_for_later_count: number;
  author_name: string;
  document_type: string;
  relevance_score: number;
  status: string;
  content_type: string;
}

export interface Folder {
  id: string;
  name: string;
  description: string;
  creator_id: string | null;
  created_at: string | null;
  total_content_items: number;
  reading_percentage: number;
  content: ContentItem[];
  subfolders?: Folder[];
  pagination: Pagination;
}

export interface Pagination {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface FoldersResponse {
  folders: Folder[];
  pagination: Pagination;
}

export interface RequestInvitePayload {
  email: string;
  coach_name?: string;
  message?: string;
}

export interface UserProfileUpdate {
  name?: string;
  email?: string;
  phone?: string;
  dob?: string;
  photo_url?: string;
  timezone?: string;
  gender?: string;
}
export interface Client {
  name: string;
  email: string;
  phone: string;
  dob: string;
  photo_url: string;
  timezone: string;
  gender: string;
  id: string;
  roleID: number;
  roleName: string;
  created_at: string;
  updated_at: string;
  last_symptoms_date: string | null;
}

export interface SharedCoachContentByContentIdResponse {
  content: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    shared_at: string;
  };
}

export interface CoachListItem {
  relationship_id: string;
  coach_id: string;
  basic_info?: { name?: string };
  profile?: { bio?: string; headshot_url?: string };
}

export interface GetCoachesResponse {
  coaches: CoachListItem[];
  total_coaches: number;
}
