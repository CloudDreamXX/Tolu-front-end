export interface AiSearchRequest {
  chat_message: string;
  image?: File;
  pdf?: File;
}

export interface UpdateChatTitleRequest {
  chat_id: string;
  new_title: string;
}

export interface SearchHistoryParams {
  client_id?: string | null;
  managed_client_id?: string | null;
}

export interface SearchResult {
  id: string;
  content: string;
  timestamp: string;
  chat_id: string;
  title?: string;
}

export interface ChatSession {
  chat_id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  filename: string;
  file_type: "image" | "pdf";
  url: string;
}

export interface SearchHistory {
  results: SearchResult[];
  total_count: number;
  page: number;
  page_size: number;
}

export interface DeleteChatResponse {
  success: boolean;
  message: string;
  deleted_count: number;
  chat_id: string;
}

export interface SearchState {
  searchResults: SearchResult[];
  searchHistory: SearchHistory | null;
  currentSession: ChatSession | null;
  loading: boolean;
  error: string | null;
  isSearching: boolean;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ValidationErrorResponse {
  detail: ValidationError[];
}

export interface SearchResultResponseItem {
  id: string;
  user_id: string;
  chat_id: string;
  query: string;
  answer: string;
  liked: boolean;
  reported: number;
  feedback: string;
  active: boolean;
  created_at: string;
  chat_title: string;
}

export interface SearchResultResponse {
  search_results: SearchResultResponseItem[];
}
