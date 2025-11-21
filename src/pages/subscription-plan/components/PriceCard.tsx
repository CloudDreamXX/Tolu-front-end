import React from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button } from "shared/ui";

interface PriceCardProps {
  plan: "starting" | "professional";
  price: string;
  features: React.ReactNode[];
  active?: boolean;
  onClick?: () => void;
  mostPopular?: boolean;
}

export const PriceCard: React.FC<PriceCardProps> = ({
  plan,
  price,
  active,
  onClick,
}) => {
  return (
    <Button
      variant={"unstyled"}
      size={"unstyled"}
      onClick={onClick}
      className={
        active
          ? "bg-[#F4F9FF] rounded-[16px] border-[1px] border-[#AAC6EC] py-[40px] px-[24px] flex flex-col justify-center items-center gap-[80px] glex-1 h-[695px]"
          : "rounded-[16px] bg-white border-[1px] border-[#AAC6EC] py-[40px] px-[24px] flex flex-col justify-center items-center gap-[80px] glex-1 h-[695px]"
      }
    >
      <div className="flex flex-col gap-[4px] items-center">
        <h2 className=" text-[#5F5F65]  text-[18px]/[25.2px] font-medium">
          STARTING PLAN
        </h2>
        <h1 className="text-[#1D1D1F]  text-[32px]/[44.8px] font-semibold">
          {plan === "starting" ? "Starter" : "Pro"} Coach Tier
        </h1>
      </div>
      <ul className="flex flex-col justify-center items-start gap-[24px] self-stretch">
        <li className="flex gap-[16px] items-center">
          <MaterialIcon iconName="check" className="text-[#1C63DB]" size={20} />
          <span className="text-[#1d1d1f]  text-[20px] font-medium">
            Manage up to 3 active clients
          </span>
        </li>
        <li className="flex gap-[16px] items-center">
          <MaterialIcon iconName="check" className="text-[#1C63DB]" size={20} />
          <span className="text-[#1d1d1f]  text-[20px] font-medium">
            Host up to 10 sessions per month
          </span>
        </li>
        <li className="flex gap-[16px] items-center">
          <MaterialIcon iconName="check" className="text-[#1C63DB]" size={20} />
          <span className="text-[#1d1d1f]  text-[20px] font-medium">
            1 GB storage for client materials
          </span>
        </li>
        <li className="flex gap-[16px] items-center">
          <MaterialIcon iconName="check" className="text-[#1C63DB]" size={20} />
          <span className="text-[#1d1d1f]  text-[20px] font-medium">
            Access basic content library (templates, basics)
          </span>
        </li>
      </ul>
      <div className="flex flex-col items-center justify-center">
        <h2 className=" font-medium text-[40px]/[140%] text-[#1C63DB]">
          {price} USD
        </h2>
        <h4 className=" font-medium text-[16px]/[140%] text-[#AAA]">
          /per month
        </h4>
      </div>
    </Button>
  );
};
