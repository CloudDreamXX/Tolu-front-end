import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { SearchService, StreamChunk } from "entities/search/api";
import { SearchResultResponseItem } from "entities/search/model";
import { SearchAiChatInput } from "entities/search/ui/chat-input";
import {
  CopyIcon,
  DotsThreeIcon,
  DotsThreeVerticalIcon,
  ShareIcon,
  SpeakerSimpleHighIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "@phosphor-icons/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "shared/ui";
import { RotateCw } from "lucide-react";
import parse from "html-react-parser";
import { MagnifyingGlassPlusIcon } from "@phosphor-icons/react/dist/ssr";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export const LibraryChat = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [streamingText, setStreamingText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState<string>("");
  const [currentChatId, setCurrentChatId] = useState<string>(chatId ?? "");
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const initialSearchDone = useRef(false);
  const sessionLoadDone = useRef(false);

  const initialMessage = location.state?.message;
  const searchType = location.state?.searchType;
  const files = location.state?.files;

  const isExistingChat = chatId && !chatId.startsWith("new_chat_");

  useEffect(() => {
    const initialize = async () => {
      if (isInitialized) return;

      if (initialMessage && location.state?.message) {
        console.log("Processing initial message:", initialMessage);

        setMessages([]);
        setError(null);
        setChatTitle("");
        initialSearchDone.current = false;
        sessionLoadDone.current = false;

        const userMessage: Message = {
          id: Date.now().toString(),
          type: "user",
          content: initialMessage,
          timestamp: new Date(),
        };

        setMessages([userMessage]);

        if (isExistingChat && location.state?.isNewSearch) {
          const newChatId = `new_chat_${Date.now()}`;
          setCurrentChatId(newChatId);
          navigate(`/library/${newChatId}`, {
            replace: true,
            state: { message: initialMessage, searchType },
          });
          return;
        }

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        if (!initialSearchDone.current) {
          initialSearchDone.current = true;
          await handleInitialSearch(initialMessage);
        }
      } else if (isExistingChat && !sessionLoadDone.current) {
        console.log("Loading existing session for:", chatId);
        sessionLoadDone.current = true;
        await loadExistingSession();
      }

      setIsInitialized(true);
    };

    initialize();
  }, [chatId, initialMessage, location.state]);

  const loadExistingSession = async () => {
    if (!chatId) return;

    setIsLoadingSession(true);
    setError(null);

    try {
      const sessionData = await SearchService.getSession(chatId);

      if (sessionData && sessionData.length > 0) {
        const chatMessages: Message[] = [];

        sessionData.forEach((item: SearchResultResponseItem) => {
          if (item.query) {
            chatMessages.push({
              id: `user-${item.id}`,
              type: "user",
              content: item.query,
              timestamp: new Date(item.created_at),
            });
          }

          if (item.answer) {
            chatMessages.push({
              id: `ai-${item.id}`,
              type: "ai",
              content: item.answer,
              timestamp: new Date(item.created_at),
            });
          }
        });

        chatMessages.sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        );

        setMessages(chatMessages);

        if (sessionData[0]?.chat_title) {
          setChatTitle(sessionData[0].chat_title);
        }
      }
    } catch (error) {
      console.error("Error loading chat session:", error);
      setError("Failed to load chat session");
    } finally {
      setIsLoadingSession(false);
    }
  };

  const handleInitialSearch = async (message: string) => {
    if (isSearching) return;

    console.log("Starting initial search with message:", message);
    setIsSearching(true);
    setStreamingText("");
    setError(null);

    let accumulatedText = "";

    try {
      await SearchService.aiSearchStream(
        {
          chat_message: JSON.stringify({
            user_prompt: message,
            is_new: true,
            chat_id: currentChatId,
            regenerate_id: null,
          }),
          ...(files?.length > 0 ? { image: files } : {}),
        },
        (chunk: StreamChunk) => {
          if (chunk.reply) {
            accumulatedText += chunk.reply;
            setStreamingText(accumulatedText);
          }
        },
        (finalData) => {
          setIsSearching(false);

          const aiMessage: Message = {
            id: finalData.chat_id || Date.now().toString(),
            type: "ai",
            content: accumulatedText,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, aiMessage]);
          setStreamingText("");

          if (finalData.chat_id && finalData.chat_id !== currentChatId) {
            setCurrentChatId(finalData.chat_id);

            if (currentChatId.startsWith("new_chat_")) {
              navigate(`/library/${finalData.chat_id}`, { replace: true });
            }
          }

          if (finalData.chat_title) {
            setChatTitle(finalData.chat_title);
          }
        },
        (error) => {
          setIsSearching(false);
          setError(error.message);
          console.error("Search error:", error);
        }
      );
    } catch (error) {
      setIsSearching(false);
      setError(error instanceof Error ? error.message : "Search failed");
      console.error("Search error:", error);
    }
  };

  const handleNewMessage = async (
    message: string,
    files: File[],
    searchType: string
  ) => {
    if (!message.trim() || isSearching) return;

    console.log("Sending new message:", message);

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsSearching(true);
    setStreamingText("");
    setError(null);

    let accumulatedText = "";

    try {
      await SearchService.aiSearchStream(
        {
          chat_message: JSON.stringify({
            user_prompt: message,
            is_new: false,
            chat_id: currentChatId,
            regenerate_id: null,
          }),
        },
        (chunk: StreamChunk) => {
          if (chunk.reply) {
            accumulatedText += chunk.reply;
            setStreamingText(accumulatedText);
          }
        },
        (finalData) => {
          setIsSearching(false);

          const aiMessage: Message = {
            id: finalData.chat_id || Date.now().toString(),
            type: "ai",
            content: accumulatedText,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, aiMessage]);
          setStreamingText("");

          if (finalData.chat_id && finalData.chat_id !== currentChatId) {
            setCurrentChatId(finalData.chat_id);
          }

          if (finalData.chat_title) {
            setChatTitle(finalData.chat_title);
          }
        },
        (error) => {
          setIsSearching(false);
          setError(error.message);
          console.error("Search error:", error);
        }
      );
    } catch (error) {
      setIsSearching(false);
      setError(error instanceof Error ? error.message : "Search failed");
      console.error("Search error:", error);
    }
  };

  const handleRegenerateResponse = async () => {
    if (messages.length < 2 || isSearching) return;

    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.type === "user");
    if (!lastUserMessage) return;

    setMessages((prev) => {
      const lastAiIndex = prev.map((msg) => msg.type).lastIndexOf("ai");
      if (lastAiIndex !== -1) {
        return prev.slice(0, lastAiIndex);
      }
      return prev;
    });

    setIsSearching(true);
    setStreamingText("");
    setError(null);

    let accumulatedText = "";

    try {
      await SearchService.aiSearchStream(
        {
          chat_message: JSON.stringify({
            user_prompt: lastUserMessage.content,
            is_new: false,
            chat_id: currentChatId,
            regenerate_id: Date.now().toString(),
          }),
        },
        (chunk: StreamChunk) => {
          if (chunk.reply) {
            accumulatedText += chunk.reply;
            setStreamingText(accumulatedText);
          }
        },
        (finalData) => {
          setIsSearching(false);

          const aiMessage: Message = {
            id: finalData.chat_id || Date.now().toString(),
            type: "ai",
            content: accumulatedText,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, aiMessage]);
          setStreamingText("");
        },
        (error) => {
          setIsSearching(false);
          setError(error.message);
          console.error("Regenerate error:", error);
        }
      );
    } catch (error) {
      setIsSearching(false);
      setError(error instanceof Error ? error.message : "Regenerate failed");
      console.error("Regenerate error:", error);
    }
  };

  const displayChatTitle =
    chatTitle ||
    (currentChatId ? `Chat ${currentChatId.slice(0, 8)}...` : "New Chat");
  const displayChatId = currentChatId || chatId;

  if (isLoadingSession) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
          <span className="text-sm text-blue-600">Loading chat session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full gap-6 p-6">
      <div className="">
        <Breadcrumb className="flex flex-row gap-2 text-sm text-gray-600">
          <BreadcrumbLink href="/library">Library</BreadcrumbLink>
          <BreadcrumbSeparator className="text-gray-400" />
          <BreadcrumbItem className="text-gray-800">
            {displayChatTitle}
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="flex flex-row w-full h-full gap-6 max-h-[calc(100vh-6rem)]">
        <div className="flex flex-col gap-2">
          <button className="bg-[#DDEBF6] rounded-full h-8 w-8">
            <CopyIcon weight="bold" className="w-4 h-4 m-auto text-blue-600" />
          </button>
          <button className="bg-[#DDEBF6] rounded-full h-8 w-8">
            <ShareIcon weight="bold" className="w-4 h-4 m-auto text-blue-600" />
          </button>
          <button className="bg-[#DDEBF6] rounded-full h-8 w-8">
            <SpeakerSimpleHighIcon
              weight="bold"
              className="w-4 h-4 m-auto text-blue-600"
            />
          </button>
          <button className="bg-[#DDEBF6] rounded-full h-8 w-8">
            <ThumbsUpIcon
              weight="bold"
              className="w-4 h-4 m-auto text-blue-600"
            />
          </button>
          <button className="bg-[#DDEBF6] rounded-full h-8 w-8">
            <ThumbsDownIcon
              weight="bold"
              className="w-4 h-4 m-auto text-blue-600"
            />
          </button>
          <button
            className="bg-[#DDEBF6] rounded-full h-8 w-8"
            onClick={handleRegenerateResponse}
            disabled={isSearching || messages.length < 2}
            title="Regenerate response"
          >
            <RotateCw className="w-4 h-4 m-auto text-blue-600" />
          </button>
        </div>
        <div className="flex flex-col w-full h-full rounded-xl overflow-clip">
          {/* Header */}
          <div className="flex items-center justify-between w-full p-4 bg-white border-b">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-semibold text-gray-800">
                {displayChatTitle}
              </div>
              {isExistingChat && (
                <div className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded">
                  Existing Chat
                </div>
              )}
            </div>
            <div className="flex flex-row gap-2">
              <button
                className="flex flex-row items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700"
                onClick={() => navigate("/library")}
              >
                <MagnifyingGlassPlusIcon width={24} height={24} /> New Search
              </button>
              <button
                className="flex flex-row items-center gap-2 p-2 text-sm font-medium text-white bg-[#DDEBF6] rounded-full hover:bg-blue-200"
                onClick={() => navigate("/library")}
              >
                <DotsThreeVerticalIcon width={24} height={24} color="#000" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 w-full py-4 overflow-y-auto bg-white rounded-b-xl">
            <div className="max-h-full px-4 space-y-4 overflow-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`w-full ${message.type === "user" ? "order-2 max-w-[40%]" : "order-1 max-w-[70%]"}`}
                  >
                    {message.type === "user" ? (
                      <div className="flex flex-col justify-end w-full">
                        <div className="flex flex-row justify-between w-full text-sm color-[#1D1D1F]">
                          <span className="font-semibold">You</span>
                          <span>{message.timestamp.toLocaleDateString()}</span>
                        </div>
                        <div className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg">
                          {message.content}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-end w-full">
                        <div className="flex flex-row justify-between w-full text-sm color-[#1D1D1F]">
                          <span className="font-semibold">AI Assistant</span>
                          <span>{message.timestamp.toLocaleDateString()}</span>
                        </div>
                        <div className="text-sm text-[#1D1D1F] bg-[#ECEFF4] px-[14px] py-[10px] rounded-md">
                          {parse(message.content)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Streaming AI Response */}
              {isSearching && (
                <div className="flex justify-start">
                  <div className="max-w-[70%] min-w-36">
                    <div className="flex flex-col items-start gap-3">
                      <div className="flex flex-row justify-between w-full text-sm color-[#1D1D1F]">
                        <span className="font-semibold">AI Assistant</span>
                        <span>Just Now</span>
                      </div>

                      {streamingText ? (
                        <div className="text-sm text-[#1D1D1F] bg-[#ECEFF4] px-[14px] py-[10px] rounded-md">
                          {parse(streamingText)}
                          <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse"></span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <div
                              className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                          <span className="text-sm text-blue-600">
                            AI is thinking...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-5 h-5 bg-red-500 rounded-full">
                      <span className="text-xs text-white">!</span>
                    </div>
                    <span className="text-sm font-medium text-red-700">
                      Error
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <SearchAiChatInput
            placeholder="Your message"
            onSend={handleNewMessage}
            disabled={isSearching}
            className="mt-4"
          />
        </div>
      </div>
    </div>
  );
};
