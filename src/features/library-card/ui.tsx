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
  contentStatus,
}) => {
  const trimToThreeWords = (text: string): string => {
    const words = text.trim().split(/\s+/);
    if (words.length <= 3) return text;
    return words.slice(0, 3).join(" ") + "...";
  };

  return (
    <button
      className="relative group w-full h-fit"
      onClick={() => onDocumentClick(id)}
    >
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
          <h2 className="text-[18px] xl:text-xl font-bold text-left truncate max-w-30 flex items-center justify-between">
            {trimToThreeWords(title)}
            <div className="flex items-center gap-[12px]">
              <button
                className="bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange(
                    id,
                    !contentStatus || contentStatus.status !== "saved_for_later"
                      ? "saved_for_later"
                      : "read"
                  );
                }}
              >
                {contentStatus?.content_id === id &&
                contentStatus.status === "saved_for_later" ? (
                  <BookMarkFilled />
                ) : (
                  <BookMark />
                )}
              </button>
            </div>
          </h2>
          {status === "To read" && progress > 0 && (
            <div className="w-full flex flex-col gap-[8px]">
              <div className="flex justify-between">
                <span className="text-[16px] text-[#1B2559] font-[600] px-[8px] py-[2px] bg-[#DDEBF6] rounded-[8px]">
                  Chronic constipation relief
                </span>
                <span className="text-[16px] text-[#1B2559] font-[600]">
                  {progress}%
                </span>
              </div>
              <div className="h-[4px] w-full bg-[#E0F0FF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1C63DB]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            {renderStatus(status, true)}
            {renderDocumentType(type, true)}
            <span className="hidden md:block">
              {renderAuthor(author, true)}
            </span>
          </div>
          <span className="md:hidden block">{renderAuthor(author, true)}</span>
        </CardContent>
      </Card>
    </button>
  );
};
