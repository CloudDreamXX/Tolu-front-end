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
    <main className="w-[550px] flex flex-col items-center gap-[60px]">
      <h3 className="text-black text-center font-inter font-semibold text-[40px]">
        Select Your Type of Account:
      </h3>
      <main className="flex items-start gap-[80px]">
        <button
          onClick={() => setCardActive("client")}
          className={
            cardActive === "client"
              ? "border-[3px] border-[#1C63DB] bg-[#F2F7FC] rounded-[24px] flex flex-col p-[40px] gap-[56px] items-center justify-center"
              : "border-[3px] border-[#AAC6EC] bg-white rounded-[24px] flex flex-col p-[40px] gap-[56px] items-center justify-center"
          }
        >
          <div className="flex flex-col items-center w-[278px] gap-[32px]">
            <Client />
          </div>
          <div className="flex flex-col items-start self-stretch gap-[16px]">
            <h3 className="h-[31px] flex lfex-col justify-center self-center text-center font-[Nunito] text-[28px]/[20px] font-medium">
              Client
            </h3>
            <p className="w-[278px] h-[47px] flex flex-col justify-center text-[#5F5F65] font-[Nunito] font-medium text-[16px]/[20px] opacity-[0.7]">
              Lorem Ipsum Dolores Sit. Manwa jes. Lorem Ipsum Dolores Sit.
            </p>
          </div>
        </button>
        <button
          onClick={() => setCardActive("practitioner")}
          className={
            cardActive === "practitioner"
              ? "border-[3px] border-[#1C63DB] bg-[#F2F7FC] rounded-[24px] flex flex-col p-[40px] gap-[56px] items-center justify-center"
              : "border-[3px] border-[#AAC6EC] bg-white rounded-[24px] flex flex-col p-[40px] gap-[56px] items-center justify-center"
          }
        >
          <div className="flex flex-col items-center w-[278px] gap-[32px]">
            <Practitioner />
          </div>
          <div className="flex flex-col items-start self-stretch gap-[16px]">
            <h3 className="h-[31px] flex lfex-col justify-center self-center text-center font-[Nunito] text-[28px]/[20px] font-medium">
              Practitioner
            </h3>
            <p className="w-[278px] h-[47px] flex flex-col justify-center text-[#5F5F65] font-[Nunito] font-medium text-[16px]/[20px] opacity-[0.7]">
              Lorem Ipsum Dolores Sit. Manwa jes. Lorem Ipsum Dolores Sit.
            </p>
          </div>
        </button>
      </main>
      <div className="flex flex-col items-center gap-[24px] slef-stretch">
        <button
          type="button"
          onClick={() => handleCardClick(cardActive)}
          className={
            cardActive.length >= 1
              ? "flex w-[250px] h-[44px] p-[16px] justify-center items-center rounded-full bg-[#1C63DB] text-white font-[Nunito] text-[16px] font-semibold"
              : "flex w-[250px] h-[44px] p-[16px] justify-center items-center rounded-full bg-[#D5DAE2] text-[#5F5F65] font-[Nunito] text-[16px] font-semibold"
          }
        >
          Proceed
        </button>
      </div>
    </main>
  );
};
