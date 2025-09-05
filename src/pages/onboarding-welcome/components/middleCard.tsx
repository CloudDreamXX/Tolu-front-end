import React from "react";
import { Content } from "../index";

interface MiddleCardProps extends Content {
  handleNext: () => void;
}

export const MiddleCard: React.FC<MiddleCardProps> = ({
  title,
  description,
  icon,
  handleNext,
}) => {
  return (
    <div className="flex flex-col w-[900px] items-center justify-center gap-[40px] py-[56px] px-[100px] rounded-[30px] border-[2px] border-[#F3F6FB] bg-white">
      <div className="flex flex-col justify-between items-center shrink-0 w-[548px] h-[269px] gap-[24px]">
        {icon}
        <div className="flex w-[460px] flex-col items-start gap-[16px]">
          <h2 className="text-center text-black  text-[40px]/[56px] font-bold">
            {title}
          </h2>
          <p>{description}</p>
        </div>
      </div>
      <button
        onClick={handleNext}
        className="flex justify-center items-center rounded-full bg-[#1C63DB] text-white w-[250px] h-[44px] p-[16px] shrink-0"
      >
        Continue
      </button>
    </div>
  );
};
