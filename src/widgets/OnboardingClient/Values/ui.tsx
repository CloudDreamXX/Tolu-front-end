import { RootState } from "entities/store";
import { setFormField } from "entities/store/clientOnboardingSlice";
import { UserService } from "entities/user";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { usePageWidth } from "shared/lib";
import { AuthPageWrapper, Checkbox, Input } from "shared/ui";
import { Footer } from "widgets/Footer";
import { HeaderOnboarding } from "widgets/HeaderOnboarding";
import { checkboxes } from "./utils";

export const Values = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { isMobileOrTablet } = usePageWidth();

  const token = useSelector((state: RootState) => state.user.token);
  const clientOnboarding = useSelector(
    (state: RootState) => state.clientOnboarding
  );

  const selectedValues = clientOnboarding.important_values || [];
  const [inputValue, setInputValue] = useState("");

  const handleCheckboxChange = (value: string, checked: boolean) => {
    let updated = [...selectedValues];
    if (checked && updated.length < 3) {
      updated.push(value);
    } else if (!checked) {
      updated = updated.filter((v) => v !== value);
    }
    dispatch(setFormField({ field: "important_values", value: updated }));
  };

  const handleNext = async () => {
    let finalValues = [...selectedValues];
    if (finalValues.includes("Other") && inputValue.trim()) {
      finalValues = finalValues.map((v) =>
        v === "Other" ? inputValue.trim() : v
      );
    }

    const updated = {
      ...clientOnboarding,
      important_values: finalValues,
    };
    dispatch(setFormField({ field: "important_values", value: finalValues }));

    await UserService.onboardClient(updated, token);
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
            <h3 className=" text-[18px] font-bold text-[#1D1D1F]">
              What values are most important to you right now?
            </h3>
            <div className="flex items-center justify-between w-full">
              <p className="text-[#1D1D1F]  text-[16px] font-medium">
                Please choose up to 3.
              </p>
              <p className="text-[#1D1D1F]  text-[16px] font-bold">
                {selectedValues.length}/
                <span className="text-[12px] font-normal  text-[#B3BCC8]">
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
                        handleCheckboxChange(item, checked === true)
                      }
                      disabled={
                        !selectedValues.includes(item) &&
                        selectedValues.length >= 3
                      }
                      className="w-6 h-6 rounded-lg"
                    />
                    <p className=" text-[16px] font-medium text-[#1D1D1F]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            ))}

          {selectedValues.includes("Other") && (
            <div className="flex flex-col gap-[10px] w-full max-w-[700px] items-start">
              <label className="text-[16px] font-medium  text-[#1D1D1F]">
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
