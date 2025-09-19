import { setFormField } from "entities/store/clientOnboardingSlice";
import { useDispatch, useSelector } from "react-redux";
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
import { RootState } from "entities/store";
import { UserService } from "entities/user";
import { useState } from "react";

export const PersonalityType = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((s: RootState) => s.user.token);
  const clientOnboarding = useSelector((s: RootState) => s.clientOnboarding);

  const initialSavedType = clientOnboarding.personality_type ?? "";
  const [radioChosen, setRadioChosen] = useState<
    "test" | "know" | "later" | ""
  >(initialSavedType ? "know" : "");

  const [selectedPersonality, setSelectedPersonality] =
    useState<string>(initialSavedType);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id as "test" | "know" | "later";
    setRadioChosen(id);
  };

  const handleNext = async () => {
    const hasType =
      typeof selectedPersonality === "string" &&
      selectedPersonality.trim().length > 0;

    if (radioChosen === "know" && hasType) {
      const updated = {
        ...clientOnboarding,
        personality_type: selectedPersonality.trim(),
      };
      dispatch(
        setFormField({
          field: "personality_type",
          value: updated.personality_type,
        })
      );
      await UserService.onboardClient(updated, token);
      nav("/readiness");
      return;
    }

    if (radioChosen === "test") {
      nav("/choose-test");
      return;
    }

    nav("/readiness");
  };

  const title = (
    <div className="flex flex-col items-center w-full">
      <h1 className="flex items-center justify-center text-[#1D1D1F] text-center text-[24px] md:text-[32px] font-bold">
        Personality type
      </h1>
      <p className="text-[#AAC6EC] text-[18px] font-bold ">(Optional)</p>
    </div>
  );

  const mainContent = (
    <>
      <div className="flex flex-col items-start gap-2">
        <h3 className="font-[Nunto] text-[18px] font-bold text-[#1D1D1F]">
          Do you want deeper personalization?
        </h3>
        <p className="text-[#5F5F65] font-[Nunto] text-[16px] font-medium">
          Understanding your personality can help Tolu tailor support to how you
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
            checked={radioChosen === "test"}
          />
          <p className=" text-[16px] font-medium text-[#1D1D1F]">
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
            checked={radioChosen === "know"}
          />
          <p className=" text-[16px] font-medium text-[#1D1D1F]">
            I already know my type
          </p>
        </div>
        {radioChosen === "know" && (
          <div className="flex w-[600px] flex-col gap-[10px] items-start">
            <p className=" text-[16px] font-medium text-[#1D1D1F]">
              Personality type
            </p>
            <Select
              value={selectedPersonality}
              onValueChange={(val) => {
                setSelectedPersonality(val);
                dispatch(
                  setFormField({ field: "personality_type", value: val })
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {personalities.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
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
            checked={radioChosen === "later"}
          />
          <p className=" text-[16px] font-medium text-[#1D1D1F]">
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
        />
      }
    />
  );
};
