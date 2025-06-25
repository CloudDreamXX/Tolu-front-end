import parse from "html-react-parser";

export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => (
  <div
    className={`flex ${
      message.type === "user" ? "justify-end" : "justify-start"
    }`}
  >
    <div
      className={`w-full ${
        message.type === "user" ? "order-2 max-w-[40%]" : "order-1 max-w-[70%]"
      }`}
    >
      {message.type === "user" ? (
        <div className="flex flex-col justify-end w-full">
          <div className="flex flex-row justify-between w-full text-sm text-[#1D1D1F]">
            <span className="font-semibold">You</span>
            <span>{message.timestamp.toLocaleDateString()}</span>
          </div>
          <div className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg">
            {message.content}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-end w-full">
          <div className="flex flex-row justify-between w-full text-sm text-[#1D1D1F]">
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
);
