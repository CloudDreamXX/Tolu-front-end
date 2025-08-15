interface User {
  id: string;
  email: string;
  name: string;
}

export interface ChatItemModel {
  chat_id: string;
  name: string;
  avatar_url: string;
  chat_type: string;
  last_message_at: string;
  unread_count: number;
  last_message: ChatMessage | null;
  participants: User[];
}

export interface DetailsChatItemModel
  extends Omit<ChatItemModel, "participants"> {
  description: string | null;
  participants: Participant[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  user: User;
  role: string;
  joinedAt: string;
  lastReadAt: string;
  isActive: boolean;
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
}

export interface SendMessagePayload {
  content: string;
  message_type: string;
  reply_to_message_id?: string;
  chat_id?: string;
  target_user_id?: string;
}

export type FetchAllChatsResponse = ChatItemModel[];
export type CreateChatResponse = ChatItemModel;
export type FetchChatDetailsResponse = DetailsChatItemModel;

export interface FetchChatMessagesResponse {
  messages: ChatMessage[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

export type SendMessageResponse = ChatMessage;

export interface CreateChatPayload {
  request: {
    name: string;
    participant_ids: string[];
    description?: string;
  };
  avatar_image?: File | null;
}

export interface CreateChatGroupResponse extends DetailsChatItemModel {
  unread_count: number;
}

export type UpdateGroupChatResponse = CreateChatGroupResponse;

export interface UploadChatFileResponse {
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: string;
  message: ChatMessage;
}

export interface UpdateGroupChatPayload {
  request: {
    name: string;
    add_participant_ids?: string[];
    remove_participant_ids?: string[];
    description?: string;
  };
  avatar_image?: File | null;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  content: string;
  created_at: string;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  file_type: string | null;
  sender?: User;
  files?: UploadChatFileResponse[];
}

export type WebSocketMessage =
  | {
      type: "new_message";
      data: ChatMessage;
    }
  | {
      type: "message_deleted";
      data: { messageId: string };
    }
  | {
      type: "chat_updated";
      data: ChatUpdatedPayload;
    }
  | {
      type: "pong";
      data: any;
    };

export interface ChatUpdatedPayload {
  chat_id: string;
  name?: string;
  avatar_url?: string;
  last_message?: string;
}

export interface FileMessage {
  id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  file_type: string;
  message_type: "text" | "image" | "document" | "file";
  content: string;
  sender: User;
  created_at: string;
}

export interface FetchChatFilesResponse {
  files: FileMessage[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}
