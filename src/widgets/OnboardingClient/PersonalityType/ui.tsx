import React, { useState } from "react";
import { useNavigate } from "react-router";
import { AuthPageWrapper } from "shared/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/ui/select";
import { Footer } from "widgets/Footer";
import { HeaderOnboarding } from "widgets/HeaderOnboarding";
import { personalities } from "./mock";
import { BottomButtons } from "widgets/BottomButtons";
import { useDispatch } from "react-redux";
import { setFormField } from "entities/store/clientOnboardingSlice";

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

  return (
    <AuthPageWrapper>
      <HeaderOnboarding isClient currentStep={5} steps={8} />
      <main className="flex flex-col w-full items-center gap-8 justify-center self-stretch">
        <div className="flex flex-col items-center">
          <h1 className="flex items-center justify-center text-[#1D1D1F] text-center text-h1">
            Personality type
          </h1>
          <p className="text-[#AAC6EC] text-[18px] font-bold font-[Nunito]">
            (Optional)
          </p>
        </div>
        <div className="w-full max-w-[700px] p-[40px] rounded-2xl bg-white flex flex-col gap-6 items-start justify-center">
          <div className="flex flex-col items-start gap-2">
            <h3 className="font-[Nunto] text-[18px] font-bold text-[#1D1D1F]">
              Want Deeper Personalization?
            </h3>
            <p className="text-[#5F5F65] font-[Nunto] text-[16px] font-medium">
              Understanding your personality can help TOLU tailor support to
              how you best learn and take action.
            </p>
          </div>
          <div className="flex gap-4 flex-col items-start">
            <div className="flex gap-4 items-center h-6">
              <input
                onChange={handleRadioChange}
                id="test"
                name="personality"
                type="radio"
                className="h-6 w-6 flex items-center"
              />
              <p className="font-[Nunito] text-[16px] font-medium text-[#1D1D1F]">
                Take a quick test
              </p>
            </div>
            <div className="flex gap-4 items-center h-6">
              <input
                onChange={handleRadioChange}
                type="radio"
                id="know"
                name="personality"
                className="h-6 w-6 flex items-center"
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
                <Select
                  value={personalityType}
                  onValueChange={setPersonalityType}
                >
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
            <div className="flex gap-4 items-center h-6">
              <input
                onChange={handleRadioChange}
                type="radio"
                id="later"
                name="personality"
                className="h-6 w-6 flex items-center"
              />
              <p className="font-[Nunito] text-[16px] font-medium text-[#1D1D1F]">
                I'll do it later
              </p>
            </div>
          </div>
        </div>
        <BottomButtons
          handleNext={handleNext}
          skipButton={() => nav("/readiness")}
          isButtonActive={isButtonActive}
        />
      </main>
      <Footer />
    </AuthPageWrapper>
  );
};
