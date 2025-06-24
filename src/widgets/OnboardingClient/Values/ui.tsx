import React, { useState } from "react";
import { useNavigate } from "react-router";
import { AuthPageWrapper, Checkbox, Input } from "shared/ui";
import { Footer } from "widgets/Footer";
import { HeaderOnboarding } from "widgets/HeaderOnboarding";
import { checkboxes } from "./utils";
import { useDispatch } from "react-redux";
import { setFormField } from "entities/store/clientOnboardingSlice";
import { usePageWidth } from "shared/lib";

export const Values = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { isMobileOrTablet } = usePageWidth();

  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (value: string, checked: boolean) => {
    if (checked && selectedValues.length < 3) {
      setSelectedValues((prev) => [...prev, value]);
    } else if (!checked) {
      setSelectedValues((prev) => prev.filter((v) => v !== value));
    }
  };

  const handleNext = () => {
    const finalValues = [...selectedValues];

    if (selectedValues.includes("Other") && inputValue.trim()) {
      finalValues.splice(finalValues.indexOf("Other"), 1, inputValue.trim());
    }

    dispatch(setFormField({ field: "values", value: finalValues }));
    nav("/barriers");
  };

  const title = (
    <h1 className="flex w-full items-center justify-center text-[#1D1D1F] text-center text-[24px] md:text-[32px] font-bold">
      Values & Inner Drivers
    </h1>
  );

  const buttonsBlock = (
    <div className="flex justify-between items-center w-full max-w-[700px] flex-col-reverse gap-6 md:flex-row">
      <button
        onClick={() => nav("/barriers")}
        className="flex p-4 h-[44px] items-center justify-center text-base font-semibold text-[#1C63DB]"
      >
        Skip this for now
      </button>
      <div className="flex w-full gap-4 md:w-auto">
        <button
          onClick={() => nav(-1)}
          className="p-4  w-full md:w-[128px] h-[44px] flex items-center justify-center rounded-full text-base font-semibold bg-[#DDEBF6] text-[#1C63DB]"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={selectedValues.length === 0 && !inputValue.trim()}
          className={`p-4 w-full md:w-[128px] h-[44px] flex items-center justify-center rounded-full text-base font-semibold ${
            selectedValues.length > 0 || inputValue.trim()
              ? "bg-[#1C63DB] text-white"
              : "bg-[#DDEBF6] text-white cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );

  return (
    <AuthPageWrapper>
      <HeaderOnboarding isClient currentStep={2} steps={8} />
      <main className="flex flex-col items-center self-stretch justify-center gap-8">
        {!isMobileOrTablet && title}

        <div className="w-full max-w-[700px] flex gap-6 flex-col items-start justify-center rounded-t-3xl bg-white py-[24px] px-[16px] md:p-10 md:rounded-3xl">
          {isMobileOrTablet && title}

          <div className="flex flex-col gap-2 w-full max-w-[700px] items-start">
            <h3 className="font-[Nunito] text-[18px] font-bold text-[#1D1D1F]">
              What values are most important to you right now?
            </h3>
            <div className="flex items-center justify-between w-full">
              <p className="text-[#1D1D1F] font-[Nunito] text-[16px] font-medium">
                Please choose up to 3.
              </p>
              <p className="text-[#1D1D1F] font-[Nunito] text-[16px] font-bold">
                {selectedValues.length}/
                <span className="text-[12px] font-normal font-[Nunito] text-[#B3BCC8]">
                  3
                </span>
              </p>
            </div>
          </div>

          {checkboxes
            .reduce((rows, item, index) => {
              if (index % 2 === 0)
                rows.push(checkboxes.slice(index, index + 2));
              return rows;
            }, [] as string[][])
            .map((rowItems, rowIndex) => (
              <div
                key={rowIndex}
                className="flex flex-col w-full gap-6 md:flex-row md:items-center"
              >
                {rowItems.map((item, i) => (
                  <div key={i} className="flex items-center flex-1 gap-4">
                    <Checkbox
                      checked={selectedValues.includes(item)}
                      onCheckedChange={(checked) =>
                        handleInputChange(item, checked === true)
                      }
                      disabled={
                        !selectedValues.includes(item) &&
                        selectedValues.length >= 3
                      }
                      className="w-6 h-6 rounded-lg"
                    />
                    <p className="font-[Nunito] text-[16px] font-medium text-[#1D1D1F]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            ))}

          {selectedValues.includes("Other") && (
            <div className="flex flex-col gap-[10px] w-full max-w-[700px] items-start">
              <label className="text-[16px] font-medium font-[Nunito] text-[#1D1D1F]">
                Your variant(s)
              </label>
              <Input
                className="w-full"
                placeholder="Other"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          )}
          {isMobileOrTablet && buttonsBlock}
        </div>
        {!isMobileOrTablet && buttonsBlock}
      </main>
      <Footer position={isMobileOrTablet ? "top-right" : "bottom-right"} />
    </AuthPageWrapper>
  );
};
