import { Card, CardContent } from "shared/ui";
import { IDocumentMock } from "../../model";
import { File } from "lucide-react";
import ClosedFolder from "shared/assets/icons/closed-folder";
import { useLocation, useNavigate } from "react-router-dom";
import { DocumentEditPopover } from "../document-edit-popover";
import {
  renderAuthor,
  renderDate,
  renderFiles,
  renderReadyForReview,
  renderReviewer,
  renderReviewStatus,
} from "../../../../shared/ui/card-text-collection";
import { cn } from "shared/lib";

interface DocumentCardProps {
  document: IDocumentMock;
  withText?: boolean;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  withText = false,
}) => {
  const nav = useNavigate();
  const tab = useLocation().pathname.split("/")[2];
  const {
    title,
    folder,
    readyForReview,
    reviewStatus,
    reviewers,
    author,
    attachedFiles,
    createdAt,
  } = document;

  return (
    <button
      className="relative group w-full h-fit max-w-[277px]"
      onClick={(e) => {
        e.preventDefault();
        nav(
          `/content-manager/${tab}/document/${document.folderId}/${document.id}`
        );
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
            <File className="min-w-6" />
            <h2 className="text-xl font-bold truncate max-w-30">{title}</h2>
            <button
              className="z-10 ml-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <DocumentEditPopover />
            </button>
          </div>
          {!withText && (
            <p className="flex items-center gap-2 text-base font-semibold truncate">
              <ClosedFolder width={20} height={20} className="min-w-5" />
              {folder}
            </p>
          )}
          {renderAuthor(author, withText)}
          {renderReadyForReview(readyForReview)}
          {withText && renderFiles(attachedFiles, withText)}
          {!withText && renderReviewStatus(reviewStatus)}
          {renderReviewer(reviewers, withText)}
          {renderDate(createdAt, withText)}
        </CardContent>
      </Card>
    </button>
  );
};
