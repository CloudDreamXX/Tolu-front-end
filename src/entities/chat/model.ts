export interface MessageUser {
  id: string;
  email: string;
  name: string;
}

export interface ChatItemModel {
  id: string;
  name: string;
  avatar_url: string;
  type: string;
  lastMessageAt: string;
  unreadCount: number;
  lastMessage: ChatMessageModel | null;
  participants: MessageUser[];
}

export interface ServerChatItemModel {
  chat_id: string;
  name: string;
  avatar_url: string;
  chat_type: string;
  last_message_at: string;
  unread_count: number;
  last_message: ChatMessageModel | null;
  participants: MessageUser[];
}

export interface DetailsChatItemModel
  extends Omit<ServerChatItemModel, "participants"> {
  description: string | null;
  participants: Participant[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  user: MessageUser;
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

export type FetchAllChatsResponse = ServerChatItemModel[];
export type CreateChatResponse = ServerChatItemModel;
export type FetchChatDetailsResponse = DetailsChatItemModel;

export interface FetchChatMessagesResponse {
  messages: ChatMessageModel[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

export type SendMessageResponse = ChatMessageModel;

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
  message: ChatMessageModel;
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

export interface ChatMessageModel {
  id: string;
  chat_id: string;
  content: string;
  created_at: string;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  file_type: string | null;
  sender?: MessageUser;
  files?: UploadChatFileResponse[];
}

export type WebSocketMessage =
  | {
      type: "new_message";
      data: ChatMessageModel;
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
  sender: MessageUser;
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

export interface SendChatNotePayload {
  noteData: {
    chat_id?: string;
    target_user_id?: string;
    title: string;
    content?: string;
  };
  file?: File;
}

export interface ChatNoteResponse {
  id: string;
  chat_id: string;
  title: string;
  content: string;
  file_info: {
    file_url: string;
    file_name: string;
    file_size: number;
    file_type: string;
    file_category: string;
  };
  created_at: string;
  updated_at: string;
}

export interface GetAllChatNotesResponse {
  notes: ChatNoteResponse[];
  total: number;
}

export interface UpdateChatNotePayload {
  noteData: {
    title: string;
    content: string;
    remove_file?: boolean;
  };
  file?: File;
}
