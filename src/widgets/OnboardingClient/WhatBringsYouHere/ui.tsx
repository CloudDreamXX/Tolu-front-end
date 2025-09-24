import { RootState } from "entities/store";
import { setFormField } from "entities/store/clientOnboardingSlice";
import { UserService } from "entities/user";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RadioGroup, RadioGroupItem } from "shared/ui/radio-group";
import { Input } from "shared/ui";
import { BottomButtons } from "widgets/BottomButtons";
import { OnboardingClientLayout } from "../Layout";
import { radioContent } from "./utils";
import { useState, useEffect } from "react";

export const WhatBringsYouHere = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.user.token);
  const clientOnboarding = useSelector(
    (state: RootState) => state.clientOnboarding
  );

  const currentValue = clientOnboarding.main_transition_goal || "";
  const isOtherSelected = currentValue === "Other";
  const [input, setInput] = useState("");
  const trimmedInput = input.trim();

  useEffect(() => {
    const saved = clientOnboarding.main_transition_goal;

    if (saved && !radioContent.includes(saved)) {
      setInput(saved);
      dispatch(setFormField({ field: "main_transition_goal", value: "Other" }));
    }
  }, [clientOnboarding.main_transition_goal, dispatch]);

  const handleNext = async () => {
    const finalValue = isOtherSelected ? trimmedInput : currentValue;

    const updated = {
      ...clientOnboarding,
      main_transition_goal: finalValue,
    };

    dispatch(
      setFormField({ field: "main_transition_goal", value: finalValue })
    );

    await UserService.onboardClient(updated, token);

    nav("/values");
  };

  const isFilled = () =>
    isOtherSelected ? trimmedInput !== "" : currentValue !== "";

  const title = (
    <h1 className="flex w-full items-center justify-center text-[#1D1D1F] text-center text-[24px] md:text-[32px] font-bold">
      What Brings You Here?
    </h1>
  );

  const mainContent = (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-[18px] font-bold text-[#1D1D1F]">
          What’s your main goal during this transition?
        </h1>
        <p className="text-[16px] font-medium text-[#5F5F65]">
          Please give us just one goal that describes you.
        </p>
      </div>

      <RadioGroup
        value={currentValue}
        onValueChange={(val) =>
          dispatch(setFormField({ field: "main_transition_goal", value: val }))
        }
        className="flex flex-col w-full gap-4"
      >
        {radioContent.map((item, index) => (
          <div key={item} className="flex items-center w-full gap-4">
            <RadioGroupItem
              value={item}
              id={`radio-${index}`}
              className="mt-[5px] w-6 h-6"
            />
            <label
              htmlFor={`radio-${index}`}
              className="flex flex-grow cursor-pointer text-[16px] font-medium text-[#1D1D1F]"
            >
              {item}
            </label>
          </div>
        ))}
      </RadioGroup>

      {isOtherSelected && (
        <div className="flex flex-col gap-[10px] w-full items-start">
          <label className="text-[16px] font-medium text-[#1D1D1F]">
            What does a healthy menopause transition look like to you?
          </label>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="My main goal"
            className="w-full text-[16px] font-medium py-[11px] px-[16px]"
          />
        </div>
      )}
    </div>
  );

  return (
    <OnboardingClientLayout
      currentStep={1}
      numberOfSteps={8}
      title={title}
      children={mainContent}
      buttons={
        <BottomButtons
          handleNext={handleNext}
          skipButton={() => nav("/values")}
          isButtonActive={isFilled}
        />
      }
    />
  );
};
