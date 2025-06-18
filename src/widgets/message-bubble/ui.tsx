import { cn } from "shared/lib";
import { FileItem } from "widgets/file-item";
import { File } from "lucide-react";

interface MessageBubbleProps {
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
  text,
  time,
  name = "",
  isOwn = false,
  className = "",
  file = [],
}) => {
  return (
    <div
      className={cn(
        "flex flex-col w-full h-fit",
        isOwn ? "items-end" : "items-start"
      )}
    >
      <div className="flex flex-col gap-1.5 w-fit max-w-[70%]">
        <div className="flex justify-between font-semibold text-[#1D1D1F] text-[14px]">
          <span>{isOwn ? "You" : name}</span>
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
  );
};
