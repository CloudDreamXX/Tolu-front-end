import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CreateFolderPayload,
  FetchAllFilesLibraryPayload,
  FetchAllFilesLibraryResponse,
  FileLibraryResponse,
  FileLibraryService,
  FolderContentsResponse,
  FolderResponse,
  MoveFilesPayload,
  UpdateFolderPayload,
} from ".";

export const filesLibraryApi = createApi({
  reducerPath: "filesLibraryApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    fetchAllFiles: builder.query<
      FetchAllFilesLibraryResponse,
      FetchAllFilesLibraryPayload
    >({
      queryFn: async (payload) => {
        try {
          const response = await FileLibraryService.fetchAllFiles(payload);
          return { data: response };
        } catch (error) {
          return {
            error:
              error instanceof Error ? error.message : "Error fetching files",
          };
        }
      },
    }),

    fetchFileLibrary: builder.query<FileLibraryResponse, string>({
      queryFn: async (fileId) => {
        try {
          const response = await FileLibraryService.fetchFileLibrary(fileId);
          return { data: response };
        } catch (error) {
          return {
            error:
              error instanceof Error
                ? error.message
                : "Error fetching the file",
          };
        }
      },
    }),

    uploadFilesLibrary: builder.mutation<
      string,
      { files: File[]; descriptions?: string; folder_id: string | null }
    >({
      queryFn: async ({ files, descriptions, folder_id }) => {
        try {
          const response = await FileLibraryService.uploadFilesLibrary(
            files,
            folder_id,
            descriptions
          );
          return { data: response };
        } catch (error) {
          return {
            error:
              error instanceof Error ? error.message : "Error uploading files",
          };
        }
      },
    }),

    downloadFileLibrary: builder.mutation<
      Blob,
      { fileId: string; onProgress?: (percent: number) => void }
    >({
      queryFn: async ({ fileId, onProgress }) => {
        try {
          const response = await FileLibraryService.downloadFileLibrary(
            fileId,
            onProgress
          );
          return { data: response };
        } catch (error) {
          return {
            error:
              error instanceof Error ? error.message : "Error downloading file",
          };
        }
      },
    }),

    deleteFileLibrary: builder.mutation<void, string>({
      queryFn: async (fileId) => {
        try {
          await FileLibraryService.deleteFileLibrary(fileId);
          return { data: undefined };
        } catch (error) {
          return {
            error:
              error instanceof Error ? error.message : "Error downloading file",
          };
        }
      },
    }),

    createFolder: builder.mutation<FolderResponse, CreateFolderPayload>({
      queryFn: async (payload) => {
        try {
          const response = await FileLibraryService.createFolder(payload);
          return { data: response };
        } catch (error) {
          return {
            error:
              error instanceof Error ? error.message : "Error creating folder",
          };
        }
      },
    }),

    getFolder: builder.query<FolderResponse, string>({
      queryFn: async (folderId) => {
        try {
          const response = await FileLibraryService.getFolder(folderId);
          return { data: response };
        } catch (error) {
          return {
            error:
              error instanceof Error ? error.message : "Error fetching folder",
          };
        }
      },
    }),

    updateFolder: builder.mutation<
      FolderResponse,
      { folderId: string; payload: UpdateFolderPayload }
    >({
      queryFn: async ({ folderId, payload }) => {
        try {
          const response = await FileLibraryService.updateFolder(
            folderId,
            payload
          );
          return { data: response };
        } catch (error) {
          return {
            error:
              error instanceof Error ? error.message : "Error updating folder",
          };
        }
      },
    }),

    getFolderContents: builder.query<
      FolderContentsResponse,
      { folderId: string; page: string; per_page: string }
    >({
      queryFn: async ({ folderId, page, per_page }) => {
        try {
          const response = await FileLibraryService.getFolderContents(
            folderId,
            page,
            per_page
          );
          return { data: response };
        } catch (error) {
          return {
            error:
              error instanceof Error
                ? error.message
                : "Error fetching folder contents",
          };
        }
      },
    }),

    deleteFolder: builder.mutation<void, string>({
      queryFn: async (folderId) => {
        try {
          await FileLibraryService.deleteFolder(folderId);
          return { data: undefined };
        } catch (error) {
          return {
            error:
              error instanceof Error ? error.message : "Error deleting folder",
          };
        }
      },
    }),

    moveFiles: builder.mutation<void, MoveFilesPayload>({
      queryFn: async (payload) => {
        try {
          await FileLibraryService.moveFiles(payload);
          return { data: undefined };
        } catch (error) {
          return {
            error:
              error instanceof Error ? error.message : "Error moving files",
          };
        }
      },
    }),
  }),
});

export const {
  useFetchAllFilesQuery,
  useFetchFileLibraryQuery,
  useUploadFilesLibraryMutation,
  useDownloadFileLibraryMutation,
  useDeleteFileLibraryMutation,
  useCreateFolderMutation,
  useGetFolderQuery,
  useUpdateFolderMutation,
  useGetFolderContentsQuery,
  useDeleteFolderMutation,
  useMoveFilesMutation,
} = filesLibraryApi;
