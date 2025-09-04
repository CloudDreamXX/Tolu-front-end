import {
  ChatService,
  FetchChatDetailsResponse,
  FileMessage,
} from "entities/chat";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import { FileMessageItem } from "widgets/file-message-item";
import { RootState } from "../../../../entities/store/lib";

interface FilesTabProps {
  chatId?: string;
}

const getUniqueMessages = (messages: FileMessage[]): FileMessage[] => {
  return messages.filter(
    (msg, index, self) => index === self.findIndex((m) => m.id === msg.id)
  );
};

export const FilesTab: React.FC<FilesTabProps> = ({ chatId }) => {
  const [fileMessages, setFileMessages] = useState<FileMessage[]>([]);
  const [chatDetails, setChatDetails] =
    useState<FetchChatDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstScrollRef = useRef<HTMLDivElement>(null);
  const profile = useSelector((state: RootState) => state.user.user);

  const [page, setPage] = useState<number>(1);

  const hasNext = useRef(false);

  const loadFileMessages = async (page: number) => {
    if (loadingMore || chatId === undefined) return;

    try {
      setLoading(true);
      const res = await ChatService.fetchAllFilesByChatId(chatId, { page });
      const chat = await ChatService.fetchChatDetailsById(chatId);
      setChatDetails(chat);
      setFileMessages((prev) => {
        const updatedMessages = [...prev, ...res.files];
        return getUniqueMessages(updatedMessages);
      });

      if (page === 1) {
        firstScrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }

      hasNext.current = res.has_next;
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleScroll = () => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      if (scrollElement.scrollTop === 0 && !loadingMore && hasNext.current) {
        setLoadingMore(true);
        setPage((prevPage) => {
          const newPage = prevPage + 1;
          loadFileMessages(newPage);
          return newPage;
        });
      }
    }
  };

  useEffect(() => {
    loadFileMessages(page);
  }, [chatId, page]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      const scrollElement = scrollRef.current;
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scrollRef.current, loadingMore]);

  const isClient = profile?.roleName === "Client";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <MaterialIcon
          iconName="progress_activity"
          className="text-blue-500 animate-spin"
        />
      </div>
    );
  }

  const rendeerEmptyState = () => {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <p className="text-[18px] md:text-[20px] font-[500] text-[#1D1D1F]">
          There are no shared files
        </p>
      </div>
    );
  };

  return (
    <div
      ref={scrollRef}
      className={cn(
        "pr-3 overflow-auto custom-message-scroll",
        isClient
          ? "h-[calc(100vh-215.5px)] md:h-[calc(100vh-333px)] lg:h-[calc(100vh-160px)]"
          : "h-[calc(100vh-229px)] md:h-[calc(100vh-253px)] lg:h-[calc(100vh-240px)]"
      )}
    >
      {fileMessages.length === 0 ? (
        rendeerEmptyState()
      ) : (
        <div className="lg:p-6">
          <h1 className="mb-6 text-2xl font-semibold">Files</h1>
          <div className="flex flex-col flex-wrap min-h-full gap-4 lg:flex-row">
            {fileMessages.toReversed().map((message) => (
              <FileMessageItem
                key={message.id}
                message={message}
                avatar={chatDetails?.avatar_url}
              />
            ))}
            <div ref={firstScrollRef}></div>
          </div>
        </div>
      )}
    </div>
  );
};
