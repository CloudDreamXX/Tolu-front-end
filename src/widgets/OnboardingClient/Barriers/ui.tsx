import { setFormField } from "entities/store/clientOnboardingSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Input } from "shared/ui";
import { BottomButtons } from "widgets/BottomButtons";
import { radioContent } from "./utils";
import { OnboardingClientLayout } from "../Layout";

export const Barriers = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const [radio, setRadio] = useState({ value: "", id: "" });
  const [input, setInput] = useState("");

  const isOtherSelected = radio.value === "Other";
  const trimmedInput = input.trim();

  const handleNext = () => {
    const valueToSave = isOtherSelected ? trimmedInput : radio.value;
    dispatch(setFormField({ field: "barriers", value: valueToSave }));
    nav("/support");
  };

  const isFilled = () => {
    return isOtherSelected ? trimmedInput !== "" : radio.value !== "";
  };

  const title = (
    <h1 className="flex w-full items-center justify-center text-[#1D1D1F] text-center text-[24px] md:text-[32px] font-bold"></h1>
  );

  const mainContent = (
    <>
      <h1 className="text-h5 font-[Nunito] text-[18px] text-[#1D1D1F]">
        What’s been getting in your way so far?
      </h1>
      <div className="flex flex-col gap-4">
        {radioContent.map((item, index) => (
          <div key={item} className="flex items-center w-full gap-4">
            <input
              type="radio"
              name="problem"
              value={item}
              id={index.toString()}
              className="w-6 h-6 rounded-full"
              checked={radio.value === item}
              onChange={(e) =>
                setRadio({ value: e.target.value, id: e.target.id })
              }
            />
            <p className="flex-1 font-[Nunito] text-[16px] font-medium text-[#1D1D1F] text-wrap">
              {item}
            </p>
          </div>
        ))}
      </div>

      {isOtherSelected && (
        <div className="flex flex-col gap-[10px] w-full items-start">
          <label className="text-[16px] font-medium font-[Nunito] text-[#1D1D1F]">
            Your variant
          </label>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Other"
            className="w-full text-[16px] font-[Nunito] font-medium py-[11px] px-[16px]"
          />
        </div>
      )}
    </>
  );

  return (
    <OnboardingClientLayout
      currentStep={3}
      numberOfSteps={8}
      title={title}
      children={mainContent}
      buttons={
        <BottomButtons
          handleNext={handleNext}
          skipButton={handleNext}
          isButtonActive={isFilled}
        />
      }
    />
  );
};
