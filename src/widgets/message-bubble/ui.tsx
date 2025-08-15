import { ChatMessage } from "entities/chat";
import React from "react";
import { cn, usePageWidth } from "shared/lib";
import { Avatar, AvatarFallback, AvatarImage } from "shared/ui";
import { FileItem } from "widgets/file-item";

interface MessageBubbleProps {
  message: ChatMessage;
  avatar?: string;
  author?: string;
  isOnlaine?: boolean;
  isOwn?: boolean;
  className?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  avatar,
  author,
  isOnlaine = false,
  isOwn = false,
  className = "",
}) => {
  const { isMobile } = usePageWidth();
  const isFileMessage =
    message.file_name !== null &&
    message.file_size !== null &&
    message.file_url !== null;

  const formatTextWithBreaks = (text: string) => {
    return text.split("\n").map((line) => (
      <React.Fragment key={line}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const renderFileMessage = () => (
    <div
      className={cn(
        "rounded-lg  p-2 text-base text-[#1D1D1F] flex flex-wrap gap-2 w-fit",
        isOwn
          ? "bg-[#AAC6EC] rounded-tr-none"
          : "bg-white border border-[#DBDEE1] rounded-tl-none",
        className
      )}
    >
      <FileItem
        key={message.id}
        fileName={message.file_name}
        fileSize={message.file_size}
        fileUrl={message.file_url}
        fileType={message.file_type}
        className={cn(isOwn ? "bg-white " : "bg-[#AAC6EC] ")}
      />
    </div>
  );

  const renderTextMessage = () => (
    <span
      className={cn(
        "rounded-lg px-[14px] py-[10px] text-base text-[#1D1D1F] w-fit",
        isOwn
          ? "bg-[#AAC6EC] rounded-tr-none self-end"
          : "bg-white border border-[#DBDEE1] rounded-tl-none",
        className
      )}
    >
      {formatTextWithBreaks(message.content)}
    </span>
  );

  return (
    <div className={cn("flex flex-col w-full ", isOwn ? "" : "items-start")}>
      <div className={cn("flex", isOwn && "justify-end")}>
        {!isMobile && !isOwn && (
          <div className="relative mr-3">
            <Avatar className="w-10 h-10 ">
              <AvatarImage src={avatar} />
              <AvatarFallback className="bg-slate-300">
                {author?.slice(0, 2).toLocaleUpperCase() || "UN"}
              </AvatarFallback>
            </Avatar>
            {isOnlaine && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border border-white rounded-full" />
            )}
          </div>
        )}
        <div
          className={cn(
            "flex flex-col-reverse md:flex-col md:gap-1.5 w-fit max-w-[70%]",
            isOwn && isMobile ? "items-end" : undefined
          )}
        >
          <div className="flex justify-between font-semibold text-[#1D1D1F] text-[12px] md:text-[14px]">
            {!isMobile && (
              <span className="text-nowrap">{isOwn ? "You" : author}</span>
            )}
            <span className="ml-4 text-muted-foreground whitespace-nowrap">
              {new Date(message.created_at).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          {isFileMessage ? renderFileMessage() : renderTextMessage()}
        </div>
      </div>
    </div>
  );
};
