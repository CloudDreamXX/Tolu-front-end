import { TableRow } from "pages/content-manager/library/models";
import { BaseResponse } from "entities/models";

export interface IFileNamesResponse {
  path: string;
  filename: string;
  content_type: string;
}

export interface IContentItemResponse {
  id: string;
  title: string;
  ai_title: string;
  chat_id: string;
  creator_id: string;
  created_at: string;
  reviewer_name: string | null;
  price: string | null;
  status: string | null;
  messages?: TableRow[];
  content_type: string | null;
}

export interface ISubfolderResponse {
  id: string;
  name: string;
  file_count: number;
  file_names: IFileNamesResponse[];
  custom_instructions: string | null;
  creator_id: string;
  created_at: string;
  reviewer_name: string | null;
  price: string | null;
  status: string | null;
  total_content_items: number;
  subfolders: ISubfolderResponse[];
  content: IContentItemResponse[];
  pagination: Pagination;
}

export interface IFolderItemResponse {
  id: string;
  folder_id?: string;
  name: string;
  file_count: number;
  file_names: IFileNamesResponse[];
  custom_instructions: string | null;
  creator_id: string;
  created_at: string;
  reviewer_name: string | null;
  price: string | null;
  status: string | null;
  total_content_items: number;
  subfolders: ISubfolderResponse[];
  content: IContentItemResponse[];
  parent_folder_id?: string;
  parent_folder_name?: string;
  description?: string;
  pagination: Pagination;
}

export type GetFolderItemResponse = BaseResponse<IFolderItemResponse>

export interface IFolderResponse {
  [key: string]: IFolderItemResponse[];
}

export interface IFileNames {
  path: string;
  filename: string;
  contentType: string;
}

export interface IMessage {
  id: string;
  title: string;
  ai_title: string;
  chat_id: string;
  creator_id: string;
  created_at: string;
  reviewer_name: string | null;
  price: string | null;
  status: string;
}

export interface IContentItem {
  id: string;
  title: string;
  aiTitle: string;
  chatId: string;
  creatorId: string;
  createdAt: string;
  reviewerName: string | null;
  price: string | null;
  status: string | null;
  messages?: TableRow[];
  contentType: string | null;
}

export interface ISubfolder {
  id: string;
  name: string;
  fileCount: number;
  fileNames: IFileNames[];
  customInstructions: string | null;
  creatorId: string;
  createdAt: string;
  reviewerName: string | null;
  price: string | null;
  status: string | null;
  totalContentItems: number;
  subfolders: ISubfolder[];
  content: IContentItem[];
  pagination: Pagination;
}

export interface IFolder {
  id: string;
  name: string;
  fileCount: number;
  fileNames: IFileNames[];
  customInstructions: string | null;
  creatorId: string;
  createdAt: string;
  reviewerName: string | null;
  price: string | null;
  status: string | null;
  totalContentItems: number;
  subfolders: ISubfolder[];
  content: IContentItem[];
  isSystemFolder?: boolean;
  parentFolderId?: string;
  parentFolderName?: string;
  description?: string;
  isRootFolder?: boolean;
  isSubfolder?: boolean;
  isEmpty?: boolean;
  pagination: Pagination;
}

export interface Pagination {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface IFolderMap {
  [key: string]: IFolder[];
}

export interface IFolderMock {
  id: string;
  name: string;
  documents: IDocumentMock[];
  status: FolderStatus;
  reviewers?: string[];
  files?: string[];
  createdAt: string;
  updatedAt: string;
  instructions?: string[];
  clients?: string[];
  author?: string;
}

export interface IDocumentMock {
  id: string;
  title: string;
  aiTitle: string;
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
  author?: string;
}

export type FolderStatus = "ready-to-publish" | "archived" | "published";

export type ReviewStatus =
  | "waiting"
  | "second-review"
  | "under-review"
  | "ready-to-publish"
  | "published";

export type DocumentStatus =
  | "ai-generated"
  // | "in-review"
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

export interface NewFolder {
  name: string;
  description: string;
  parent_folder_id: string;
}

export interface ContentItem {
  id: string;
  title: string;
  ai_title: string;
  status: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Folder {
  id: string;
  folder_id: string;
  name: string;
  is_system_folder: boolean;
  content: ContentItem[];
  subfolders: any[];
  created_at: string;
}

export interface FolderResponse {
  success: boolean;
  folder: Folder;
  message: string;
}

export const FOLDER_STATUS_MAPPING = {
  Raw: "AI-Generated",
  // "Ready for Review": "In-Review",
  // Waiting: "In-Review",
  // "Second Review Requested": "In-Review",
  "Ready to Publish": "Approved",
  Live: "Published",
  Archived: "Archived",
} as const;

export const ORDERED_STATUSES: (keyof typeof FOLDER_STATUS_MAPPING)[] = [
  "Raw",
  // "Ready for Review",
  // "Waiting",
  // "Second Review Requested",
  "Ready to Publish",
  "Live",
  "Archived",
];

export interface ContentToMove {
  content_id: string;
  target_folder_id: string;
}

export interface FolderToDelete {
  folder_id: string;
  force_delete: boolean;
}
