import { useNavigate } from "react-router-dom";
import { IFolderMock } from "../document-card";
import { Button, Card, CardContent } from "shared/ui";
import {
  renderDate,
  renderFiles,
  renderReviewer,
  renderReviewStatus,
  renderAuthor,
} from "../../../../shared/ui/card-text-collection";
import { cn } from "shared/lib";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

interface FolderCardProps {
  folder: IFolderMock;
  withText?: boolean;
}

export const FolderCard: React.FC<FolderCardProps> = ({ folder, withText }) => {
  const nav = useNavigate();
  const location = window.location.pathname;
  const tab = location.split("/")[2];
  const {
    name,
    files,
    status,
    reviewers,
    createdAt,
    author,
    id: folderId,
  } = folder;

  return (
    <Button
      variant={"unstyled"}
      size={"unstyled"}
      className="relative group w-full h-fit max-w-[277px]"
      onClick={(e) => {
        e.preventDefault();
        nav(`/content-manager/${tab}/folder/${folderId}`);
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
            <MaterialIcon iconName="folder" className="min-w-6" size={20} />
            <h2 className="text-xl font-bold truncate max-w-30">{name}</h2>
            {status === "archived" && (
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                className="z-10 ml-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <MaterialIcon iconName="backup" />
              </Button>
            )}
          </div>
          {renderFiles(files, withText)}
          {renderAuthor(author, withText)}
          {renderReviewStatus(status)}
          {renderReviewer(reviewers, withText)}
          {renderDate(createdAt, withText)}
        </CardContent>
      </Card>
    </Button>
  );
};
