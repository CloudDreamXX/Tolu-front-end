import { FolderStatus, ReviewStatus } from "entities/folder";
import Expert from "shared/assets/icons/expert";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
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
          <MaterialIcon iconName="browse_gallery" className="w-[18px]" />
          Ready for review
        </div>
      );
    case "second-review":
      return (
        <div className={cn("flex items-center gap-2 text-base font-semibold")}>
          <MaterialIcon iconName="flag" className="text-red-500" />
          Second review requested
        </div>
      );
    case "under-review":
      return (
        <div className={cn("flex items-center gap-2 text-base font-semibold")}>
          <MaterialIcon iconName="browse_gallery" className="min-w-5" />
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
    <div className={cn("flex items-center gap-2 text-base font-semibold")}>
      {withText ? (
        <span className="text-sm font-medium">Reviewer</span>
      ) : (
        <Expert />
      )}
      {reviewer.length > 1 ? `Mixed` : reviewer[0]}
    </div>
  );
};

export const renderRecommendedBy = (
  recommendedBy: string | undefined,
  withText?: boolean
) => {
  if (!recommendedBy) return null;
  return (
    <div
      className={cn(
        "flex flex-col gap-[4px] items-start text-base font-semibold"
      )}
    >
      {withText ? (
        <span className="text-sm font-medium">Recommended by</span>
      ) : (
        <Expert />
      )}
      {recommendedBy}
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
      className={cn("flex items-center gap-2 text-base font-semibold truncate")}
    >
      {withText ? (
        <span className="text-sm font-medium">Files</span>
      ) : (
        <MaterialIcon iconName="docs" size={20} className="min-w-5" />
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
        "flex flex-col gap-[4px] items-start text-base font-semibold"
      )}
    >
      {withText ? (
        <span className="text-sm font-medium">Date</span>
      ) : (
        <MaterialIcon iconName="calendar_today" />
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
        "flex flex-col gap-[4px] items-start text-base font-semibold"
      )}
    >
      {withText ? (
        <span className="text-[14px] font-[500] text-[#5F5F65]">
          Recommended by
        </span>
      ) : (
        <Expert />
      )}
      <span className="text-[16px] font-[600] text-[#1D1D1F]">{author}</span>
    </p>
  );
};

export const renderStatus = (
  status: string | undefined,
  withText?: boolean
) => {
  if (!status) return null;
  return (
    <p
      className={cn(
        "flex flex-col gap-[4px] items-start text-base font-semibold"
      )}
    >
      {withText ? (
        <span className="flex gap-[4px] items-center text-[14px] font-[500] text-[#5F5F65]">
          Status
        </span>
      ) : (
        <Expert />
      )}
      <span
        className={`flex gap-[4px] items-center text-[16px] font-[600] ${status === "Live" ? "text-[#006622]" : status === "Rejected" ? "text-[#660000]" : status === "Waiting" ? "text-[#663C00]" : "text-[#1C63DB]"}`}
      >
        {status}
      </span>
    </p>
  );
};

export const renderDocumentType = (
  type: string | undefined,
  withText?: boolean
) => {
  if (!type) return null;
  return (
    <p
      className={cn(
        "flex flex-col gap-[4px] items-start text-base font-semibold"
      )}
    >
      {withText ? (
        <span className="text-[14px] font-[500] text-[#5F5F65]">
          Document Type
        </span>
      ) : (
        <Expert />
      )}
      <span className="text-[16px] font-[600] text-[#1D1D1F]">{type}</span>
    </p>
  );
};
