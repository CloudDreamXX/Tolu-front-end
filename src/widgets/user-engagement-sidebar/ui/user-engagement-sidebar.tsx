import React from "react";
import { IDocument } from "entities/document";

interface UserEngagementSidebarProps {
  document: IDocument | null;
}

export const UserEngagementSidebar: React.FC<UserEngagementSidebarProps> = ({
  document,
}) => {
  const engagementItems = [
    { label: "Read by users", value: document?.readCount || "-" },
    { label: "Saved by users", value: document?.savedCount || "-" },
    { label: "Feedback received", value: document?.feedbackCount || "-" },
    {
      label: "Social media shares",
      value: document?.socialMediaShares || "-",
    },
  ];

  return (
    <div className="pt-[23px] w-full max-w-[196px] bg-[#F6F9FF] h-fit rounded-[24px] px-0.5">
      <h3 className="text-lg font-semibold px-[22px] pb-[15px] border-b border-[#008FF6] border-opacity-20">
        User Engagement
      </h3>
      <div className="py-[23px] px-[31px] flex flex-col gap-5">
        {engagementItems.map((item) => (
          <div className="flex flex-col" key={item.label}>
            <h5 className="text-sm font-semibold">{item.label}</h5>
            <p className="text-[18px] font-bold">
              {item.value ?? (
                <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
