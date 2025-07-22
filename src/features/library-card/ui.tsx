import { ContentStatus } from "entities/content";
import BookMark from "shared/assets/icons/book-mark";
import BookMarkFilled from "shared/assets/icons/book-mark-filled";
import { cn } from "shared/lib";
import { Card, CardContent, renderAuthor } from "shared/ui";

interface LibraryCardProps {
  id: string;
  title: string;
  author: string;
  onStatusChange: (id: string, status: "read" | "saved_for_later") => void;
  onDocumentClick: (id: string) => void;
  contentStatus?: ContentStatus;
}

export const LibraryCard: React.FC<LibraryCardProps> = ({
  id,
  title,
  author,
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
        <CardContent className={cn("flex justify-between items-center p-4")}>
          <div className="flex flex-col gap-[8px]">
            <h2 className="text-[18px] xl:text-xl font-bold text-left truncate max-w-30 flex items-center justify-between">
              {trimToThreeWords(title)}
            </h2>
            <div className="flex items-center">
              <span className="hidden md:block">
                {renderAuthor(author, true)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-[12px]">
            <button
              className="bg-white"
              onClick={(e) => {
                e.stopPropagation();
                const isSaved = contentStatus?.status === "saved_for_later";
                onStatusChange(id, isSaved ? "read" : "saved_for_later");
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
          <span className="md:hidden block">{renderAuthor(author, true)}</span>
        </CardContent>
      </Card>
    </button>
  );
};
