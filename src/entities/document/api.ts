import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTES } from "shared/api";
import { GetDocumentByIdResponse, IDocument } from "./model";
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
      transformResponse: (response: GetDocumentByIdResponse): IDocument => {
        const doc = response.data;

        return {
          id: doc.id,
          title: doc.title,
          aiTitle: doc.ai_title,
          query: doc.query,
          content: doc.content,
          createdAt: doc.created_at,
          creator_id: doc.creator_id,
          creator_name: doc.creator_name,
          published_date: doc.published_date,

          originalFolderId: doc.original_folder_id,
          originalFolderName: doc.original_folder_name,
          originalInstructions: doc.original_instructions ?? null,
          originalFiles: doc.original_files,

          sharedWith: {
            totalShares: doc.shared_with.total_shares,
            clients: doc.shared_with.clients,
          },

          revenueGenerated: doc.revenue_generated,
          readCount: doc.read_count,
          savedCount: doc.saved_count,
          feedbackCount: doc.feedback_count,
          comments: doc.comments,
          socialMediaShares: doc.social_media_shares,
          chatId: doc.chat_id,
          status: doc.status,
          readStatus: doc.read_status,
          rating: doc.rating,
          userRating: doc.user_rating,
          userComments: doc.user_comments,
          thumbsDown: doc.thumbs_down,
        };
      },
    }),
  }),
});

export const { useGetDocumentByIdQuery } = documentsApi;
