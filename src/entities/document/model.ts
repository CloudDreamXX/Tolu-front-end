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
    clients: string[];
  };
  revenue_generated: string;
  read_count: number;
  saved_count: number;
  feedback_count: string;
  comments: string;
  social_media_shares: string;
  chat_id: string;
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
    clients: string[];
  };
  revenueGenerated: string;
  readCount: number;
  savedCount: number;
  feedbackCount: string;
  comments: string;
  socialMediaShares: string;
  chatId: string;
}

export interface ISharedWith {
  totalShares: number;
  clients: string[];
}
