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
      queryFn: async (payload, _queryApi, _extraOptions, baseQuery) => {
        try {
          const token = localStorage.getItem("token");

          return new Promise((resolve, reject) => {
            let result = { answers: "", result_id: "", chat_id: "" };

            // ✅ Create FormData instance
            const formData = new FormData();
            formData.append("chat_message", JSON.stringify(payload.chat_message));

            if (payload.file) {
              const fileType = payload.file.type;
              if (fileType === "application/pdf") {
                formData.append("pdf", payload.file);
              } else if (fileType.startsWith("image")) {
                formData.append("image", payload.file);
              } else {
                reject({ error: "Invalid file type. Only PDF and images are allowed." });
                return;
              }
            }

            // ✅ Use fetchEventSource for real-time streaming
            fetchEventSource(`${apiUrl}/ai-learning-search`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "text/event-stream",
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

                  // ✅ Update UI as new data arrives
                  result.answers += data.reply || "";
                  result.result_id = data.searched_result_id || result.result_id;
                  result.chat_id = data.chat_id || result.chat_id;

                  // ✅ Call the update function
                  if (payload.onMessage) {
                    payload.onMessage(result.answers);
                  }
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
    findUser: builder.query({
      query: (email) => `/user-exist/${email}`,
    }),
    getAISearch: builder.mutation({
      queryFn: async (payload, _queryApi, _extraOptions, baseQuery) => {
        try {
          const token = localStorage.getItem("token");

          return new Promise((resolve, reject) => {
            let result = { answers: "", result_id: "", chat_id: "" };

            // ✅ Create FormData instance
            const formData = new FormData();
            formData.append("chat_message", JSON.stringify(payload.chat_message));

            if (payload.file) {
              const fileType = payload.file.type;
              if (fileType === "application/pdf") {
                formData.append("pdf", payload.file);
              } else if (fileType.startsWith("image")) {
                formData.append("image", payload.file);
              } else {
                reject({ error: "Invalid file type. Only PDF and images are allowed." });
                return;
              }
            }

            // ✅ Use fetchEventSource for real-time streaming
            fetchEventSource(`${apiUrl}/ai-search`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "text/event-stream",
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

                  // ✅ Update UI as new data arrives
                  result.answers += data.reply || "";
                  result.result_id = data.searched_result_id || result.result_id;
                  result.chat_id = data.chat_id || result.chat_id;

                  // ✅ Call the update function
                  if (payload.onMessage) {
                    payload.onMessage(result.answers);
                  }
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
