export interface FileLibraryResponse {
  id: string;
  user_id: string;
  filename: string;
  original_filename: string;
  description: string;
  file_type: string;
  file_extension: string;
  size: number;
  upload_date: string;
  created_at: string;
  updated_at: string;
}

export interface FetchAllFilesLibraryPayload {
  page: number;
  per_page: number;
  search?: string | null;
  file_type?: string | null;
}
export interface FileLibraryFile {
  id: string;
  name: string;
  type: string;
  size: number;
  mime_type: string;
  created_at: string;
}
export interface FileLibraryFolder {
  id: string;
  name: string;
  files: FileLibraryFile[];
  subfolders: FileLibraryFolder[];
  type: string;
  created_at: string;
}
export interface FetchAllFilesLibraryResponse {
  root_folders: FileLibraryFolder[];
  root_files: FileLibraryFile[];
  total_files: number;
  total_folders: number;
  max_depth_retrieved: number;
  structure: string;
}

export type UpdateFileLibraryPayload = {
  name?: string;
  description?: string;
  folder_id?: string | null;
};

export type CreateFolderPayload = {
  name: string;
  description: string;
  parent_folder_id?: string;
};

export type UpdateFolderPayload = {
  name: string;
  description: string;
  parent_folder_id?: string;
};

export type FolderResponse = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  parent_folder_id: string;
  path: string;
  created_at: string;
  updated_at: string;
};

export type FolderItem =
  | ({ kind: "file" } & FileLibraryResponse)
  | ({ kind: "folder" } & FolderResponse);

export type MoveFilesPayload = {
  file_ids: string[];
  folder_id: string;
};
export interface FilesLibraryFolder {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  parent_folder_id: string | null;
  path: string;
  created_at: string;
  updated_at: string;
}
export interface FilesLibraryFile {
  id: string;
  user_id: string;
  folder_id: string | null;
  filename: string;
  original_filename: string;
  description: string | null;
  file_type: string;
  file_extension: string;
  size: number;
  upload_date: string;
  created_at: string;
  updated_at: string;
  folder_path: string;
}
export interface FolderContentsResponse {
  current_folder: FilesLibraryFolder;
  subfolders: FilesLibraryFolder[];
  files: FilesLibraryFile[];
  breadcrumbs: FilesLibraryFolder[];
}
