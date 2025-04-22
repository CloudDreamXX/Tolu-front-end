import { useNavigate } from "react-router-dom";
import { IFolder } from "../document-card";
import { Card, CardContent } from "shared/ui";
import {
  renderDate,
  renderFiles,
  renderReviewer,
  renderReviewStatus,
  renderAuthor,
} from "../lib";
import ClosedFolder from "shared/assets/icons/closed-folder";
import { cn } from "shared/lib";
import { ArchiveRestore } from "lucide-react";

interface FolderCardProps {
  folder: IFolder;
  withText?: boolean;
}

export const FolderCard: React.FC<FolderCardProps> = ({ folder, withText }) => {
  const nav = useNavigate();
  const location = window.location.pathname;
  const tab = location.split("/")[2];
  const { name, files, status, reviewers, createdAt, author, id } = folder;

  return (
    <button
      className="relative group w-full h-fit max-w-[277px]"
      onClick={(e) => {
        e.preventDefault();
        console.log(e.target);
        nav(`/content-manager/folder/${tab}/${id}`);
      }}
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
        <CardContent
          className={cn("flex flex-col gap-3.5 p-4", withText && "gap-2")}
        >
          <div className="flex items-center gap-2">
            <ClosedFolder className="min-w-6" />
            <h2 className="text-xl font-bold truncate max-w-30">{name}</h2>
            {status === "archived" && (
              <button
                className="z-10 ml-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <ArchiveRestore size={24} />
              </button>
            )}
          </div>
          {renderFiles(files, withText)}
          {renderAuthor(author, withText)}
          {renderReviewStatus(status)}
          {renderReviewer(reviewers, withText)}
          {renderDate(createdAt, withText)}
        </CardContent>
      </Card>
    </button>
  );
};
