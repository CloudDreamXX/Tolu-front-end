import React from "react";
import {
  ArrowClockwiseIcon,
  TrendUpIcon,
  WarningCircleIcon,
  UploadSimpleIcon,
  PencilSimpleIcon,
  ArrowCounterClockwiseIcon,
} from "@phosphor-icons/react";

import { cn } from "shared/lib";

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
    el: ArrowClockwiseIcon,
    variant: "info",
  },
  trendUp: {
    el: TrendUpIcon,
    variant: "success",
  },
  warningCircle: {
    el: WarningCircleIcon,
    variant: "warning",
  },
  uploadSimple: {
    el: UploadSimpleIcon,
    variant: "info",
  },
  pencilSimple: {
    el: PencilSimpleIcon,
    variant: "info",
  },
  arrowCounterClockwise: {
    el: ArrowCounterClockwiseIcon,
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
    <div className="flex flex-col gap-6 items-start self-stretch">
      <div className="flex gap-4 items-center self-stretch">
        <div
          className={cn(
            "w-14 h-14 p-1 flex items-center justify-center rounded-[8px] bg-white border ",
            variantIconList[iconsElList[iconName].variant]
          )}
        >
          <button className="flex w-12 h-12 p-2 items-center justify-center shrink-0 rounded-[6px]">
            {React.createElement(iconsElList[iconName].el, {
              className: "w-6 h-6",
            })}
          </button>
        </div>
        <div className="flex flex-col gap-1 items-start w-full">
          <div className="flex justify-between items-center self-stretch w-full">
            <h3 className="text-[#1D1D1F] font-[Nunito] text-[16px]/[22px] font-semibold">
              {title}
            </h3>
            <p className="font-[Nunito] text-[#5F5F65] text-[12px]/[18px] font-normal">
              {date}
            </p>
          </div>
          <p className="text-[14px]/[20px] font-normal text-[#1D1D1F] font-[Nunito]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
