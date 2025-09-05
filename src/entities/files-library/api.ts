import { API_ROUTES, ApiService } from "shared/api";
import {
  CreateFolderPayload,
  FetchAllFilesLibraryPayload,
  FetchAllFilesLibraryResponse,
  FileLibraryResponse,
  FolderContentsResponse,
  FolderResponse,
  MoveFilesPayload,
  UpdateFolderPayload,
} from "./model";
import { onDownloadProgress } from "entities/chat/helpers";

export class FileLibraryService {
  static async fetchAllFiles(
    payload: FetchAllFilesLibraryPayload
  ): Promise<FetchAllFilesLibraryResponse> {
    return ApiService.get<FetchAllFilesLibraryResponse>(
      API_ROUTES.FILES_LIBRARY.FETCH_ALL,
      { params: payload }
    );
  }

  static async fetchFileLibrary(file_id: string): Promise<FileLibraryResponse> {
    return ApiService.get<FileLibraryResponse>(
      API_ROUTES.FILES_LIBRARY.FETCH_ONE.replace("file_id", file_id)
    );
  }

  static async uploadFilesLibrary(
    files: File[],
    folder_id: string | null,
    descriptions?: string
  ): Promise<string> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    if (descriptions) {
      formData.append("descriptions", descriptions);
    }

    if (folder_id) {
      formData.append("folder_id", folder_id);
    }

    return ApiService.post<string>(API_ROUTES.FILES_LIBRARY.UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  static async downloadFileLibrary(
    fileId: string,
    onProgress?: (percent: number) => void,
    opts?: { signal?: AbortSignal }
  ): Promise<Blob> {
    return ApiService.get<Blob>(
      API_ROUTES.FILES_LIBRARY.DOWNLOAD.replace("{file_id}", fileId),
      {
        responseType: "blob",
        signal: opts?.signal,
        onDownloadProgress: (e) => onDownloadProgress(e, onProgress),
      }
    );
  }

  static async deleteFileLibrary(fileId: string): Promise<void> {
    return ApiService.delete(
      `${API_ROUTES.FILES_LIBRARY.DELETE.replace("{file_id}", fileId)}`
    );
  }

  static async createFolder(
    payload: CreateFolderPayload
  ): Promise<FolderResponse> {
    return ApiService.post<FolderResponse>(
      API_ROUTES.FILES_LIBRARY.CREATE_FOLDER,
      payload
    );
  }

  static async getFolder(folderId: string): Promise<FolderResponse> {
    return ApiService.get<FolderResponse>(
      API_ROUTES.FILES_LIBRARY.GET_FOLDER.replace("{folder_id}", folderId)
    );
  }

  static async updateFolder(
    folderId: string,
    payload: UpdateFolderPayload
  ): Promise<FolderResponse> {
    return ApiService.put<FolderResponse>(
      API_ROUTES.FILES_LIBRARY.UPDATE_FOLDER.replace("{folder_id}", folderId),
      payload
    );
  }

  static async getFolderContents(
    folderId: string,
    page: string,
    per_page: string
  ): Promise<FolderContentsResponse> {
    return ApiService.get<FolderContentsResponse>(
      API_ROUTES.FILES_LIBRARY.GET_FOLDER_CONTENTS.replace(
        "{folder_id}",
        folderId
      ),
      {
        params: {
          page: page,
          per_page: per_page,
        },
      }
    );
  }

  static async deleteFolder(folderId: string): Promise<any> {
    return ApiService.delete<any>(
      API_ROUTES.FILES_LIBRARY.DELETE_FOLDER.replace("{folder_id}", folderId)
    );
  }

  static async moveFiles(payload: MoveFilesPayload): Promise<any> {
    return ApiService.post<any>(API_ROUTES.FILES_LIBRARY.MOVE_FILES, payload);
  }
}
