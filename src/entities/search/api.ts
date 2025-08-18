import { ApiService } from "shared/api";
import {
  AiSearchRequest,
  SearchHistoryParams,
  SearchResultResponse,
  SearchResultResponseItem,
  SearchHistoryResponse,
  SearchHistoryItem,
  AIChatMessageResearch,
} from "./model";

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
    documentId?: string,
    clientId?: string
  ): Promise<void> {
    try {
      const formData = this.createSearchRequest(
        searchData.chat_message,
        searchData.images,
        searchData.pdf,
        clientId,
        documentId
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
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      if (!reader) {
        throw new Error("No response body reader available");
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

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
              onChunk(parsed);
            }
          } catch (parseError) {
            console.warn("Failed to parse JSON chunk:", jsonLine, parseError);
          }
        }

        accumulatedText = "";
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
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const formData = this.createSearchRequest(
        searchData.chat_message,
        searchData.images,
        searchData.pdf,
        searchData.clientId,
        searchData.contentId
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

  static async getSearchHistory(
    params: SearchHistoryParams = {}
  ): Promise<SearchHistoryItem[]> {
    const searchParams = new URLSearchParams();

    if (params.client_id) {
      searchParams.append("client_id", params.client_id);
    }

    if (params.managed_client_id) {
      searchParams.append("managed_client_id", params.managed_client_id);
    }

    const url = `/searched-result/history${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    const res = await ApiService.get<{
      history: SearchHistoryResponse[];
    }>(url);

    return res.history.map((item) => ({
      ...item,
      chatId: item.chat_id,
      chatTitle: item.chat_title,
      createdAt: item.created_at,
      userId: item.user_id,
    }));
  }

  static async getSession(chatId: string): Promise<SearchResultResponseItem[]> {
    const endpoint = `/session/${chatId}`;

    const res = await ApiService.get<SearchResultResponse>(endpoint);
    return res.search_results;
  }

  static async deleteChat(chatId: string): Promise<string> {
    const endpoint = `/chat/${chatId}`;

    return ApiService.delete<string>(endpoint);
  }

  static createSearchRequest(
    message: string,
    imageFiles?: File[],
    pdfFile?: File,
    clientId?: string,
    contentId?: string
  ) {
    const formData = new FormData();
    formData.append("chat_message", message);

    if (imageFiles && imageFiles.length) {
      imageFiles.forEach((file) => {
        formData.append("files", file, file.name);
      });
    }

    if (pdfFile) {
      formData.append("files", pdfFile, pdfFile.name);
    }

    if (clientId) {
      formData.append("client_id", clientId);
    }

    if (contentId) {
      formData.append("content_id", contentId);
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
  ): Promise<{ images: File[]; pdf?: File; errors: string[] }> {
    const errors: string[] = [];
    const images: File[] = [];
    let pdf: File | undefined;

    const imageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const pdfTypes = ["application/pdf"];
    const maxSizeInMB = 30;
    const maxImages = 10;

    for (const file of files) {
      if (!this.validateFileSize(file, maxSizeInMB)) {
        continue;
      }

      if (imageTypes.includes(file.type)) {
        if (images.length >= maxImages) {
          errors.push(`Only ${maxImages} image files are allowed`);
        } else {
          images.push(file);
        }
      } else if (pdfTypes.includes(file.type)) {
        if (pdf) {
          errors.push("Only one PDF file is allowed");
        } else {
          pdf = file;
        }
      } else {
        errors.push(`File type ${file.type} is not supported`);
      }
    }

    return { images, pdf, errors };
  }
}
