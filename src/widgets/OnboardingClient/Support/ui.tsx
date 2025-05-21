import React, { useState } from "react";
import { useNavigate } from "react-router";
import { AuthPageWrapper, Checkbox, Input } from "shared/ui";
import { Footer } from "widgets/Footer";
import { HeaderOnboarding } from "widgets/HeaderOnboarding";
import { BottomButtons } from "widgets/BottomButtons";
import { checkboxes } from "./utils";
import { useDispatch } from "react-redux";
import { setFormField } from "entities/store/clientOnboardingSlice";

export const Support = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const [selectedSupport, setSelectedSupport] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedSupport((prev) => [...prev, value]);
    } else {
      setSelectedSupport((prev) => prev.filter((v) => v !== value));
    }
  };

  const handleNext = () => {
    const finalSupport = [...selectedSupport];

    if (selectedSupport.includes("Other") && inputValue.trim()) {
      finalSupport.splice(finalSupport.indexOf("Other"), 1, inputValue.trim());
    }

    dispatch(setFormField({ field: "support", value: finalSupport }));
    nav("/personality-type");
  };

  return (
    <AuthPageWrapper>
      <HeaderOnboarding currentStep={4} steps={8} />
      <main className="flex flex-col items-center gap-8 justify-center self-stretch">
        <h1 className="flex items-center justify-center text-[#1D1D1F] text-center text-h1">
          Support Network
        </h1>
        <div className="w-full max-w-[700px] p-[40px] rounded-2xl bg-white flex flex-col gap-6 items-start justify-center">
          <div className="flex flex-col gap-2 w-full max-w-[700px] items-start">
            <h3 className="font-[Nunito] text-[18px] font-bold text-[#1D1D1F]">
              Who do you currently rely on for support (if anyone)?
            </h3>
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
                    <Checkbox
                      onCheckedChange={(checked) => handleInputChange(item, checked === true)}
                      value={item}
                      checked={selectedSupport.includes(item)}
                      className="h-6 w-6 rounded-lg"
                    />
                    <p className="font-[Nunito] text-[16px] font-medium text-[#1D1D1F]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            ))}

            <div className="flex flex-col gap-[10px] w-full max-w-[700px] items-start">
              <label className="text-[16px] font-medium font-[Nunito] text-[#1D1D1F]">
                Is there anything else we should know?
              </label>
              <Input
                className="w-full"
                placeholder="Someone who supports you"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
        </div>

        <BottomButtons
          handleNext={handleNext}
          skipButton={() => nav("/personality-type")}
          isButtonActive={() =>
            selectedSupport.length > 0
          }
        />
      </main>
      <Footer />
    </AuthPageWrapper>
  );
};
