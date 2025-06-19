import { ChatItemModel, chatItems } from "pages/content-manager";
import { useEffect, useState } from "react";
import { cn, usePageWidth } from "shared/lib";
import { Avatar, AvatarFallback, AvatarImage } from "shared/ui";
import { FileItem } from "widgets/file-item";

interface MessageBubbleProps {
  chatId?: string;
  text?: string;
  time: string;
  name?: string;
  isOwn?: boolean;
  className?: string;
  file?: {
    id: string;
    file: File;
  }[];
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  chatId,
  text,
  time,
  name = "",
  isOwn = false,
  className = "",
  file = [],
}) => {
  const [chat, setChat] = useState<ChatItemModel | null>();
  const { isMobile } = usePageWidth();

  useEffect(() => {
    //mock logic
    const result = chatItems.find((e) => e.id === chatId);
    setChat(result);
  }, [chatId]);

  return (
    <div
      className={cn(
        "flex flex-col w-full h-fit",
        isOwn ? "items-end" : "items-start"
      )}
    >
      <div className={cn("flex", isOwn && "justify-end")}>
        {!isMobile && !isOwn && (
          <div className="relative mr-3">
            <Avatar className="w-10 h-10 ">
              <AvatarImage src={chat?.avatar} />
              <AvatarFallback className="bg-slate-300">AF</AvatarFallback>
            </Avatar>
            {chat?.isOnline && (
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
            {!isMobile && <span>{isOwn ? "You" : name}</span>}
            <span className="text-muted-foreground whitespace-nowrap">
              {time}
            </span>
          </div>
          {text && text.trim().length > 0 && (
            <span
              className={cn(
                "rounded-lg px-[14px] py-[10px] text-base text-[#1D1D1F]",
                isOwn
                  ? "bg-[#AAC6EC] rounded-tr-none"
                  : "bg-white border border-[#DBDEE1] rounded-tl-none",
                className
              )}
            >
              {text}
            </span>
          )}
          {file.length > 0 && (
            <div
              className={cn(
                "rounded-lg px-[14px] py-[10px] text-base text-[#1D1D1F] flex flex-wrap gap-2",
                isOwn
                  ? "bg-[#AAC6EC] rounded-tr-none"
                  : "bg-white border border-[#DBDEE1] rounded-tl-none",
                className
              )}
            >
              {file.map((f) => (
                <FileItem
                  key={f.id}
                  file={f.file}
                  classname={cn(isOwn ? "bg-white " : "bg-[#AAC6EC] ")}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
