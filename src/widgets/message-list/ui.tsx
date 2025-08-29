import {
  ErrorDisplay,
  Message,
  MessageBubble,
  StreamingResponse,
} from "features/chat";

interface MessageListProps {
  messages: Message[];
  isSearching: boolean;
  streamingText: string;
  error: string | null;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isSearching,
  streamingText,
  error,
}) => (
  <div
    className={`flex-1 w-full ${messages.length && "py-4"} overflow-y-auto bg-white rounded-b-xl h-full`}
  >
    <div className="max-h-full md:px-4 space-y-4 overflow-auto">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isSearching && <StreamingResponse streamingText={streamingText} />}

      {error && <ErrorDisplay error={error} />}
    </div>
  </div>
);
