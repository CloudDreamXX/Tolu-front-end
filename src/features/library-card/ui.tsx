import { cn } from "shared/lib";
import {
  Card,
  CardContent,
  renderAuthor,
  renderDate,
  renderRecommendedBy,
} from "shared/ui";

interface LibraryCardProps {
  title: string;
  author: string;
  recomendedBy: string;
  timestamp: string;
}

export const LibraryCard: React.FC<LibraryCardProps> = ({
  title,
  author,
  recomendedBy,
  timestamp,
}) => {
  return (
    <button className="relative group w-full h-fit max-w-[351px]">
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
        <CardContent className={cn("flex flex-col gap-2.5 p-4")}>
          <h2 className="text-xl font-bold text-left truncate max-w-30">
            {title}
          </h2>

          {renderAuthor(author, true)}
          {renderRecommendedBy(recomendedBy, true)}
          {renderDate(timestamp, true)}
        </CardContent>
      </Card>
    </button>
  );
};
