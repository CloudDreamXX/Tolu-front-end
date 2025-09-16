import { RootState } from "entities/store";
import { setFormField } from "entities/store/clientOnboardingSlice";
import { UserService } from "entities/user";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Input } from "shared/ui";
import { BottomButtons } from "widgets/BottomButtons";
import { OnboardingClientLayout } from "../Layout";
import { radioContent } from "./utils";

export const Barriers = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.user.token);
  const clientOnboarding = useSelector(
    (state: RootState) => state.clientOnboarding
  );

  const selectedBarrier = clientOnboarding.barriers || "";
  const [input, setInput] = useState("");

  const isOtherSelected = selectedBarrier === "Other";
  const trimmedInput = input.trim();

  const handleNext = async () => {
    const valueToSave = isOtherSelected ? trimmedInput : selectedBarrier;

    const updated = {
      ...clientOnboarding,
      barriers: valueToSave,
    };

    dispatch(setFormField({ field: "barriers", value: valueToSave }));

    await UserService.onboardClient(updated, token);
    nav("/support");
  };

  const isFilled = () => {
    return isOtherSelected ? trimmedInput !== "" : selectedBarrier !== "";
  };

  const title = (
    <h1 className="flex w-full items-center justify-center text-[#1D1D1F] text-center text-[24px] md:text-[32px] font-bold">
      Struggles & Blockers
    </h1>
  );

  const mainContent = (
    <>
      <h1 className="text-h5 text-[18px] text-[#1D1D1F]">
        What have been getting in your way so far?
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
              checked={selectedBarrier === item}
              onChange={(e) =>
                dispatch(
                  setFormField({ field: "barriers", value: e.target.value })
                )
              }
            />
            <p className="flex-1 text-[16px] font-medium text-[#1D1D1F] text-wrap">
              {item}
            </p>
          </div>
        ))}
      </div>

      {isOtherSelected && (
        <div className="flex flex-col gap-[10px] w-full items-start">
          <label className="text-[16px] font-medium text-[#1D1D1F]">
            Your variant
          </label>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Other"
            className="w-full text-[16px] font-medium py-[11px] px-[16px]"
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
