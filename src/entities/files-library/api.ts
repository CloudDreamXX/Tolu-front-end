import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTES } from "shared/api";
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
import { RootState } from "entities/store";

export const filesLibraryApi = createApi({
  reducerPath: "filesLibraryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user?.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Files", "Folders"],

  endpoints: (builder) => ({
    fetchAllFiles: builder.query<
      FetchAllFilesLibraryResponse,
      FetchAllFilesLibraryPayload
    >({
      query: (params) => ({
        url: API_ROUTES.FILES_LIBRARY.FETCH_ALL,
        params,
      }),
      providesTags: ["Files"],
    }),

    fetchFileLibrary: builder.query<FileLibraryResponse, string>({
      query: (fileId) => ({
        url: API_ROUTES.FILES_LIBRARY.FETCH_ONE.replace("file_id", fileId),
      }),
      providesTags: ["Files"],
    }),

    uploadFilesLibrary: builder.mutation<
      string,
      { files: File[]; descriptions?: string; folder_id: string | null }
    >({
      query: ({ files, descriptions, folder_id }) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        if (descriptions) formData.append("descriptions", descriptions);
        if (folder_id) formData.append("folder_id", folder_id);

        return {
          url: API_ROUTES.FILES_LIBRARY.UPLOAD,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Files"],
    }),

    downloadFileLibrary: builder.query<Blob, { fileId: string }>({
      query: ({ fileId }) => ({
        url: API_ROUTES.FILES_LIBRARY.DOWNLOAD.replace("{file_id}", fileId),
        responseHandler: async (response) => await response.blob(),
      }),
    }),

    deleteFileLibrary: builder.mutation<void, string>({
      query: (fileId) => ({
        url: API_ROUTES.FILES_LIBRARY.DELETE.replace("{file_id}", fileId),
        method: "DELETE",
      }),
      invalidatesTags: ["Files"],
    }),

    createFolder: builder.mutation<FolderResponse, CreateFolderPayload>({
      query: (body) => ({
        url: API_ROUTES.FILES_LIBRARY.CREATE_FOLDER,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Folders"],
    }),

    getFolder: builder.query<FolderResponse, string>({
      query: (folderId) => ({
        url: API_ROUTES.FILES_LIBRARY.GET_FOLDER.replace(
          "{folder_id}",
          folderId
        ),
      }),
      providesTags: ["Folders"],
    }),

    updateFolder: builder.mutation<
      FolderResponse,
      { folderId: string; payload: UpdateFolderPayload }
    >({
      query: ({ folderId, payload }) => ({
        url: API_ROUTES.FILES_LIBRARY.UPDATE_FOLDER.replace(
          "{folder_id}",
          folderId
        ),
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Folders"],
    }),

    getFolderContents: builder.query<
      FolderContentsResponse,
      { folderId: string; page: string; per_page: string }
    >({
      query: ({ folderId, page, per_page }) => ({
        url: API_ROUTES.FILES_LIBRARY.GET_FOLDER_CONTENTS.replace(
          "{folder_id}",
          folderId
        ),
        params: { page, per_page },
      }),
      providesTags: ["Files"],
    }),

    deleteFolder: builder.mutation<void, string>({
      query: (folderId) => ({
        url: API_ROUTES.FILES_LIBRARY.DELETE_FOLDER.replace(
          "{folder_id}",
          folderId
        ),
        method: "DELETE",
      }),
      invalidatesTags: ["Folders"],
    }),

    moveFiles: builder.mutation<void, MoveFilesPayload>({
      query: (body) => ({
        url: API_ROUTES.FILES_LIBRARY.MOVE_FILES,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Files", "Folders"],
    }),
  }),
});

export const {
  useFetchAllFilesQuery,
  useFetchFileLibraryQuery,
  useUploadFilesLibraryMutation,
  useDownloadFileLibraryQuery,
  useLazyDownloadFileLibraryQuery,
  useDeleteFileLibraryMutation,
  useCreateFolderMutation,
  useGetFolderQuery,
  useUpdateFolderMutation,
  useGetFolderContentsQuery,
  useDeleteFolderMutation,
  useMoveFilesMutation,
} = filesLibraryApi;
