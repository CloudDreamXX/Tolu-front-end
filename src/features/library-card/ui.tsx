import { ContentStatus } from "entities/content";
import BookMark from "shared/assets/icons/book-mark";
import BookMarkFilled from "shared/assets/icons/book-mark-filled";
import { cn } from "shared/lib";
import {
  Card,
  CardContent,
  renderAuthor,
  renderDocumentType,
  renderStatus,
} from "shared/ui";

interface LibraryCardProps {
  id: string;
  title: string;
  author: string;
  type: string;
  status: string;
  progress: number;
  onStatusChange: (id: string, status: "read" | "saved_for_later") => void;
  onDocumentClick: (id: string) => void;
  contentStatus?: ContentStatus;
}

export const LibraryCard: React.FC<LibraryCardProps> = ({
  id,
  title,
  author,
  type,
  status,
  progress,
  onStatusChange,
  onDocumentClick,
  contentStatus
}) => {
  const trimToThreeWords = (text: string): string => {
    const words = text.trim().split(/\s+/);
    if (words.length <= 3) return text;
    return words.slice(0, 3).join(' ') + '...';
  }


  return (
    <button className="relative group w-full h-fit max-w-[718px]" onClick={() => onDocumentClick(id)}>
      <div
        className="
            absolute inset-0
            bg-[#D0EFFF]
            rounded-[18px]
            transition-transform duration-200
            group-hover:translate-x-2
            group-hover:translate-y-2
          "
      />
      <Card
        className="
            relative
            border border-[#008FF6]
            rounded-[18px]
            transition-transform duration-200
            shadow-[0px_4px_4px_rgba(0,0,0,0.25)]
            group-hover:shadow-[4px_4px_4px_rgba(0,0,0,0.25)]
          "
      >
        <CardContent className={cn("flex flex-col gap-[8px] p-4")}>
          <h2 className="text-xl font-bold text-left truncate max-w-30 flex items-center justify-between">
            {trimToThreeWords(title)}
            <div className="flex items-center gap-[12px]">
              {status === "To read" && <div
                style={{
                  backgroundImage: `linear-gradient(to right, #1C63DB 0%, #1C63DB ${progress}%, rgba(0,0,0,0) ${progress}%, rgba(0,0,0,0) 100%)`,
                }}
                className="flex h-[32px] text-[14px] text-nowrap items-center justify-between self-stretch bg-white rounded-[8px] border-[1px] border-[#1C63DB] py-[6px] gap-8 px-[16px]"
              >
                <span className={progress > 40 ? "text-white" : ""}>
                  In progress ...
                </span>
                <span>{progress}%</span>
              </div>}
              <button className="bg-white" onClick={(e) => {
                e.stopPropagation();
                onStatusChange(
                  id,
                  !contentStatus || contentStatus.status !== "saved_for_later"
                    ? "saved_for_later"
                    : "read"
                );
              }}>{contentStatus?.content_id === id && contentStatus.status === "saved_for_later" ? <BookMarkFilled /> : <BookMark />}</button>
            </div>
          </h2>
          <div className="flex items-center justify-between">
            {renderAuthor(author, true)}
            {renderStatus(status, true)}
            {renderDocumentType(type, true)}
          </div>
        </CardContent>
      </Card>
    </button>
  );
};
