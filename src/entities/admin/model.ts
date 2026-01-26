import { Folder } from "entities/client";
import { BaseResponse, PaginatedResponse } from "entities/models";

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
export interface AdminFeedbackResponse {
  coach_feedback: CoachFeedbackSection;
  client_feedback: ClientFeedbackSection;
  pagination: FeedbackPagination;
  summary: FeedbackSummary;
}

export type AdminGetFeedbackResponse =
  PaginatedResponse<AdminFeedbackResponse>;

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

export type AdminFoldersStructureResponse =
  BaseResponse<AdminFoldersData>;

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  signup_date: string | null;
  role: number;
}

export interface AdminUsersResponse {
  users: AdminUser[];
}
export interface AdminFeedbackResponse {
  coach_feedback: CoachFeedbackSection;
  client_feedback: ClientFeedbackSection;
}

export interface AdminFolders {
  ai_generated?: Folder[];
  in_review?: Folder[];
  approved?: Folder[];
  published?: Folder[];
  archived?: Folder[];
  flagged?: Folder[];
}

export interface AdminFoldersData {
  folders: AdminFolders;
  admin_access: boolean;
  filtered_by_user: boolean;
  target_user_id: string | null;
}

export interface UnpublishedContentItem {
  id: string;
  title: string;
  creator_id: string;
  unpublished_by: string;
  unpublished_at: string;
}

export type UnpublishedContentResponse =
  PaginatedResponse<UnpublishedContentItem[]>;

export interface AdminContentActionPayload {
  content_id: string;
  action: "unpublish" | "approve" | "reject";
  admin_comment?: string;
  unpublish_reason?: string;
}

export interface ManageContentResponse {
  content: {
    id: string;
    status: string;
    folder_name: string;
    email_notification_sent: boolean;
  };
  action_performed: {
    action: string;
    performed_by: string;
    performed_at: string;
    moved_to_folder: string;
  };
}

