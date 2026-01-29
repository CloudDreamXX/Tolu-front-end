import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTES } from "shared/api";
import {
  IFolder,
  IFolderItemResponse,
  IFolderMap,
  ISubfolderResponse,
  IContentItemResponse,
  IFileNamesResponse,
  NewFolder,
  ContentToMove,
  FolderToDelete,
  GetFolderItemResponse,
} from "./model";
import { RootState } from "entities/store";

const serializeFileNames = (fileNames: IFileNamesResponse[] = []) =>
  fileNames.map((file) => ({
    path: file.path,
    filename: file.filename,
    contentType: file.content_type,
  }));

const normalizeValue = (
  value: string | null,
  invalidValues = ["None", "[]"]
) => (!value || invalidValues.includes(value) ? null : value);

const serializeContentItem = (item: IContentItemResponse) => ({
  id: item.id,
  title: item.title,
  chatId: item.chat_id,
  creatorId: item.creator_id,
  createdAt: item.created_at,
  reviewerName: normalizeValue(item.reviewer_name),
  price: normalizeValue(item.price),
  status: item.status,
  messages: item.messages,
  aiTitle: item.ai_title,
  contentType: item.content_type,
});

const serializeSubfolder = (subfolder: ISubfolderResponse): any => ({
  id: subfolder.id,
  name: subfolder.name,
  fileCount: subfolder.file_count,
  fileNames: serializeFileNames(subfolder.file_names),
  customInstructions: subfolder.custom_instructions,
  creatorId: subfolder.creator_id,
  createdAt: subfolder.created_at,
  reviewerName: normalizeValue(subfolder.reviewer_name),
  price: normalizeValue(subfolder.price),
  status: subfolder.status,
  totalContentItems: subfolder.total_content_items,
  pagination: subfolder.pagination,
  subfolders: Array.isArray(subfolder.subfolders)
    ? subfolder.subfolders.map(serializeSubfolder)
    : [],
  content: Array.isArray(subfolder.content)
    ? subfolder.content.map(serializeContentItem)
    : [],
});

const serializeFolder = (folder: IFolderItemResponse): IFolder => ({
  id: folder.id ?? folder.folder_id,
  name: folder.name,
  fileCount: folder.file_count,
  fileNames: serializeFileNames(folder.file_names),
  customInstructions: folder.custom_instructions,
  creatorId: folder.creator_id,
  createdAt: folder.created_at,
  reviewerName: normalizeValue(folder.reviewer_name),
  price: normalizeValue(folder.price),
  status: folder.status,
  totalContentItems: folder.total_content_items,
  subfolders: (folder.subfolders || []).map(serializeSubfolder),
  content: (folder.content || []).map(serializeContentItem),
  isSystemFolder: false,
  parentFolderId: folder.parent_folder_id,
  description: folder.description,
  isRootFolder: true,
  isSubfolder: false,
  isEmpty: folder.total_content_items === 0,
  pagination: folder.pagination,
});

export const foldersApi = createApi({
  reducerPath: "foldersApi",
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
  tagTypes: ["Folders"],

  endpoints: (builder) => ({
    createFolder: builder.mutation<any, NewFolder>({
      query: (body) => ({
        url: API_ROUTES.FOLDERS.CREATE,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Folders"],
    }),

    getFolders: builder.query<
      { folders: IFolder[]; foldersMap: IFolderMap },
      { page?: number; page_size?: number; folder_id?: string } | void
    >({
      query: (params) => ({
        url: API_ROUTES.FOLDERS.STRUCTURE,
        params: params ? params : undefined,
      }),
      transformResponse: (response: any) => {
        const foldersData = response.data ?? response;
        const allFolders: IFolder[] = [];
        const categories = [
          "flagged",
          "ai_generated",
          "in_review",
          "approved",
          "published",
          "archived",
        ];

        categories.forEach((category) => {
          if (Array.isArray(foldersData[category])) {
            const serialized = foldersData[category].map(serializeFolder);
            allFolders.push(...serialized);
          }
        });

        return {
          folders: allFolders,
          foldersMap: allFolders.reduce((map: IFolderMap, folder) => {
            if (!map[folder.id]) map[folder.id] = [];
            map[folder.id].push(folder);
            return map;
          }, {}),
        };
      },
      providesTags: ["Folders"],
    }),

    getFoldersByStatus: builder.query<
      {
        aiGenerated: IFolder[];
        inReview: IFolder[];
        approved: IFolder[];
        published: IFolder[];
        archived: IFolder[];
      },
      void
    >({
      query: () => ({
        url: API_ROUTES.FOLDERS.STRUCTURE,
      }),
      transformResponse: (response: any) => {
        const foldersData = response.data ?? response;
        return {
          aiGenerated: (foldersData.ai_generated ?? []).map(serializeFolder),
          inReview: (foldersData.in_review ?? []).map(serializeFolder),
          approved: (foldersData.approved ?? []).map(serializeFolder),
          published: (foldersData.published ?? []).map(serializeFolder),
          archived: (foldersData.archived ?? []).map(serializeFolder),
        };
      },
      providesTags: ["Folders"],
    }),

    getFolder: builder.query<IFolder, string>({
      query: (id) => ({
        url: API_ROUTES.FOLDERS.GET_FOLDER.replace("{id}", `${id}`),
      }),
      transformResponse: (response: { folder: GetFolderItemResponse }) =>
        serializeFolder(response.folder.data),
      providesTags: ["Folders"],
    }),

    moveFolderContent: builder.mutation<any, ContentToMove>({
      query: (body) => ({
        url: API_ROUTES.FOLDERS.MOVE_CONTENT,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Folders"],
    }),

    deleteContent: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (contentId) => ({
        url: API_ROUTES.FOLDERS.DELETE_CONTENT,
        method: "DELETE",
        body: { content_id: contentId },
      }),
      invalidatesTags: ["Folders"],
    }),

    deleteFolder: builder.mutation<
      { success: boolean; message: string },
      FolderToDelete
    >({
      query: (body) => ({
        url: API_ROUTES.FOLDERS.DELETE_FOLDER,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Folders"],
    }),
  }),
});

export const {
  useCreateFolderMutation,
  useGetFoldersQuery,
  useGetFoldersByStatusQuery,
  useGetFolderQuery,
  useMoveFolderContentMutation,
  useDeleteContentMutation,
  useDeleteFolderMutation,
} = foldersApi;
