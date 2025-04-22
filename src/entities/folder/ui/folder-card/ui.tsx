import { useNavigate } from "react-router-dom";
import { IFolder } from "../document-card";
import { Card, CardContent } from "shared/ui";
import {
  renderDate,
  renderFiles,
  renderReviewer,
  renderReviewStatus,
} from "../lib";
import ClosedFolder from "shared/assets/icons/closed-folder";

interface FolderCardProps {
  folder: IFolder;
}

export const FolderCard: React.FC<FolderCardProps> = ({ folder }) => {
  const nav = useNavigate();
  const { name, files, status, reviewers, createdAt, id } = folder;

  return (
    <button
      className="relative group w-full h-fit max-w-[277px]"
      onClick={(e) => {
        e.preventDefault();
        console.log(e.target);
        nav(`/content-manager/folder/${id}`);
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
        <CardContent className="flex flex-col gap-3.5 p-4">
          <div className="flex items-center gap-2">
            <ClosedFolder className="min-w-6" />
            <h2 className="text-xl font-bold truncate max-w-30">{name}</h2>
            <button
              className="z-10 ml-auto"
              onClick={(e) => e.stopPropagation()}
            ></button>
          </div>
          {renderFiles(files)}
          {renderReviewStatus(status)}
          {renderReviewer(reviewers)}
          {renderDate(createdAt)}
        </CardContent>
      </Card>
    </button>
  );
};
