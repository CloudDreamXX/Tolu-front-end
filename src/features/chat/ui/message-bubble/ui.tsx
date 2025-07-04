import parse from "html-react-parser";
import { useNavigate } from "react-router-dom";

export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  document?: string;
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
            <div className="custom-transparent">{parse(message.content)}</div>{" "}
            {message.document && (
              <div className="grid grid-cols-2 gap-2">
                {renderResultBlocks(message.document || "")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
);

const renderResultBlocks = (rawContent: string) => {
  const nav = useNavigate();
  const blocks = rawContent
    .split(/\n\n+/)
    .filter((b) => b.includes("/content/retrieve/"));

  return blocks.map((block, index) => {
    const idmatch = block.match(/\/content\/retrieve\/([a-f0-9-]{36})/i);
    const folderMatch = block.match(/\*\*Folder:\*\* (.+)/);
    const previewMatch = block.match(/\*\*Preview:\*\* (.+)/);
    const createdMatch = block.match(/\*\*Created:\*\* (.+)/);

    const id = idmatch?.[1];
    const folder = folderMatch?.[1];
    const previewHtml = previewMatch?.[1];
    const { heading } = extractAndCleanPreview(previewHtml || "");
    const created = createdMatch?.[1];

    return (
      <div
        key={index}
        className="p-4 my-3 bg-white border rounded-md shadow-sm h-[140px] flex flex-col justify-between"
        onClick={() => {
          window.open(
            `/library/document/${id}`,
            "_blank",
            "noopener,noreferrer"
          );
          nav(``);
        }}
      >
        <p className="mb-1 font-bold cursor-pointer hover:underline line-clamp-3">
          {heading}
        </p>
        <p className="mb-2 text-sm text-gray-500">{folder}</p>
        <div className="text-sm line-clamp-2">{created}</div>
      </div>
    );
  });
};

const extractAndCleanPreview = (
  previewHtml: string
): {
  heading: string | null;
  cleanedHtml: string;
} => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(previewHtml, "text/html");

    const headingElement = doc.querySelector("h1, h2, h3, h4, h5, h6");
    const heading = headingElement?.textContent?.trim() || null;

    if (headingElement?.parentNode) {
      headingElement.parentNode.removeChild(headingElement);
    }

    const cleanedHtml = doc.body.innerHTML.trim();

    return { heading, cleanedHtml };
  } catch {
    return { heading: null, cleanedHtml: previewHtml };
  }
};
