import React, { useState } from "react";
import { cn } from "shared/lib";

interface SelectType {
  formData: {
    accountType: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    newPassword: string;
  };
  handleCardClick: (user: string) => void;
}

export const SelectType: React.FC<SelectType> = ({ handleCardClick }) => {
  const [cardActive, setCardActive] = useState("");
  return (
    <main className="w-full md:w-[550px] flex flex-col items-center gap-[55px] p-1">
      <h3 className="text-black text-center font-semibold text-[24px]">
        Select Your Account Type
      </h3>
      <div className="flex flex-col md:flex-row gap-[24px] md:gap-[40px] items-stretch">
        <button
          onClick={() => setCardActive("client")}
          className={cn(
            "rounded-[24px] px-[40px] py-[24px] md:py-[32px] lg:w-[370px]",
            cardActive === "client" ? "bg-[#1C63DB]/10" : "bg-transparent"
          )}
        >
          <div className="flex flex-col items-start self-stretch gap-4">
            <h3 className="text-[24px] text-center w-full font-medium">
              Individual
            </h3>
            <p className="flex flex-col justify-center font-normal text-[16px]">
              Your everyday challenges matter. Let’s explore answers together.
            </p>
          </div>
        </button>
        <button
          onClick={() => setCardActive("practitioner")}
          className={cn(
            "rounded-[24px] px-[40px] py-[24px] md:py-[32px] lg:w-[370px]",
            cardActive === "practitioner" ? "bg-[#1C63DB]/10" : "bg-transparent"
          )}
        >
          <div className="flex flex-col items-start self-stretch gap-4">
            <h3 className="text-[24px] text-center w-full font-medium">
              Health Educator
            </h3>
            <p className="flex flex-col justify-center font-normal text-[16px] line-clamp-2">
              Turn your expertise into impact. Change the future of women’s
              health.
            </p>
          </div>
        </button>
      </div>
      <div className="flex flex-col w-full md:w-[250px] items-center gap-[24px] slef-stretch">
        <button
          type="button"
          onClick={() => handleCardClick(cardActive)}
          className={cn(
            "flex w-full md:w-[250px] h-[44px] p-[16px] justify-center items-center rounded-full text-[16px] font-semibold",
            cardActive.length >= 1
              ? "bg-[#1C63DB] text-white"
              : "bg-[#D5DAE2] text-[#5F5F65]"
          )}
        >
          Continue
        </button>
      </div>
    </main>
  );
};
