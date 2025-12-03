import { Folder } from "entities/client";

export interface User {
  id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  role: number;
  signup_date: string | null;
}

export interface UsersResponse {
  users: User[];
}
export interface AdminGetFeedbackResponse {
  coach_feedback: CoachFeedbackSection;
  client_feedback: ClientFeedbackSection;
  pagination: FeedbackPagination;
  summary: FeedbackSummary;
}

export interface PaginatedSection<T> {
  data: T[];
  total: number;
  count: number;
}

export type CoachFeedbackSection = PaginatedSection<CoachFeedbackItem>;
export type ClientFeedbackSection = PaginatedSection<ClientFeedbackItem>;

export interface CoachFeedbackItem {
  query: string;
  content: string;
  creator_id: string;
  coach_email: string;
  rated_at: string | null;
  rating: number | null;
  rating_comment: string | null;
  thumbs_down: boolean;
  thumbs_down_comment: string | null;
}

export interface ClientFeedbackItem {
  user_id: string;
  client_email: string;
  query: string;
  source_id: string;
  satisfaction_score: number;
  comments: string;
  created_at: string;
}

export interface FeedbackPagination {
  limit: number;
  offset: number;
  has_more_coach: boolean;
  has_more_client: boolean;
}

export interface FeedbackSummary {
  total_coach_feedback: number;
  total_client_feedback: number;
  combined_total: number;
}

export interface SendMessagePayload {
  content: string;
  message_type: string;
  target_group: string;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  admin_chat_id: string;
  recipients_count: number;
}

export interface AdminChatModel {
  id: string;
  name: string;
  chat_type: string;
  last_message_time: string;
  unread_count: number;
}

export interface ManageContentData {
  content_id: string;
  action: "unpublish" | "approve" | "reject";
  admin_comment?: string;
  unpublish_reason?: string;
}

export interface AdminFoldersStructureResponse {
  ai_generated?: Folder[];
  // in_review?: Folder[];
  approved?: Folder[];
  published?: Folder[];
  archived?: Folder[];
  flagged?: Folder[];
  pagination?: {
    current_page: number;
    page_size: number;
    total_content_items: number;
    applied_to_specific_folder: boolean;
    target_folder_id: string | null;
    admin_view: boolean;
    showing_all_users: boolean;
  };
  admin_access?: boolean;
  filtered_by_user?: boolean;
  target_user_id?: string | null;
}
