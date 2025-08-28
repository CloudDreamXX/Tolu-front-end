import { ReviewStatus } from "entities/folder";
import Expert from "shared/assets/icons/expert";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import NotReadyForNext from "shared/assets/icons/not-ready-for-next";
import ReadyForNext from "shared/assets/icons/ready-for-next";

export const renderReadyForReview = (readyForReview: boolean | undefined) => {
  if (readyForReview === undefined) return null;
  return (
    <div className="flex items-center gap-2 text-base font-semibold">
      {readyForReview ? <ReadyForNext /> : <NotReadyForNext />}
      Ready for review
    </div>
  );
};

export const renderReviewStatus = (reviewStatus: ReviewStatus | undefined) => {
  if (!reviewStatus) return null;

  switch (reviewStatus) {
    case "waiting":
      return (
        <div className="flex items-center gap-2 text-base font-semibold">
          <MaterialIcon iconName="browse_gallery" className="w-[18px]" />
          Ready for review
        </div>
      );
    case "second-review":
      return (
        <div className="flex items-center gap-2 text-base font-semibold">
          <MaterialIcon iconName="flag" className="text-red-500" />
          Second review requested
        </div>
      );
    case "under-review":
      return (
        <div className="flex items-center gap-2 text-base font-semibold">
          <MaterialIcon iconName="browse_gallery" className="min-w-5" />
          Under review
        </div>
      );
    default:
      return null;
  }
};

export const renderReviewer = (reviewer: string | undefined) => {
  if (!reviewer) return null;
  return (
    <div className="flex items-center gap-2 text-base font-semibold">
      <Expert />
      {reviewer}
    </div>
  );
};
