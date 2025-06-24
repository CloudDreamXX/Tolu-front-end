import { setFormField } from "entities/store/clientOnboardingSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/ui/select";
import { BottomButtons } from "widgets/BottomButtons";
import { OnboardingClientLayout } from "../Layout";
import { personalities } from "./mock";

export const PersonalityType = () => {
  const dispatch = useDispatch();
  const [radioChosen, setRadioChosen] = useState("");
  const nav = useNavigate();
  const [personalityType, setPersonalityType] = useState("");
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.value;
    const radioId = e.target.id;
    if (isChecked) {
      setRadioChosen(radioId);
    }
  };

  const isButtonActive = () => {
    if (radioChosen === "know" && personalityType.length > 0) {
      return true;
    } else if (radioChosen !== "know" && radioChosen.length > 0) {
      return true;
    }
    return false;
  };

  const handleNext = () => {
    if (
      (radioChosen === "know" && personalityType.length > 0) ||
      radioChosen === "later"
    ) {
      dispatch(
        setFormField({ field: "personalityType", value: personalityType })
      );
      nav("/readiness");
    } else if (radioChosen === "test") {
      nav("/choose-test");
    } else {
      return;
    }
  };

  const title = (
    <div className="flex flex-col items-center w-full">
      <h1 className="flex items-center justify-center text-[#1D1D1F] text-center text-[24px] md:text-[32px] font-bold">
        Personality type
      </h1>
      <p className="text-[#AAC6EC] text-[18px] font-bold font-[Nunito]">
        (Optional)
      </p>
    </div>
  );

  const mainContent = (
    <>
      <div className="flex flex-col items-start gap-2">
        <h3 className="font-[Nunto] text-[18px] font-bold text-[#1D1D1F]">
          Want Deeper Personalization?
        </h3>
        <p className="text-[#5F5F65] font-[Nunto] text-[16px] font-medium">
          Understanding your personality can help TOLU tailor support to how you
          best learn and take action.
        </p>
      </div>
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center h-6 gap-4">
          <input
            onChange={handleRadioChange}
            id="test"
            name="personality"
            type="radio"
            className="flex items-center w-6 h-6"
          />
          <p className="font-[Nunito] text-[16px] font-medium text-[#1D1D1F]">
            Take a quick test
          </p>
        </div>
        <div className="flex items-center h-6 gap-4">
          <input
            onChange={handleRadioChange}
            type="radio"
            id="know"
            name="personality"
            className="flex items-center w-6 h-6"
          />
          <p className="font-[Nunito] text-[16px] font-medium text-[#1D1D1F]">
            I already know my type
          </p>
        </div>
        {radioChosen === "know" && (
          <div className="flex w-[600px] flex-col gap-[10px] items-start">
            <p className="font-[Nunito] text-[16px] font-medium text-[#1D1D1F]">
              Personality type
            </p>
            <Select value={personalityType} onValueChange={setPersonalityType}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {personalities.map((personality) => (
                    <SelectItem key={personality} value={personality}>
                      {personality}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center h-6 gap-4">
          <input
            onChange={handleRadioChange}
            type="radio"
            id="later"
            name="personality"
            className="flex items-center w-6 h-6"
          />
          <p className="font-[Nunito] text-[16px] font-medium text-[#1D1D1F]">
            I'll do it later
          </p>
        </div>
      </div>
    </>
  );

  return (
    <OnboardingClientLayout
      currentStep={5}
      numberOfSteps={8}
      title={title}
      children={mainContent}
      buttons={
        <BottomButtons
          handleNext={handleNext}
          skipButton={() => nav("/readiness")}
          isButtonActive={isButtonActive}
        />
      }
    />
  );
};
