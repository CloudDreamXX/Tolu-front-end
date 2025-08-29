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

export interface FetchAllFilesLibraryResponse {
  files: FileLibraryResponse[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
