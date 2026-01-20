import {
  AIChatMessageResearch,
  AiSearchRequest,
  SearchHistoryItem,
  SearchHistoryParams,
  SearchHistoryResponse,
  SearchResultResponse,
  SearchResultResponseItem,
} from "./model";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "entities/store";

export interface StreamChunk {
  question?: string;
  reply?: string;
  body_system?: string;
  disease?: string;
  message?: string;
  searched_result_id?: string;
  chat_id?: string;
  chat_title?: string | null;
  content?: string;
  done?: boolean;
}

export const searchApi = createApi({
  reducerPath: "searchApi",
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
  tagTypes: ["SearchHistory", "SearchSession"],
  endpoints: (builder) => ({
    getSearchHistory: builder.query<SearchHistoryItem[], SearchHistoryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.client_id)
          searchParams.append("client_id", params.client_id);
        if (params.managed_client_id)
          searchParams.append("managed_client_id", params.managed_client_id);

        return `/searched-result/history${
          searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`;
      },
      transformResponse: (response: { history: SearchHistoryResponse[] }) => {
        return response.history.map((item) => ({
          ...item,
          chatId: item.chat_id,
          chatTitle: item.chat_title,
          createdAt: item.created_at,
          userId: item.user_id,
        }));
      },
      providesTags: ["SearchHistory"],
    }),

    getSession: builder.query<SearchResultResponseItem[], string>({
      query: (chatId) => `/session/${chatId}`,
      transformResponse: (response: SearchResultResponse) =>
        response.search_results,
      providesTags: ["SearchSession"],
    }),
  }),
});

export const {
  useGetSearchHistoryQuery,
  useGetSessionQuery,
  useLazyGetSessionQuery,
} = searchApi;

export class SearchService {
  static async aiSearchStream(
    searchData: AiSearchRequest,
    onChunk: (chunk: StreamChunk) => void,
    onComplete: (finalData: {
      searched_result_id: string;
      chat_id: string;
      chat_title?: string | null;
    }) => void,
    onError: (error: Error) => void,
    contentMode?: boolean,
    signal?: AbortSignal
  ): Promise<void> {
    try {
      const formData = this.createSearchRequest(
        searchData.chat_message,
        undefined,
        searchData.images,
        searchData.pdf,
        searchData.contentId,
        undefined,
        searchData.audio
      );

      const user = localStorage.getItem("persist:user");
      const token = user ? JSON.parse(user)?.token?.replace(/"/g, "") : null;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/${contentMode ? "ai-content-search" : "ai-search"}/`,
        {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
          signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body reader available");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // split on newlines
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // keep incomplete line for next iteration

        for (const line of lines) {
          if (line.trim() === "") continue;

          const jsonLine = line.replace(/^data:\s*/, "").trim();

          if (jsonLine === "[DONE]") {
            continue;
          }

          try {
            const parsed: StreamChunk = JSON.parse(jsonLine);

            if (parsed.message === "Stream completed" || parsed.done) {
              if (parsed.searched_result_id && parsed.chat_id) {
                onComplete({
                  searched_result_id: parsed.searched_result_id,
                  chat_id: parsed.chat_id,
                  chat_title: parsed.chat_title ?? null,
                });
              }
            } else {
              onChunk(parsed);
            }
          } catch (parseError) {
            console.warn("Failed to parse JSON chunk:", jsonLine, parseError);
          }
        }
      }

      if (buffer.trim() !== "" && buffer.trim() !== "[DONE]") {
        try {
          const parsed: StreamChunk = JSON.parse(buffer);
          if (parsed.message === "Stream completed" || parsed.done) {
            if (parsed.searched_result_id && parsed.chat_id) {
              onComplete({
                searched_result_id: parsed.searched_result_id,
                chat_id: parsed.chat_id,
                chat_title: parsed.chat_title ?? null,
              });
            }
          } else {
            onChunk(parsed);
          }
        } catch (parseError) {
          console.warn("Failed to parse leftover buffer:", buffer, parseError);
        }
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  static async aiCoachResearchStream(
    searchData: AIChatMessageResearch,
    onChunk: (chunk: StreamChunk) => void,
    onComplete: (finalData: {
      searched_result_id: string;
      chat_id: string;
      chat_title?: string | null;
    }) => void,
    onError: (error: Error) => void,
    signal?: AbortSignal
  ): Promise<void> {
    try {
      const formData = this.createSearchRequest(
        searchData.chat_message,
        searchData.clientId,
        searchData.images,
        searchData.pdf,
        searchData.contentId,
        searchData.libraryFiles
      );

      const user = localStorage.getItem("persist:user");
      const token = user ? JSON.parse(user)?.token?.replace(/"/g, "") : null;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/${"ai-coach-research"}/`,
        {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
          signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = ""; // Buffer for chunk accumulation

      if (!reader) {
        throw new Error("No response body reader available");
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk; // Append the chunk to the buffer

        // Check if accumulated text contains a complete response
        const lines = accumulatedText.split("\n");

        for (const line of lines) {
          if (line.trim() === "") continue;

          const jsonLine = line.replace(/^data:\s*/, "").trim();

          if (jsonLine === "[DONE]") {
            break;
          }

          try {
            const parsed: StreamChunk = JSON.parse(jsonLine);

            if (parsed.message === "Stream completed" || parsed.done) {
              if (parsed.searched_result_id && parsed.chat_id) {
                onComplete({
                  searched_result_id: parsed.searched_result_id,
                  chat_id: parsed.chat_id,
                  chat_title: parsed.chat_title ?? null,
                });
              }
              if (parsed.done) {
                onComplete({
                  searched_result_id: new Date().toISOString(),
                  chat_id: new Date().toISOString(),
                  chat_title: null,
                });
              }
            } else {
              onChunk(parsed); // Pass the chunk as is to the callback
            }
          } catch (parseError) {
            console.warn("Failed to parse JSON chunk:", jsonLine, parseError);
          }
        }

        // Clear the accumulated buffer if we processed all valid chunks
        accumulatedText = "";
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  static async aiCoachAssistantStream(
    searchData: AIChatMessageResearch,
    onChunk: (chunk: StreamChunk) => void,
    onComplete: (finalData: {
      searched_result_id: string;
      chat_id: string;
      chat_title?: string | null;
    }) => void,
    onError: (error: Error) => void,
    signal?: AbortSignal
  ): Promise<void> {
    try {
      const formData = this.createSearchRequest(
        searchData.chat_message,
        searchData.clientId,
        searchData.images,
        searchData.pdf,
        searchData.contentId,
        searchData.libraryFiles
      );

      const user = localStorage.getItem("persist:user");
      const token = user ? JSON.parse(user)?.token?.replace(/"/g, "") : null;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/${"ai-coach-assistant"}/`,
        {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
          signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = ""; // Buffer for chunk accumulation

      if (!reader) {
        throw new Error("No response body reader available");
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk; // Append the chunk to the buffer

        // Check if accumulated text contains a complete response
        const lines = accumulatedText.split("\n");

        for (const line of lines) {
          if (line.trim() === "") continue;

          const jsonLine = line.replace(/^data:\s*/, "").trim();

          if (jsonLine === "[DONE]") {
            break;
          }

          try {
            const parsed: StreamChunk = JSON.parse(jsonLine);

            if (parsed.message === "Stream completed" || parsed.done) {
              if (parsed.searched_result_id && parsed.chat_id) {
                onComplete({
                  searched_result_id: parsed.searched_result_id,
                  chat_id: parsed.chat_id,
                  chat_title: parsed.chat_title ?? null,
                });
              }
              if (parsed.done) {
                onComplete({
                  searched_result_id: new Date().toISOString(),
                  chat_id: new Date().toISOString(),
                  chat_title: null,
                });
              }
            } else {
              onChunk(parsed); // Pass the chunk as is to the callback
            }
          } catch (parseError) {
            console.warn("Failed to parse JSON chunk:", jsonLine, parseError);
          }
        }

        // Clear the accumulated buffer if we processed all valid chunks
        accumulatedText = "";
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  static createSearchRequest(
    message: string,
    clientId?: string,
    imageFiles?: File[],
    pdfFile?: File,
    contentId?: string,
    libraryFiles?: string[],
    audio?: File
  ) {
    const formData = new FormData();
    formData.append("chat_message", message);

    if (audio) {
      formData.append("audio", audio);
    }

    if (clientId) {
      formData.append("client_id", clientId);
    }

    if (imageFiles && imageFiles.length) {
      imageFiles.forEach((file) => {
        formData.append("files", file, file.name);
      });
    }

    if (pdfFile) {
      formData.append("files", pdfFile, pdfFile.name);
    }

    if (contentId) {
      formData.append("content_id", contentId);
    }

    if (libraryFiles && libraryFiles.length) {
      formData.append("library_files", JSON.stringify(libraryFiles));
    }

    return formData;
  }

  static validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  static validateFileSize(file: File, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }

  static async prepareFilesForSearch(
    files: File[]
  ): Promise<{ files: File[]; pdf?: File; errors: string[] }> {
    const errors: string[] = [];
    const images: File[] = [];
    let pdf: File | undefined;

    const fileTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/pdf",
    ];
    const maxSizeInMB = 30;
    const maxImages = 10;

    for (const file of files) {
      if (!this.validateFileSize(file, maxSizeInMB)) {
        continue;
      }

      if (fileTypes.includes(file.type)) {
        if (images.length >= maxImages) {
          errors.push(`Only ${maxImages} files are allowed`);
        } else {
          images.push(file);
        }
      } else {
        errors.push(`File type ${file.type} is not supported`);
      }
    }

    return { files: images, pdf, errors };
  }
}
