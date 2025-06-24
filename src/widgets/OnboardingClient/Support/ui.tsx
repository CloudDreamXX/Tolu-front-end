import { setFormField } from "entities/store/clientOnboardingSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Checkbox, Input } from "shared/ui";
import { BottomButtons } from "widgets/BottomButtons";
import { OnboardingClientLayout } from "../Layout";
import { checkboxes } from "./utils";

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

  const title = (
    <h1 className="flex w-full items-center justify-center text-[#1D1D1F] text-center text-[24px] md:text-[32px] font-bold">
      Support Network
    </h1>
  );

  const mainContent = (
    <>
      <h3 className="font-[Nunito] text-[18px] font-bold text-[#1D1D1F]">
        Who do you currently rely on for support (if anyone)?
      </h3>

      {checkboxes
        .reduce((rows, item, index) => {
          if (index % 2 === 0) rows.push(checkboxes.slice(index, index + 2));
          return rows;
        }, [] as string[][])
        .map((rowItems, rowIndex) => (
          <div key={rowIndex} className="flex flex-col w-full gap-6">
            {rowItems.map((item, i) => (
              <div key={i} className="flex items-center flex-1 gap-4">
                <Checkbox
                  onCheckedChange={(checked) =>
                    handleInputChange(item, checked === true)
                  }
                  value={item}
                  checked={selectedSupport.includes(item)}
                  className="w-6 h-6 rounded-lg"
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
          className="w-full text-[16px] font-[Nunito] font-medium py-[11px] px-[16px]"
          placeholder="Someone who supports you"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
    </>
  );

  return (
    <OnboardingClientLayout
      currentStep={4}
      numberOfSteps={8}
      title={title}
      children={mainContent}
      buttons={
        <BottomButtons
          handleNext={handleNext}
          skipButton={() => nav("/personality-type")}
          isButtonActive={() => selectedSupport.length > 0}
        />
      }
    />
  );
};
