export interface ContentItemResponse {
  id: string;
  title: string;
  query: string;
  content: string;
  created_at: string;
  original_folder_id: string;
  original_folder_name: string;
  original_instructions: string | null;
  original_files: any[];
  shared_with: {
    total_shares: number;
    clients: any[];
  };
  revenue_generated: string;
  read_count: number;
  saved_count: number;
  feedback_count: string;
  comments: string;
  social_media_shares: string;
}

export interface ContentToEdit {
  content_id: string,
  new_title: string,
  new_content: string,
  new_query: string
}

export interface ContentStatus {
  content_id: string,
  status: "read" | "saved_for_later",
}
