import { ContentStatus } from "entities/content";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
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
  return (
    <button
      className="relative w-full group h-fit"
      onClick={() => onDocumentClick(id)}
    >
      <div className="absolute inset-0 bg-[#D0EFFF] rounded-[18px] transition-transform duration-200 group-hover:translate-x-2 group-hover:translate-y-2" />
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
            <h2
              className="text-[18px] xl:text-xl font-bold text-left flex items-center justify-between 
                line-clamp-2"
            >
              {title}
            </h2>
            <div className="flex items-center">
              <span>{renderAuthor(author, true)}</span>
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
                <MaterialIcon
                  iconName="bookmark"
                  fill={1}
                  className="text-[#1C63DB]"
                />
              ) : (
                <MaterialIcon iconName="bookmark" className="text-[#1C63DB]" />
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </button>
  );
};
