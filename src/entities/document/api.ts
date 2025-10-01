import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTES } from "shared/api";
import { IDocument, IDocumentResponse } from "./model";
import { RootState } from "entities/store";

export const documentsApi = createApi({
  reducerPath: "documentsApi",
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
    getDocumentById: builder.query<IDocument, string>({
      query: (id) => `${API_ROUTES.DOCUMENTS.DETAILS}/${id}`,
      transformResponse: (response: IDocumentResponse) => {
        return {
          ...response,
          createdAt: response.created_at,
          originalFolderId: response.original_folder_id,
          originalFolderName: response.original_folder_name,
          originalInstructions: response.original_instructions ?? null,
          originalFiles: response.original_files,
          sharedWith: {
            totalShares: response.shared_with.total_shares,
            clients: response.shared_with.clients,
          },
          revenueGenerated: response.revenue_generated,
          readCount: response.read_count,
          savedCount: response.saved_count,
          feedbackCount: response.feedback_count,
          comments: response.comments,
          socialMediaShares: response.social_media_shares,
          chatId: response.chat_id,
          status: response.status,
          readStatus: response.read_status,
          rating: response.rating,
          userRating: response.user_rating,
          userComments: response.user_comments,
          thumbsDown: response.thumbs_down,
          aiTitle: response.ai_title,
        };
      },
    }),
  }),
});

export const { useGetDocumentByIdQuery } = documentsApi;
