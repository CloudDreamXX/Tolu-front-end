import { useLocation, useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import { Button, Card, CardContent } from "shared/ui";
import {
  renderAuthor,
  renderDate,
  renderFiles,
  renderReadyForReview,
  renderReviewer,
  renderReviewStatus,
} from "../../../../shared/ui/card-text-collection";
import { IDocumentMock } from "../../model";
import { DocumentEditPopover } from "../document-edit-popover";

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
    <Button
      variant={"unstyled"}
      size={"unstyled"}
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
            <MaterialIcon iconName="draft" className="min-w-6" />
            <h2 className="text-xl font-bold truncate max-w-30">{title}</h2>
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              className="z-10 ml-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <DocumentEditPopover />
            </Button>
          </div>
          {!withText && (
            <p className="flex items-center gap-2 text-base font-semibold truncate">
              <MaterialIcon iconName="folder" className="min-w-5" size={20} />
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
    </Button>
  );
};
