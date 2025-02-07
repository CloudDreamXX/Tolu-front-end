// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const apiUrl = import.meta.env.VITE_API_URL;
// console.log("API URL:", apiUrl);

// export const apiSlice = createApi({
//   reducerPath: 'api',
//   baseQuery: fetchBaseQuery({
//     baseUrl: apiUrl,
//     prepareHeaders: (headers, { getState }) => {
//       let token = getState().auth.token; // Get token from Redux store

//       if (!token) {
//         token = localStorage.getItem("token"); // Fallback to localStorage
//       }

//       console.log("API Slice Token:", token);

//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`); // Set Bearer Token
//       }

//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     signUp: builder.mutation({
//       query: (userData) => ({
//         url: '/user/signup',
//         method: 'POST',
//         body: userData,
//       }),
//     }),
//     login: builder.mutation({
//       query: (credentials) => ({
//         url: '/user/login',
//         method: 'POST',
//         body: credentials,
//       }),
//     }),
//     aiLearningSearch: builder.mutation({
//       query: (searchQuery) => ({
//         url: '/ai-learning-search',
//         method: 'POST',
//         body: searchQuery,
//       }),
//       // onQueryStarted: async (searchQuery, { dispatch, queryFulfilled }) => {
//       //   try {
//       //     const response = await queryFulfilled;
//       //     // Log the response data
//       //     console.log("AI Learning Search Response:", response.data);
//       //   } catch (error) {
//       //     console.error("Error in AI Learning Search:", error);
//       //   }
//       // },

//     }),
//     findUser: builder.query({
//       query: (email) => `/user-exist/${email}`,
//     }),
//     getAISearch: builder.mutation({
//       query: (payload) => ({
//         url: '/ai-search',
//         method: 'POST',
//         body: payload,
//       }),
//     }),
//     getSearchHistory: builder.query({
//       query: () => '/searched-result/history',
//     }),
//     getSessionResult: builder.query({
//       query: (chat_id) => `/session/${chat_id}`,
//     }),
//     createHandout: builder.mutation({
//       query: (payload) => ({
//         url: '/handout/create',
//         method: 'POST',
//         body: payload,
//       }),
//     }),
//     rateResponse: builder.mutation({
//       query: (payload) => ({
//         url: '/searched-result/rating',
//         method: 'POST',
//         body: payload,
//       }),
//     }),
//     reportResult: builder.mutation({
//       query: (payload) => ({
//         url: '/searched-result/report',
//         method: 'POST',
//         body: payload,
//       }),
//     }),
//     updateChatTitle: builder.mutation({
//       query: ({ chat_id, new_title }) => ({
//         url: '/update-chat-title',
//         method: 'PUT',
//         body: { chat_id, new_title },
//       }),
//     }),
//     getUserProfile: builder.query({
//       query: () => '/user/profile',
//     }),
//     deleteChat: builder.mutation({
//       query: (chatId) => ({
//         url: `/chat/${chatId}`,
//         method: 'DELETE',
//       }),
//     }),
//   }),
// });

// export const {
//   useSignUpMutation,
//   useLoginMutation,
//   useAiLearningSearchMutation,
//   useFindUserQuery,
//   useGetAISearchMutation,
//   useGetSearchHistoryQuery,
//   useGetSessionResultQuery,
//   useCreateHandoutMutation,
//   useRateResponseMutation,
//   useReportResultMutation,
//   useUpdateChatTitleMutation,
//   useGetUserProfileQuery,
//   useDeleteChatMutation,
// } = apiSlice;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const apiUrl = import.meta.env.VITE_API_URL;
console.log("API URL:", apiUrl);

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers, { getState }) => {
      let token = getState().auth.token || localStorage.getItem("token"); 
      console.log("API Slice Token:", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (userData) => ({
        url: "/user/signup",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
    }),
    aiLearningSearch: builder.mutation({
      query: (searchQuery) => ({
        url: "/ai-learning-search",
        method: "POST",
        body: searchQuery,
      }),
    }),
    findUser: builder.query({
      query: (email) => `/user-exist/${email}`,
    }),

    /**
     * ✅ SSE Integration for `getAISearch`
     * Uses `fetchEventSource` for streaming responses from the server.
     */
    getAISearch: builder.mutation({
      queryFn: async (payload, _queryApi, _extraOptions, baseQuery) => {
        try {
          const token = localStorage.getItem("token");
    
          return new Promise((resolve, reject) => {
            let result = { answers: "", result_id: "", chat_id: "" };
    
            // ✅ Create FormData instance
            const formData = new FormData();
    
            // ✅ Convert `chat_message` to a JSON string and append it
            if (payload.chat_message) {
              formData.append("chat_message", JSON.stringify(payload.chat_message));
            } else {
              reject({ error: "Chat message is required." });
              return;
            }
    
            // ✅ Mandatory File Upload
            if (!payload.file) {
              reject({ error: "File is required." });
              return;
            }
    
            // ✅ Append file (either PDF or Image)
            const fileType = payload.file.type;
            if (fileType === "application/pdf") {
              formData.append("pdf", payload.file);
            } else if (fileType.startsWith("image")) {
              formData.append("image", payload.file);
            } else {
              reject({ error: "Invalid file type. Only PDF and images are allowed." });
              return;
            }
    
            // ✅ Make API request
            fetchEventSource(`${apiUrl}/ai-search`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "text/event-stream",
                // ❌ Do NOT set `Content-Type` (fetch automatically sets it for FormData)
              },
              body: formData,
              onopen(response) {
                if (!response.ok) {
                  reject({ error: `HTTP error! status: ${response.status}` });
                }
              },
              onmessage(event) {
                try {
                  const data = JSON.parse(event.data);
                  result.answers += data.reply || "";
                  result.result_id = data.searched_result_id || result.result_id;
                  result.chat_id = data.chat_id || result.chat_id;
                } catch (error) {
                  console.error("Error parsing SSE event:", error);
                }
              },
              onclose() {
                resolve({ data: result });
              },
              onerror(err) {
                reject({ error: `SSE failed: ${err.message}` });
              },
            });
          });
        } catch (error) {
          return { error: "Request failed: " + error.message };
        }
      },
    }),
    

    getSearchHistory: builder.query({
      query: () => "/searched-result/history",
    }),
    getSessionResult: builder.query({
      query: (chat_id) => `/session/${chat_id}`,
    }),
    createHandout: builder.mutation({
      query: (payload) => ({
        url: "/handout/create",
        method: "POST",
        body: payload,
      }),
    }),
    rateResponse: builder.mutation({
      query: (payload) => ({
        url: "/searched-result/rating",
        method: "POST",
        body: payload,
      }),
    }),
    reportResult: builder.mutation({
      query: (payload) => ({
        url: "/searched-result/report",
        method: "POST",
        body: payload,
      }),
    }),
    updateChatTitle: builder.mutation({
      query: ({ chat_id, new_title }) => ({
        url: "/update-chat-title",
        method: "PUT",
        body: { chat_id, new_title },
      }),
    }),
    getUserProfile: builder.query({
      query: () => "/user/profile",
    }),
    deleteChat: builder.mutation({
      query: (chatId) => ({
        url: `/chat/${chatId}`,
        method: "DELETE",
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
