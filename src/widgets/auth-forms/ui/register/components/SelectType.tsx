import React, { useState } from "react";
import Client from "shared/assets/icons/client";
import Practitioner from "shared/assets/icons/practitioner";

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
    <main className="w-full md:w-[550px] flex flex-col items-center gap-[40px] md:gap-[80px]">
      <h3 className="text-black text-center font-inter font-semibold text-[28px] md:text-[40px]">
        Select Your Type of Account:
      </h3>
      <main className="flex flex-col md:flex-row items-start gap-[24px] md:gap-[40px] 2xl:gap-[80px]">
        <button
          onClick={() => setCardActive("client")}
          className={
            cardActive === "client"
              ? "border-[3px] border-[#1C63DB] bg-[#F2F7FC] rounded-[24px] flex flex-col px-[40px] py-[24px] md:py-[40px] md:px-[11px] 2xl:p-[40px] gap-[16px] md:gap-[32px] xl:gap-[56px] items-center justify-center"
              : "border-[3px] border-[#AAC6EC] bg-white rounded-[24px] flex flex-col px-[40px] py-[24px] md:py-[40px] md:px-[11px] 2xl:p-[40px] gap-[16px] md:gap-[32px] xl:gap-[56px] items-center justify-center"
          }
        >
          <div className="flex flex-col items-center w-[80px] h-[88px] md:w-[119px] md:h-[130px] xl:w-[157px] xl:h-[171px] gap-[32px]">
            <Client />
          </div>
          <div className="flex flex-col items-start self-stretch gap-[16px]">
            <h3 className="h-[31px] flex lfex-col justify-center self-center text-center font-[Nunito] text-[24px] md:text-[28px]/[20px] font-medium">
              Client
            </h3>
            <p className="md:w-[278px] md:h-[47px] flex flex-col justify-center text-[#5F5F65] font-[Nunito] font-medium text-[16px]/[20px] opacity-[0.7]">
              Say goodbye to confusion. Get real answers for your symptoms—when
              they happen, not weeks later.
            </p>
          </div>
        </button>
        <button
          onClick={() => setCardActive("practitioner")}
          className={
            cardActive === "practitioner"
              ? "border-[3px] border-[#1C63DB] bg-[#F2F7FC] rounded-[24px] flex flex-col px-[40px] py-[24px] md:py-[40px] md:px-[11px] 2xl:p-[40px] gap-[16px] md:gap-[32px] xl:gap-[56px] items-center justify-center"
              : "border-[3px] border-[#AAC6EC] bg-white rounded-[24px] flex flex-col px-[40px] py-[24px] md:py-[40px] md:px-[11px] 2xl:p-[40px] gap-[16px] md:gap-[32px] xl:gap-[56px] items-center justify-center"
          }
        >
          <div className="flex flex-col items-center w-[80px] h-[88px] md:w-[119px] md:h-[130px] xl:w-[157px] xl:h-[171px] gap-[32px]">
            <Practitioner />
          </div>
          <div className="flex flex-col items-start self-stretch gap-[16px]">
            <h3 className="h-[31px] flex lfex-col justify-center self-center text-center font-[Nunito] text-[24px] md:text-[28px]/[20px] font-medium">
              Practitioner
            </h3>
            <p className="md:w-[278px] md:h-[47px] flex flex-col justify-center text-[#5F5F65] font-[Nunito] font-medium text-[16px]/[20px] opacity-[0.7]">
              Tolu is your AI-powered partner, helping you deliver fast,
              precise, evidence-based menopause care to every client.
            </p>
          </div>
        </button>
      </main>
      <div className="flex flex-col w-full md:w-[250px] items-center gap-[24px] slef-stretch">
        <button
          type="button"
          onClick={() => handleCardClick(cardActive)}
          className={
            cardActive.length >= 1
              ? "flex w-full md:w-[250px] h-[44px] p-[16px] justify-center items-center rounded-full bg-[#1C63DB] text-white font-[Nunito] text-[16px] font-semibold"
              : "flex w-full md:w-[250px] h-[44px] p-[16px] justify-center items-center rounded-full bg-[#D5DAE2] text-[#5F5F65] font-[Nunito] text-[16px] font-semibold"
          }
        >
          Proceed
        </button>
      </div>
    </main>
  );
};
