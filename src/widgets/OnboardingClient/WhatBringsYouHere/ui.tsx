import { AuthPageWrapper, Input } from "shared/ui";
import { Footer } from "widgets/Footer";
import { HeaderOnboarding } from "widgets/HeaderOnboarding";
import { radioContent } from "./utils";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setFormField } from "entities/store/clientOnboardingSlice";
import SmallTooltip from "shared/assets/icons/small-tooltip";
import { RadioGroup, RadioGroupItem } from "shared/ui/radio-group"; // <-- import shadcn RadioGroup

export const WhatBrringsYouHere = () => {
  const [radioValue, setRadioValue] = useState("");
  const [input, setInput] = useState("");
  const nav = useNavigate();
  const dispatch = useDispatch();

  const isOtherSelected = radioValue === "Other";

  const handleNext = () => {
    const finalValue = isOtherSelected ? input.trim() : radioValue;
    dispatch(setFormField({ field: "whatBringsYouHere", value: finalValue }));
    nav("/values");
  };

  const isFilled = () => {
    return isOtherSelected ? input.trim() !== "" : radioValue !== "";
  };

  return (
    <AuthPageWrapper>
      <HeaderOnboarding currentStep={1} steps={8} />
      <main className="flex flex-col items-center gap-8 justify-center self-stretch">
        <h1 className="flex items-center justify-center text-[#1D1D1F] text-center text-h1">
          What Brings You Here?
        </h1>

        <div className="w-full max-w-[700px] p-[40px] rounded-2xl bg-white flex flex-col gap-6 items-start justify-center">
          <div className="flex flex-col gap-2 items-start">
            <h1 className="text-h5 font-[Nunito] text-[18px] text-[#1D1D1F]">
              What’s your main goal during this transition?
            </h1>
            <p className="text-[16px] font-medium font-[Nunito] text-[#5F5F65]">
              Please give us just one goal that describes you.
            </p>
          </div>

          <RadioGroup
            value={radioValue}
            onValueChange={(val) => setRadioValue(val)}
            className="flex flex-col gap-4 w-full"
          >
            {radioContent.map((item, index) => (
              <div key={item} className="flex items-center gap-4 w-full">
                <RadioGroupItem
                  value={item}
                  id={`radio-${index}`}
                  className="mt-[5px] w-6 h-6"
                />
                <label
                  htmlFor={`radio-${index}`}
                  className="flex flex-grow cursor-pointer"
                >
                  <span className="inline-flex items-start">
                    <p className="font-[Nunito] text-[16px] font-medium text-[#1D1D1F] leading-snug mr-1">
                      {item}
                    </p>
                    <div className="flex-shrink-0 mt-[3px]">
                      <SmallTooltip />
                    </div>
                  </span>
                </label>
              </div>
            ))}
          </RadioGroup>

          {isOtherSelected && (
            <div className="flex flex-col gap-[10px] w-full items-start">
              <label className="text-[16px] font-medium font-[Nunito] text-[#1D1D1F]">
                What does a healthy menopause transition look like to you?
              </label>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="My main goal"
                className="w-full text-[16px] font-[Nunito] font-medium py-[11px] px-[16px]"
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center w-full max-w-[700px]">
          <button
            onClick={handleNext}
            className="flex p-4 h-[44px] items-center justify-center text-base font-semibold text-[#1C63DB]"
          >
            Skip this for now
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => nav(-1)}
              className="p-4 w-[128px] h-[44px] flex items-center justify-center rounded-full text-base font-semibold bg-[#DDEBF6] text-[#1C63DB]"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!isFilled()}
              className={
                isFilled()
                  ? "p-4 w-[128px] h-[44px] flex items-center justify-center rounded-full text-base font-semibold bg-[#1C63DB] text-white"
                  : "p-4 w-[128px] h-[44px] flex items-center justify-center rounded-full text-base font-semibold bg-[#DDEBF6] text-white cursor-not-allowed"
              }
            >
              Continue
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </AuthPageWrapper>
  );
};
