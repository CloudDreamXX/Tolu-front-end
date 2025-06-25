import { LibraryChatInput } from "entities/search";
import { SearchService, StreamChunk } from "entities/search/api";
import { RootState } from "entities/store";
import { Message } from "features/chat";
import { Expand } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Tolu from "shared/assets/icons/tolu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "shared/ui";
import { MessageList } from "widgets/message-list";

export const LibrarySmallChat = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [streamingText, setStreamingText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [chatTitle, setChatTitle] = useState<string>("");

  const handleExpandClick = () => {
    if (currentChatId) {
      navigate(`/library/${currentChatId}`);
    } else {
      navigate("/library");
    }
  };

  const handleNewMessage = async (
    message: string,
    files: File[],
    personalize: boolean
  ) => {
    if ((!message.trim() && files.length === 0) || isSearching) return;

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

    const {
      image,
      pdf,
      errors: fileErrors,
    } = await SearchService.prepareFilesForSearch(files);

    if (fileErrors.length > 0) {
      setError(fileErrors.join("\n"));
      setIsSearching(false);
      return;
    }

    let accumulatedText = "";

    try {
      await SearchService.aiSearchStream(
        {
          chat_message: JSON.stringify({
            user_prompt: message,
            is_new: !currentChatId,
            chat_id: currentChatId,
            regenerate_id: null,
            personalize,
          }),
          ...(image && { image }),
          ...(pdf && { pdf }),
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

  return (
    <Card className="flex flex-col w-full h-full border-none rounded-2xl">
      <CardHeader className="relative flex flex-col items-center gap-4">
        <div className="p-2.5 bg-[#1C63DB] w-fit rounded-lg">
          <Tolu />
        </div>
        <CardTitle>{chatTitle || `${user?.name} AI assistant`}</CardTitle>
        <button
          className="absolute top-4 left-4"
          onClick={handleExpandClick}
          title="Expand chat"
        >
          <Expand className="w-6 h-6 text-[#5F5F65]" />
        </button>
      </CardHeader>
      <CardContent className="flex flex-1 w-full h-full min-h-0 overflow-y-auto">
        <MessageList
          messages={messages}
          isSearching={isSearching}
          streamingText={streamingText}
          error={error}
        />
      </CardContent>
      <CardFooter className="w-full p-0 ">
        <LibraryChatInput
          className="w-full p-6 border-t rounded-t-none rounded-b-2xl"
          onSend={handleNewMessage}
          disabled={isSearching}
        />
      </CardFooter>
    </Card>
  );
};
