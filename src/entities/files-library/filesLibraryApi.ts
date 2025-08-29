import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  FetchAllFilesLibraryPayload,
  FetchAllFilesLibraryResponse,
  FileLibraryResponse,
  FileLibraryService,
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
      { files: File[]; descriptions?: string }
    >({
      queryFn: async ({ files, descriptions }) => {
        try {
          const response = await FileLibraryService.uploadFilesLibrary(
            files,
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
  }),
});

export const {
  useFetchAllFilesQuery,
  useFetchFileLibraryQuery,
  useUploadFilesLibraryMutation,
  useDownloadFileLibraryMutation,
  useDeleteFileLibraryMutation,
} = filesLibraryApi;
