import { Check } from "lucide-react";
import React from "react";
import clsx from "clsx";

interface PriceCardProps {
  plan: "starting" | "professional";
  price: string;
  active?: boolean;
  second?: boolean;
  onClick?: () => void;
  mostPopular?: boolean;
}

export const PriceCard: React.FC<PriceCardProps> = ({
  plan,
  price,
  active,
  onClick,
  second,
  mostPopular = false,
}) => {
  return (
    <div
      className={clsx(
        "relative w-full overflow-hidden rounded-[16px] border transition-shadow",
        {
          "border-[4px] border-[#1C63DB] bg-white shadow-[0px_0px_20px_rgba(0,143,246,0.5)]":
            active,
          "border-[#1C63DB]": !active && second,
          "border-[#AAC6EC]": !active && !second,
        }
      )}
    >
      {mostPopular && (
        <div className="absolute top-[45px] right-[-90px] bg-[#1C63DB] text-white px-[12px] py-[8px] text-[18px] font-bold font-inter shadow-md w-[360px] text-center rotate-[35deg] pointer-events-none">
          Most Popular
        </div>
      )}
      <button
        onClick={onClick}
        className={clsx(
          "rounded-[16px] py-[40px] w-full max-w-[684px] px-[24px] flex flex-col justify-center items-center gap-[80px] glex-1 h-[695px]",
          {
            "bg-[#F4F9FF]": second,
            "bg-white": !second,
          }
        )}
      >
        <div className="flex flex-col gap-[4px] items-center">
          <h2 className="text-[#5F5F65] font-inter text-[18px]/[25.2px] font-medium">
            {plan === "starting" ? "STARTING" : "PROFESSIONAL"} PLAN
          </h2>
          <h1 className="text-[#1D1D1F] font-inter text-[32px]/[44.8px] font-semibold">
            {plan === "starting" ? "Starter" : "Pro"} Coach Tier
          </h1>
        </div>

        <ul className="flex flex-col justify-center items-start gap-[24px] self-stretch">
          <li className="flex gap-[16px] items-center">
            <Check color="#1C63DB" size={20} />
            <span className="text-[#1d1d1f] font-inter text-[20px] font-medium">
              Manage up to{" "}
              <span className="!font-bold">
                {plan === "starting" ? 3 : 50} active clients
              </span>
            </span>
          </li>
          <li className="flex gap-[16px] items-center">
            <Check color="#1C63DB" size={20} />
            <span className="text-[#1d1d1f] font-inter text-[20px] font-medium">
              Host up to{" "}
              <span className="!font-bold">
                {plan === "starting" ? 10 : 50} sessions
              </span>{" "}
              per month
            </span>
          </li>
          <li className="flex gap-[16px] items-center">
            <Check color="#1C63DB" size={20} />
            <span className="text-[#1d1d1f] font-inter text-[20px] font-medium">
              <span className="!font-bold">
                {plan === "starting" ? 1 : 15} GB storage
              </span>{" "}
              for client materials
            </span>
          </li>
          <li className="flex gap-[16px] items-center">
            <Check color="#1C63DB" size={20} />
            <span className="text-[#1d1d1f] font-inter text-[20px] pr-4 font-medium whitespace-nowrap">
              {plan === "starting" ? (
                <>
                  <span className="!font-bold">Access basic content</span>{" "}
                  library (templates, basics)
                </>
              ) : (
                <>
                  <span className="!font-bold">Full access</span> to the content
                  library and templates
                </>
              )}
            </span>
          </li>
        </ul>

        <div className="flex flex-col items-center justify-center">
          <h2 className="font-inter font-medium text-[40px]/[140%] text-[#1C63DB]">
            {price} USD
          </h2>
          <h4 className="font-inter font-medium text-[16px]/[140%] text-[#AAA]">
            /per month
          </h4>
        </div>
      </button>
    </div>
  );
};
