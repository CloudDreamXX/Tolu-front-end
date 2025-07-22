export interface IDocumentResponse {
  id: string;
  title: string;
  query: string;
  content: string;
  created_at: string;

  original_folder_id: string;
  original_folder_name: string;
  original_instructions: string | null;
  original_files: string[];
  shared_with: {
    total_shares: number;
    clients: SharedClient[];
  };
  revenue_generated: string;
  read_count: number;
  saved_count: number;
  feedback_count: string;
  comments: string;
  social_media_shares: string;
  chat_id: string;
  status: string;
}

export interface IDocument {
  id: string;
  title: string;
  query: string;
  content: string;
  createdAt: string;
  originalFolderId: string;
  originalFolderName: string;
  originalInstructions?: string | null;
  originalFiles: string[];
  sharedWith: {
    totalShares: number;
    clients: SharedClient[];
  };
  revenueGenerated: string;
  readCount: number;
  savedCount: number;
  feedbackCount: string;
  comments: string;
  socialMediaShares: string;
  chatId: string;
  status: string;
}

export interface SharedClient {
  accepted_at: string;
  email: string;
  is_managed_client: boolean;
  name: string;
  share_type: "direct" | string;
  shared_at: string;
  status: "accepted" | string;
}

export interface ISharedWith {
  totalShares: number;
  clients: SharedClient[];
}
