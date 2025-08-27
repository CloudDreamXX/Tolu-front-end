import { fmtDate, Row } from "pages/feedback-hub";
import { useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "shared/ui";

export const FeedbackDetails = () => {
  const location = useLocation();
  const document: Row = location.state?.document;

  return (
    <div className="px-[72px] py-[24px]">
      <Breadcrumb className="flex flex-row gap-2 text-sm text-gray-600 mb-[56px]">
        <BreadcrumbLink href={"/feedback"}>Feedback</BreadcrumbLink>
        <BreadcrumbSeparator className="text-gray-400" />
        <BreadcrumbItem className="text-gray-800">Details</BreadcrumbItem>
      </Breadcrumb>
      <div className="flex flex-col gap-[32px]">
        <div className="flex flex-col gap-[24px] p-[24px]">
          <div className="flex items-center justify-between">
            <p className="text-[24px] text-[#1D1D1F] font-semibold">
              Main details
            </p>
            {document.sourceId && (
              <p className="text-[14px] text-[#1D1D1F] font-[500]">
                ID #{document.sourceId}
              </p>
            )}
          </div>
          <div className="grid grid-cols-3 grid-rows-2 gap-[24px]">
            <div className="flex flex-col gap-[4px] col-span-1">
              <p className="text-[14px] font-[500] text-[#5F5F65]">Type</p>
              <span
                className={`w-fit px-[12px] py-[8px] rounded-full text-[16px] font-[500] ${
                  document.type === "Coach"
                    ? "bg-[#F0F3FF] text-[#000E66]"
                    : "bg-[#FBF0FF] text-[#460066]"
                }`}
              >
                {document.type}
              </span>
            </div>
            <div className="flex flex-col gap-[4px] col-span-1">
              <p className="text-[14px] font-[500] text-[#5F5F65]">Name</p>
              <p className="text-[18px] font-[500] text-[#1D1D1F]">
                {document.name}
              </p>
            </div>
            <div className="flex flex-col gap-[4px] col-span-1">
              <p className="text-[14px] font-[500] text-[#5F5F65]">Email</p>
              <p className="text-[18px] font-[500] text-[#1D1D1F]">
                {document.email}
              </p>
            </div>
            <div className="flex flex-col gap-[4px] col-span-1">
              <p className="text-[14px] font-[500] text-[#5F5F65]">Rating</p>
              {document.rating && (
                <span
                  className={`w-fit inline-flex items-center justify-center px-[12px] py-[8px] rounded-full text-[16px] font-[500] ${
                    document.rating >= 4
                      ? "bg-[#F0FFF5] text-[#006622]"
                      : document.rating === 3
                        ? "bg-[#FFF6F0] text-[#663C00]"
                        : "bg-[#FFF0F0] text-[#660000]"
                  }`}
                >
                  {document.rating}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-[4px] col-span-1">
              <p className="text-[14px] font-[500] text-[#5F5F65]">Date</p>
              <p className="text-[18px] font-[500] text-[#1D1D1F]">
                {fmtDate(document.date)}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="text-[14px] font-[500] text-[#5F5F65]">Query</p>
            <p>{document.query}</p>
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="text-[14px] font-[500] text-[#5F5F65]">Answer</p>
            <p>{document.htmlContent}</p>
          </div>
        </div>
        <div className="flex flex-col gap-[24px] p-[24px]">
          <p className="text-[24px] text-[#1D1D1F] font-semibold">
            All comments
          </p>
          {document.comments && (
            <div className="flex flex-col gap-[4px]">
              <div className="flex items-center">
                <p className="text-[14px] text-[#5F5F65] font-[500]">
                  Comment from{" "}
                </p>{" "}
                <span
                  className={`w-fit px-[12px] py-[8px] rounded-full text-[16px] font-[500] ${
                    document.type === "Coach"
                      ? "bg-[#F0F3FF] text-[#000E66]"
                      : "bg-[#FBF0FF] text-[#460066]"
                  }`}
                >
                  {document.type}
                </span>
              </div>
              <p className="text-[18px] text-[#1D1D1F] font-semibold">
                {document.comments}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
