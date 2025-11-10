import {
  ErrorDisplay,
  Message,
  MessageBubble,
  StreamingResponse,
} from "features/chat";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: Message[];
  isSearching: boolean;
  streamingText: string;
  error: string | null;
  isHistoryPopup?: boolean;
  onReadAloud?: () => void;
  isReadingAloud?: boolean;
  currentChatId?: string;
  selectedSwitch?: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isSearching,
  streamingText,
  error,
  isHistoryPopup,
  onReadAloud,
  isReadingAloud,
  currentChatId,
  selectedSwitch,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const prevSearchingRef = useRef(isSearching);

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    endRef.current?.scrollIntoView({ block: "end", behavior });
  };

  const isNearBottom = () => {
    const el = containerRef.current;
    if (!el) return true;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distance < 48;
  };

  useEffect(() => {
    scrollToBottom("auto");
  }, []);

  useEffect(() => {
    if (isSearching && isNearBottom()) {
      scrollToBottom("auto");
    }
  }, [streamingText]);

  useEffect(() => {
    const wasSearching = prevSearchingRef.current;
    prevSearchingRef.current = isSearching;

    if (wasSearching && !isSearching) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollToBottom("smooth"));
      });
    }
  }, [isSearching, messages.length]);

  return (
    <div
      ref={containerRef}
      className={`flex-1 w-full ${messages.length ? "py-4" : ""} overflow-y-auto bg-white h-full`}
    >
      <div className="space-y-4 md:px-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isHistoryPopup={isHistoryPopup}
            isReadingAloud={isReadingAloud}
            onReadAloud={onReadAloud}
            currentChatId={currentChatId}
            selectedSwitch={selectedSwitch}
          />
        ))}

        {isSearching && <StreamingResponse streamingText={streamingText} />}

        {error && <ErrorDisplay error={error} />}

        {/* sentinel */}
        <div ref={endRef} style={{ height: 1 }} />
      </div>
    </div>
  );
};
