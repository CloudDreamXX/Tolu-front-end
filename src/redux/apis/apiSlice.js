import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiUrl = import.meta.env.VITE_API_URL;
console.log("API URL:", apiUrl);

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers, { getState }) => {
      let token = getState().auth.token; // Get token from Redux store

      if (!token) {
        token = localStorage.getItem("token"); // Fallback to localStorage
      }

      console.log("API Slice Token:", token);

      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // Set Bearer Token
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (userData) => ({
        url: '/user/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/user/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    aiLearningSearch: builder.mutation({
      query: (searchQuery) => ({
        url: '/ai-learning-search',
        method: 'POST',
        body: searchQuery,
      }),
      // onQueryStarted: async (searchQuery, { dispatch, queryFulfilled }) => {
      //   try {
      //     const response = await queryFulfilled;
      //     // Log the response data
      //     console.log("AI Learning Search Response:", response.data);
      //   } catch (error) {
      //     console.error("Error in AI Learning Search:", error);
      //   }
      // },

    }),
    findUser: builder.query({
      query: (email) => `/user-exist/${email}`,
    }),
    getAISearch: builder.mutation({
      query: (payload) => ({
        url: '/ai-search',
        method: 'POST',
        body: payload,
      }),
    }),
    getSearchHistory: builder.query({
      query: () => '/searched-result/history',
    }),
    getSessionResult: builder.query({
      query: (chat_id) => `/session/${chat_id}`,
    }),
    createHandout: builder.mutation({
      query: (payload) => ({
        url: '/handout/create',
        method: 'POST',
        body: payload,
      }),
    }),
    rateResponse: builder.mutation({
      query: (payload) => ({
        url: '/searched-result/rating',
        method: 'POST',
        body: payload,
      }),
    }),
    reportResult: builder.mutation({
      query: (payload) => ({
        url: '/searched-result/report',
        method: 'POST',
        body: payload,
      }),
    }),
    updateChatTitle: builder.mutation({
      query: ({ chat_id, new_title }) => ({
        url: '/update-chat-title',
        method: 'PUT',
        body: { chat_id, new_title },
      }),
    }),
    getUserProfile: builder.query({
      query: () => '/user/profile',
    }),
    deleteChat: builder.mutation({
      query: (chatId) => ({
        url: `/chat/${chatId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useSignUpMutation,
  useLoginMutation,
  useAiLearningSearchMutation,
  useFindUserQuery,
  useGetAISearchMutation,
  useGetSearchHistoryQuery,
  useGetSessionResultQuery,
  useCreateHandoutMutation,
  useRateResponseMutation,
  useReportResultMutation,
  useUpdateChatTitleMutation,
  useGetUserProfileQuery,
  useDeleteChatMutation,
} = apiSlice;
