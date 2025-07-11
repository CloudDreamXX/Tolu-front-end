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
  permission_type: "independent" | "with_help";
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
  created_at: string;
  read_count: number;
  saved_for_later_count: number;
  author_name: string;
}

export interface Folder {
  id: string;
  name: string;
  description: string;
  creator_id: string;
  created_at: string;
  total_content_items: number;
  content: ContentItem[];
  subfolders?: Folder[];
}

export interface FoldersResponse {
  folders: Folder[];
}
