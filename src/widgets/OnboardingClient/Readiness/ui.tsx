import { setFormField } from "entities/store/clientOnboardingSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Detective from "shared/assets/icons/detective";
import { Slider } from "shared/ui/slider";
import { BottomButtons } from "widgets/BottomButtons";
import { OnboardingClientLayout } from "../Layout";
import { RootState } from "entities/store";
import { UserService } from "entities/user";
import { useState } from "react";

const readinessMessages = [
  "I'm just exploring right now",
  "Thinking about it",
  "Planning to start",
  "Getting ready",
  "Starting soon",
  "Taking first steps",
  "Building habits",
  "Feeling confident",
  "Seeing progress",
  "Fully committed",
];

export const Readiness = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.user.token);
  const clientOnboarding = useSelector(
    (state: RootState) => state.clientOnboarding
  );

  const initialIndex = clientOnboarding.readiness_for_change
    ? readinessMessages.indexOf(clientOnboarding.readiness_for_change) + 1
    : 2;

  const [value, setValue] = useState([initialIndex]);

  const handleSliderChange = (val: number[]) => {
    setValue(val);
    dispatch(
      setFormField({
        field: "readiness_for_change",
        value: readinessMessages[val[0] - 1],
      })
    );
  };

  const handleNext = async () => {
    const updated = {
      ...clientOnboarding,
      readiness_for_change: readinessMessages[value[0] - 1],
    };

    dispatch(
      setFormField({
        field: "readiness_for_change",
        value: updated.readiness_for_change,
      })
    );

    await UserService.onboardClient(updated, token);
    nav("/summary");
  };

  const title = (
    <h1 className="flex w-full items-center justify-center text-[#1D1D1F] text-center text-[24px] md:text-[32px] font-bold">
      Readiness to Commit
    </h1>
  );

  const mainContent = (
    <div className="flex flex-col w-full gap-6 pt-8 pb-16">
      <h3 className=" text-[18px] font-bold text-[#1D1D1F]">
        How ready are you to make changes for your health?
      </h3>

      {/* Slider Message Box */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-[20px] h-[20px]">
          <Detective />
        </div>
        <p className="flex flex-1 text-[14px]/[20px] font-medium text-[#1B2559]">
          {readinessMessages[value[0] - 1]}
        </p>
      </div>

      {/* Slider Control */}
      <div className="w-full">
        <Slider
          min={0}
          max={10}
          step={1}
          value={value}
          onValueChange={handleSliderChange}
          className="w-full"
          colors={Array(10).fill("#1C63DB")}
        />
        <div className="flex justify-between mt-2 text-xs text-[#1D1D1F] font-[12px]">
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <OnboardingClientLayout
      currentStep={6}
      numberOfSteps={8}
      title={title}
      children={mainContent}
      buttons={
        <BottomButtons
          handleNext={handleNext}
          skipButton={() => nav("/summary")}
        />
      }
    />
  );
};
