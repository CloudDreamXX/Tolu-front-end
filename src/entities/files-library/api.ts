import { API_ROUTES, ApiService } from "shared/api";
import {
  FetchAllFilesLibraryPayload,
  FetchAllFilesLibraryResponse,
  FileLibraryResponse,
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
    descriptions?: string
  ): Promise<string> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    if (descriptions) {
      formData.append("descriptions", descriptions);
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
}
