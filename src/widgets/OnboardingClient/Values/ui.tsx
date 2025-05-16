import React, { useState } from "react";
import { useNavigate } from "react-router";
import { AuthPageWrapper, Input } from "shared/ui";
import { Footer } from "widgets/Footer";
import { HeaderOnboarding } from "widgets/HeaderOnboarding";
import { checkboxes } from "./utils";
import { useDispatch } from "react-redux";
import { setFormField } from "entities/store/clientOnboardingSlice";

export const Values = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = e.target;

    if (checked && selectedValues.length < 3 ) {
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

  return (
    <AuthPageWrapper>
      <HeaderOnboarding currentStep={2} steps={8} />
      <main className="flex flex-col items-center gap-8 justify-center self-stretch">
        <h1 className="flex items-center justify-center text-[#1D1D1F] text-center text-h1">
          Values & Inner Drivers
        </h1>
        <div className="w-full max-w-[700px] p-[40px] rounded-2xl bg-white flex flex-col gap-6 items-start justify-center">
          <div className="flex flex-col gap-2 w-full max-w-[700px] items-start">
            <h3 className="font-[Nunito] text-[18px] font-bold text-[#1D1D1F]">
              What values are most important to you right now?
            </h3>
            <div className="flex w-full justify-between items-center">
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
              <div key={rowIndex} className="gap-6 flex w-full items-center">
                {rowItems.map((item, i) => (
                  <div key={i} className="flex gap-4 flex-1 items-center">
                    <input
                      onChange={handleInputChange}
                      type="checkbox"
                      value={item}
                      checked={selectedValues.includes(item)}
                      disabled={
                        !selectedValues.includes(item) &&
                        selectedValues.length >= 3
                      }
                      className="h-6 w-6 rounded-full"
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
        </div>

        <div className="flex justify-between items-center w-full max-w-[700px]">
          <button
            onClick={() => nav("/barriers")}
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
              disabled={selectedValues.length === 0 && !inputValue.trim()}
              className={`p-4 w-[128px] h-[44px] flex items-center justify-center rounded-full text-base font-semibold ${
                selectedValues.length > 0 || inputValue.trim()
                  ? "bg-[#1C63DB] text-white"
                  : "bg-[#DDEBF6] text-white cursor-not-allowed"
              }`}
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
