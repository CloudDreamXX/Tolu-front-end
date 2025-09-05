import React from "react";

import { cn } from "shared/lib";
import { MaterialIcon } from "../../shared/assets/icons/MaterialIcon";

interface TimelineItemProps {
  title: string;
  date: string;
  description: string;
  iconName: TimeLineIconName;
}

const variantIconList = {
  info: "border-[#1C63DB]/20 [&_button]:text-[#1C63DB] [&_button]:bg-[#1C63DB]/10",
  success:
    "border-[#006622]/20 [&_button]:text-[#006622] [&_button]:bg-[#006622]/10",
  warning:
    "border-[#F6B448]/20 [&_button]:text-[#F6B448] [&_button]:bg-[#F6B448]/10",
};

const iconsElList = {
  arrowClockwise: {
    el: <MaterialIcon iconName="replay" />,
    variant: "info",
  },
  trendUp: {
    el: <MaterialIcon iconName="trending_up" />,
    variant: "success",
  },
  warningCircle: {
    el: <MaterialIcon iconName="warning" />,
    variant: "warning",
  },
  uploadSimple: {
    el: (
      <MaterialIcon
        iconName="cloud_upload"
        fill={1}
        className="text-[#1C63DB] p-2 border rounded-xl"
      />
    ),
    variant: "info",
  },
  pencilSimple: {
    el: <MaterialIcon iconName="edit" />,
    variant: "info",
  },
  arrowCounterClockwise: {
    el: <MaterialIcon iconName="arrow_back" />,
    variant: "info",
  },
} as const;

export type TimeLineIconName = keyof typeof iconsElList;

export const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  date,
  description,
  iconName,
}) => {
  return (
    <div className="flex flex-col items-start self-stretch gap-6">
      <div className="flex items-center self-stretch gap-4">
        <div
          className={cn(
            "w-14 h-14 p-1 flex items-center justify-center rounded-[8px] bg-white border ",
            variantIconList[iconsElList[iconName].variant]
          )}
        >
          <button className="flex w-12 h-12 p-2 items-center justify-center shrink-0 rounded-[6px]">
            {iconsElList[iconName].el}
          </button>
        </div>
        <div className="flex flex-col items-start w-full gap-1">
          <div className="flex items-center self-stretch justify-between w-full">
            <h3 className="text-[#1D1D1F]  text-[16px]/[22px] font-semibold">
              {title}
            </h3>
            <p className=" text-[#5F5F65] text-[12px]/[18px] font-normal">
              {date}
            </p>
          </div>
          <p className="text-[14px]/[20px] font-normal text-[#1D1D1F] ">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
