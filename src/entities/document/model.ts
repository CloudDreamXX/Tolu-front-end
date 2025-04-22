//TODO: replace with actual model from the database
// This is a placeholder for the actual document model
export interface IDocument {
  id: string;
  title: string;
  folder: string;
  attachedFiles?: string[];
  instructions?: string[];
  client?: string[];
  status: DocumentStatus;
  documentText?: string;
  userEngagement?: IUserEngagement;
  readyForReview?: boolean;
  reviewStatus?: ReviewStatus;
  reviewer?: string;
  folderId: string;
}

export type ReviewStatus = "waiting" | "second-review" | "under-review";

export type DocumentStatus =
  | "ai-generated"
  | "in-review"
  | "approved"
  | "rejected"
  | "published"
  | "archived";

export interface IUserEngagement {
  revenue: number;
  read: number;
  saved: number;
  feedback: number;
  comments: number;
  shares: number;
}
