import React from "react";
import { Content } from "../index";
import { Link } from "react-router-dom";
import { Checkbox } from "shared/ui";

interface MiddleCardProps extends Content {
  handleNext: () => void;
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
}

export const MiddleCard: React.FC<MiddleCardProps> = ({
  title,
  description,
  icon,
  link,
  includes,
  handleNext,
  isChecked,
  setIsChecked,
}) => {
  return (
    <div className="flex flex-col xl:w-[900px] items-center justify-center gap-[88px] md:gap-[58px] xl:gap-[40px] md:mx-[40px] xl:mx-0 py-[24px] px-[16px] md:py-[40px] md:px-[70px] xl:py-[56px] xl:px-[100px] rounded-t-[20px] md:rounded-[20px] border-[2px] border-[#F3F6FB] bg-white shadow-wrapper">
      <div className="flex flex-col items-center shrink-0 w-full md:w-[548px] md:h-[269px] lg:h-auto gap-[24px]">
        {icon}
        <div className="flex flex-col gap-[38px] items-center justify-center">
          <div className="flex md:w-[460px] flex-col items-center gap-[16px]">
            <h2 className="text-center text-black font-[Nunito] text-[24px] md:text-[40px]/[56px] text-wrap font-bold">
              {title}
            </h2>
            <p className="text-center text-[16px] md:text-[24px] text-[#000000]">
              {description}
            </p>
          </div>
          <div className="flex flex-col gap-[16px]">
            {link && (
              <Link
                to="https://tolu.health/privacy-policy"
                className="text-[#1C63DB] text-[16px] font-[500] underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </Link>
            )}
            {includes && (
              <ul className="list-disc pl-5">
                {includes.map((item, index) => (
                  <li key={index} className="text-[#5F5F65] text-[16px]">
                    - {item}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-[16px] items-center">
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => setIsChecked(!isChecked)}
              />
              <p className="text-[#1D1D1F] text-[20px] font-[500]">
                I have read and agree to this agreement
              </p>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleNext}
        className={`flex justify-center items-center rounded-full bg-[#1C63DB] text-white w-full md:w-[250px] h-[56px] p-[16px] shrink-0 ${!isChecked ? "opacity-[50%]" : "cursor-pointer"}`}
        disabled={!isChecked}
      >
        Continue
      </button>
    </div>
  );
};
