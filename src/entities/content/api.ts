import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ContentItemResponse,
  ContentToEdit,
  ContentStatus,
  Feedback,
  FeedbackResponse,
  ContentHashtags,
  CreatorProfile,
  ShareViaEmail,
  ShareWithCoach,
  LibraryContentStatus,
} from "./model";
import { API_ROUTES } from "shared/api";
import { RootState } from "entities/store";

export const contentApi = createApi({
  reducerPath: "contentApi",
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
  endpoints: (builder) => ({
    getContent: builder.query<ContentItemResponse, string>({
      query: (id) => `${API_ROUTES.CONTENT.RETRIEVE}/${id}`,
    }),
    duplicateContentById: builder.mutation<any, string>({
      query: (contentId) => ({
        url: `${API_ROUTES.CONTENT.DUPLICATE_CONTENT}/${contentId}`,
        method: "POST",
      }),
    }),
    editContent: builder.mutation<any, ContentToEdit>({
      query: (content) => ({
        url: API_ROUTES.CONTENT.EDIT_CONTENT,
        method: "PUT",
        body: content,
      }),
    }),
    updateStatus: builder.mutation<any, ContentStatus>({
      query: (status) => ({
        url: `${API_ROUTES.CONTENT.UPDATE_CONTENT_STATUS.replace("{content_id}", status.content_id)}`,
        method: "POST",
        body: { status: status.status },
      }),
    }),
    addContentFeedback: builder.mutation<FeedbackResponse, Feedback>({
      query: (feedback) => ({
        url: API_ROUTES.CONTENT.FEEDBACK,
        method: "POST",
        body: feedback,
      }),
    }),
    addHashtags: builder.mutation<any, ContentHashtags>({
      query: (data) => ({
        url: API_ROUTES.CONTENT.ADD_HASHTAGS,
        method: "POST",
        body: data,
      }),
    }),
    deleteHashtags: builder.mutation<any, ContentHashtags>({
      query: (data) => ({
        url: API_ROUTES.CONTENT.DELETE_HASHTAGS,
        method: "DELETE",
        body: data,
      }),
    }),
    getContentHashtags: builder.query<any, string>({
      query: (id) =>
        `${API_ROUTES.CONTENT.GET_CONTENT_HASHTAGS.replace("{content_id}", id)}`,
    }),
    getContentWithSimilarTags: builder.mutation<any, string>({
      query: (id) => ({
        url: API_ROUTES.CONTENT.GET_CONTENTS_WITH_SIMILAR_TAGS,
        method: "POST",
        body: { content_id: id },
      }),
    }),
    getAllHashtags: builder.query<any, void>({
      query: () => API_ROUTES.CONTENT.GET_ALL_HASHTAGS,
    }),
    getCreatorProfile: builder.query<CreatorProfile, string>({
      query: (id) =>
        `${API_ROUTES.CONTENT.GET_CREATOR_PROFILE.replace("{creator_id}", id)}`,
    }),
    getCreatorPhoto: builder.query<Blob, { id: string; filename: string }>({
      query: ({ id, filename }) => ({
        url: API_ROUTES.CONTENT.DOWNLOAD_CREATOR_PHOTO.replace(
          "{creator_id}",
          encodeURIComponent(id)
        ).replace("{filename}", encodeURIComponent(filename)),
        method: "GET",
        responseType: "blob",
        headers: { Accept: "image/*" },
      }),
    }),
    shareEmail: builder.mutation<any, ShareViaEmail>({
      query: (data) => ({
        url: API_ROUTES.CONTENT.SHARE_EMAIL,
        method: "POST",
        body: data,
      }),
    }),
    shareCoach: builder.mutation<any, ShareWithCoach>({
      query: (data) => ({
        url: API_ROUTES.CONTENT.SHARE_COACH,
        method: "POST",
        body: data,
      }),
    }),
    updateContentStatus: builder.mutation<any, LibraryContentStatus>({
      query: (data) => ({
        url: API_ROUTES.CONTENT.LIBRARY_STATUS,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetContentQuery,
  useDuplicateContentByIdMutation,
  useEditContentMutation,
  useUpdateStatusMutation,
  useAddContentFeedbackMutation,
  useAddHashtagsMutation,
  useDeleteHashtagsMutation,
  useGetContentHashtagsQuery,
  useGetContentWithSimilarTagsMutation,
  useGetAllHashtagsQuery,
  useGetCreatorProfileQuery,
  useGetCreatorPhotoQuery,
  useShareEmailMutation,
  useShareCoachMutation,
  useUpdateContentStatusMutation,
} = contentApi;
