import { useEffect, useState } from "react";
import { renderResultBlocks, smartRender } from "./lib";

export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  document?: string;
  images?: string[];
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [renderedContent, setRenderedContent] = useState<React.ReactNode>(null);

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
        className={`flex ${
          message.type === "user" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`w-full ${
            message.type === "user"
              ? "order-2 max-w-[40%]"
              : "order-1 w-full md:max-w-[70%]"
          }`}
        >
          {message.type === "user" ? (
            <div className="flex flex-col justify-end w-full">
              <div className="flex flex-row justify-between w-full text-sm text-[#1D1D1F]">
                <span className="font-semibold font-inter">You</span>
                <span className="font-inter">
                  {message.timestamp.toLocaleDateString()}
                </span>
              </div>
              <div className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg font-inter">
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
                <span className="font-semibold font-inter">AI Assistant</span>
                <span className="font-inter">
                  {message.timestamp.toLocaleDateString()}
                </span>
              </div>
              <div className="text-[#1D1D1F] font-inter bg-[#ECEFF4] px-[14px] py-[10px] rounded-md font-inter">
                {renderedContent}
                {message.document && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-inter pb-[10px]">
                    {renderResultBlocks(message.document || "")}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
