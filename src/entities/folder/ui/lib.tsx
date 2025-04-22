import { FolderStatus, ReviewStatus } from "entities/folder";
import { Clock, File } from "lucide-react";
import DateIcon from "shared/assets/icons/date";
import Expert from "shared/assets/icons/expert";
import Flag from "shared/assets/icons/flag";
import NotReadyForNext from "shared/assets/icons/not-ready-for-next";
import ReadyForNext from "shared/assets/icons/ready-for-next";
import { cn, formatDateToSlash } from "shared/lib";

export const renderReadyForReview = (readyForReview: boolean | undefined) => {
  if (readyForReview === undefined) return null;
  return (
    <div className={cn("flex items-center gap-2 text-base font-semibold")}>
      {readyForReview ? <ReadyForNext /> : <NotReadyForNext />}
      Ready for review
    </div>
  );
};

export const renderReviewStatus = (
  reviewStatus: ReviewStatus | FolderStatus | undefined
) => {
  if (!reviewStatus) return null;

  switch (reviewStatus) {
    case "ready-to-publish":
      return (
        <p className={cn("flex items-center gap-2 text-base font-semibold")}>
          <ReadyForNext />
          Ready to publish
        </p>
      );
    case "waiting":
      return (
        <div className={cn("flex items-center gap-2 text-base font-semibold")}>
          <Clock className="w-[18px]" />
          Ready for review
        </div>
      );
    case "second-review":
      return (
        <div className={cn("flex items-center gap-2 text-base font-semibold")}>
          <Flag />
          Second review requested
        </div>
      );
    case "under-review":
      return (
        <div className={cn("flex items-center gap-2 text-base font-semibold")}>
          <Clock className="min-w-5" />
          Under review
        </div>
      );
    default:
      return null;
  }
};

export const renderReviewer = (
  reviewer: string[] | undefined,
  withText?: boolean
) => {
  if (!reviewer) return null;
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-base font-semibold",
        withText && "items-end"
      )}
    >
      {withText ? (
        <span className="text-sm font-medium">Reviewer</span>
      ) : (
        <Expert />
      )}
      {reviewer.length > 1 ? `Mixed` : reviewer[0]}
    </div>
  );
};

export const renderFiles = (
  files: string[] | undefined,
  withText?: boolean
) => {
  if (!files) return null;
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-base font-semibold truncate",
        withText && "items-end"
      )}
    >
      {withText ? (
        <span className="text-sm font-medium">Files</span>
      ) : (
        <File width={20} height={20} className="min-w-5" />
      )}
      {files.length ?? "0"} files
    </p>
  );
};

export const renderDate = (date: string | undefined, withText?: boolean) => {
  if (!date) return null;
  const dateObj = new Date(date);
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-base font-semibold",
        withText && "items-end"
      )}
    >
      {withText ? (
        <span className="text-sm font-medium">Date</span>
      ) : (
        <DateIcon />
      )}
      {formatDateToSlash(dateObj)}{" "}
    </p>
  );
};

export const renderAuthor = (
  author: string | undefined,
  withText?: boolean
) => {
  if (!author) return null;
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-base font-semibold",
        withText && "items-end"
      )}
    >
      {withText ? (
        <span className="text-sm font-medium">Author</span>
      ) : (
        <Expert />
      )}
      {author}
    </p>
  );
};
