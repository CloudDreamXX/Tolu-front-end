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
    <div className="flex flex-col xl:w-[900px] items-center justify-center gap-[88px] md:gap-[58px] xl:gap-[40px] md:mx-[40px] xl:mx-0 py-[24px] px-[16px] md:py-[40px] md:px-[70px] xl:py-[56px] xl:px-[100px] rounded-t-[20px] md:rounded-[20px] border-[2px] border-[#F3F6FB] bg-white shadow-wrapper">
      <div className="flex flex-col items-center shrink-0 w-full md:w-[548px] md:h-[269px] lg:h-auto gap-[24px]">
        {icon}
        <div className="flex md:w-[460px] flex-col items-center gap-[16px]">
          <h2 className="text-center text-black font-[Nunito] text-[24px] md:text-[40px]/[56px] text-nowrap font-bold">
            {title}
          </h2>
          <p className="text-center text-[16px] md:text-[24px] text-[#000000]">
            {description}
          </p>
        </div>
      </div>
      <button
        onClick={handleNext}
        className="flex justify-center items-center rounded-full bg-[#1C63DB] text-white w-full md:w-[250px] h-[56px] p-[16px] shrink-0"
      >
        Continue
      </button>
    </div>
  );
};
