//TODO: replace with actual model from the database
// This is a placeholder for the actual models
export interface IFolder {
  id: string;
  name: string;
  documents: IDocument[];
  status: FolderStatus;
  reviewers?: string[];
  files?: string[];
  createdAt: string;
  updatedAt: string;
  instructions?: string[];
  clients?: string[];
}

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
  reviewers?: string[];
  folderId: string;
  createdAt: string;
}

export type FolderStatus = "ready-to-publish" | "archived" | "deleted";

export type ReviewStatus =
  | "waiting"
  | "second-review"
  | "under-review"
  | "ready-to-publish";

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
