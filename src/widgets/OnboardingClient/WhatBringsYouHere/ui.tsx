import { RootState } from "entities/store";
import { setFormField } from "entities/store/clientOnboardingSlice";
import { UserService } from "entities/user";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn, usePageWidth } from "shared/lib";
import { AuthPageWrapper, Input } from "shared/ui";
import { RadioGroup, RadioGroupItem } from "shared/ui/radio-group";
import { Footer } from "widgets/Footer";
import { HeaderOnboarding } from "widgets/HeaderOnboarding";
import { radioContent } from "./utils";

export const WhatBrringsYouHere = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const clientOnboarding = useSelector(
    (state: RootState) => state.clientOnboarding
  );

  const currentValue = clientOnboarding.main_transition_goal || "";
  const isOtherSelected = currentValue === "Other";
  const { isMobileOrTablet } = usePageWidth();

  const handleNext = async () => {
    const finalValue =
      isOtherSelected && clientOnboarding.main_transition_goal
        ? clientOnboarding.main_transition_goal.trim()
        : currentValue;

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

  const isFilled = () => {
    return isOtherSelected
      ? clientOnboarding.main_transition_goal?.trim() !== ""
      : currentValue !== "";
  };

  const title = (
    <h1 className="flex w-full items-center justify-center text-[#1D1D1F] text-center text-[24px] md:text-[32px] font-bold">
      What Brings You Here?
    </h1>
  );

  const buttonsBlock = (
    <div className="flex justify-between items-center w-full max-w-[700px] flex-col-reverse gap-6 md:flex-row">
      <button
        onClick={handleNext}
        className="flex p-4 h-[44px] items-center justify-center text-base font-semibold text-[#1C63DB]"
      >
        Skip this for now
      </button>

      <div className="flex w-full gap-4 md:w-auto">
        <button
          onClick={() => nav(-1)}
          className="p-4 w-full md:w-[128px] h-[44px] flex items-center justify-center rounded-full text-base font-semibold bg-[#DDEBF6] text-[#1C63DB]"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!isFilled()}
          className={cn(
            "p-4 w-full md:w-[128px] h-[44px] flex items-center justify-center rounded-full text-base font-semibold",
            isFilled()
              ? "bg-[#1C63DB] text-white"
              : "bg-[#DDEBF6] text-white cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );

  return (
    <AuthPageWrapper>
      <HeaderOnboarding isClient currentStep={1} steps={8} />
      <main className="flex flex-col items-center self-stretch justify-center gap-8">
        {!isMobileOrTablet && title}
        <div className="w-full max-w-[700px] flex gap-6 flex-col items-start justify-center rounded-t-3xl bg-white py-[24px] px-[16px] md:p-10 md:rounded-3xl">
          {isMobileOrTablet && title}

          <div className="flex flex-col items-start gap-2">
            <h1 className="text-h5  text-[18px] text-[#1D1D1F]">
              What’s your main goal during this transition?
            </h1>
            <p className="text-[16px] font-medium  text-[#5F5F65]">
              Please give us just one goal that describes you.
            </p>
          </div>

          <RadioGroup
            value={currentValue}
            onValueChange={(val) =>
              dispatch(
                setFormField({ field: "main_transition_goal", value: val })
              )
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
                  className="flex flex-grow cursor-pointer"
                >
                  <span className="inline-flex">
                    <p className="text-[16px] font-medium text-[#1D1D1F] leading-snug mr-1">
                      {item}
                      <span className="whitespace-nowrap inline-flex items-center align-center ml-1">
                        <MaterialIcon
                          iconName="help"
                          size={16}
                          fill={1}
                          className="text-[#1C63DB]"
                        />
                      </span>
                    </p>
                  </span>
                </label>
              </div>
            ))}
          </RadioGroup>

          {isOtherSelected && (
            <div className="flex flex-col gap-[10px] w-full items-start">
              <label className="text-[16px] font-medium  text-[#1D1D1F]">
                What does a healthy menopause transition look like to you?
              </label>
              <Input
                value={clientOnboarding.main_transition_goal ?? ""}
                onChange={(e) =>
                  dispatch(
                    setFormField({
                      field: "main_transition_goal",
                      value: e.target.value,
                    })
                  )
                }
                placeholder="My main goal"
                className="w-full text-[16px]  font-medium py-[11px] px-[16px]"
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
