import { useEffect, useState } from "react";
import { renderResultBlocks, smartRender } from "./lib";
import { ChatActions } from "../chat-actions";

export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  document?: string;
  images?: string[];
  pdfs?: {
    name: string;
    url: string;
    type: string;
  }[];
}

interface MessageBubbleProps {
  message: Message;
  isHistoryPopup?: boolean;
  onReadAloud?: () => void;
  isReadingAloud?: boolean;
  isSearching?: boolean;
  currentChatId?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isHistoryPopup,
  isReadingAloud,
  isSearching,
  onReadAloud,
  currentChatId,
}) => {
  const [renderedContent, setRenderedContent] = useState<React.ReactNode>(null);
  const isContentManager =
    location.pathname.includes("content-manager") ||
    location.pathname.includes("clients");

  const cleanedContent = message.content.replace(
    /Conversational Response/g,
    ""
  );

  useEffect(() => {
    const render = async () => {
      const result = await smartRender(cleanedContent);
      setRenderedContent(result);
    };
    render();
  }, [cleanedContent]);

  return (
    <div style={{ all: "revert", fontFamily: "'Inter', sans-serif" }}>
      <div
        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"
          }`}
      >
        <div
          className={`w-full ${message.type === "user"
            ? "order-2 max-w-[50%]"
            : "order-1 w-full md:max-w-[70%]"
            }`}
        >
          {message.type === "user" ? (
            <div className="flex flex-col justify-end w-full">
              <div className="flex flex-row justify-between w-full text-sm text-[#1D1D1F]">
                <span className="font-semibold ">You</span>
                <span>{message.timestamp.toLocaleDateString()}</span>
              </div>
              <div
                className={`w-full px-4 py-2 ${isContentManager ? "text-black bg-blue-500/10" : "text-white bg-blue-500"} rounded-lg`}
              >
                {message.pdfs?.map((pdf, i) => (
                  <a
                    key={i}
                    href={pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 mt-2 px-3 py-1 mb-[5px] rounded-lg bg-white border hover:bg-[#3A3A3A] transition-colors w-full max-w-[280px]"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-[#1C63DB]/10 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#1C63DB"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                      >
                        <path
                          d="M6 2a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 
        2 0 0 0 2-2V8l-6-6H6zm7 7V3.5L18.5 
        9H13z"
                        />
                      </svg>
                    </div>

                    <div className="flex flex-col overflow-hidden">
                      <p className="text-[14px] font-medium truncate max-w-[180px]">
                        {pdf.name}
                      </p>
                      <span className="text-gray-400 text-[13px] uppercase tracking-wide">
                        {pdf.type.split("/")[1] || "PDF"}
                      </span>
                    </div>
                  </a>
                ))}
                {message.content}
                {!!message.images?.length && (
                  <div
                    className={`mt-2 grid gap-2 grid-cols-1
                      `}
                  >
                    {message.images.map((src, idx) => (
                      <a
                        key={src + idx}
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                        title="Open image"
                      >
                        <img
                          src={src}
                          alt={`uploaded-${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-[#E5E7EB]"
                          loading="lazy"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-end w-full">
              <div className="flex flex-row justify-between w-full text-sm text-[#1D1D1F]">
                <span className="font-semibold ">AI Assistant</span>
                <span>{message.timestamp.toLocaleDateString()}</span>
              </div>
              <div className="text-[#1D1D1F] bg-white px-[14px] py-[10px] rounded-md ">
                {renderedContent}
                {message.document && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2  pb-[10px]">
                    {renderResultBlocks(message.document || "")}
                  </div>
                )}
                {isContentManager && onReadAloud && (
                  <ChatActions
                    chatState={[message]}
                    isSearching={isSearching ?? false}
                    hasMessages={true}
                    isHistoryPopup={isHistoryPopup}
                    onReadAloud={onReadAloud}
                    isReadingAloud={isReadingAloud}
                    currentChatId={currentChatId}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
