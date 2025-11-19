import React from "react";
import { findPercentage } from "./utils";
import { Button } from "shared/ui";

interface HealthGoalsCardProps {
  name: string;
  completed: number;
  outOf: number;
}

export const HealthGoalsCard: React.FC<HealthGoalsCardProps> = ({
  name,
  completed,
  outOf,
}) => {
  const percentage = findPercentage(completed, outOf);
  return (
    <div className="flex flex-col items-start gap-6 p-6 flex-1 self-stretch rounded-2xl bg-[#F3F7FD]">
      <div className="w-full flex justify-between items-center self-stretch">
        <h2 className="text-[18px]/[24px] font-semibold text-[#1D1D1F] ">
          {name}
        </h2>
        <Button
          variant={"unstyled"}
          size={"unstyled"}
          className="py-[6px] px-[8px] flex justify-center items-center rounded-full bg-[#DDEBF6] self-stretch text-[14px]/[20px] font-semibold text-[#1C63DB] "
        >
          Update
        </Button>
      </div>
      <div className="flex flex-col items-start self-stretch gap-4">
        <p className="text-[14px]/[20px] font-medium  text-[#1D1D1F]">
          {completed} of {outOf} gut health steps completed
        </p>
        <div
          style={{
            backgroundImage: `linear-gradient(to right, #1C63DB 0%, #1C63DB ${percentage}%, rgba(0,0,0,0) ${percentage}%, rgba(0,0,0,0) 100%)`,
          }}
          className="flex h-[32px] text-nowrap items-center justify-between self-stretch bg-white rounded-[8px] border-[1px] border-[#1C63DB] py-3 gap-8 px-4"
        >
          {completed === 0 ? (
            <span className={percentage > 20 ? "text-white" : ""}>
              Waiting ...
            </span>
          ) : (
            <span className={percentage > 40 ? "text-white" : ""}>
              In progress ...
            </span>
          )}
          <span>{percentage}%</span>
        </div>
      </div>
    </div>
  );
};
