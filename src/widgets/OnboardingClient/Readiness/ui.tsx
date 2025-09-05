import { setFormField } from "entities/store/clientOnboardingSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Detective from "shared/assets/icons/detective";
import { Slider } from "shared/ui/slider";
import { BottomButtons } from "widgets/BottomButtons";
import { OnboardingClientLayout } from "../Layout";

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
  const [value, setValue] = useState([2]);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const handleNext = () => {
    dispatch(
      setFormField({
        field: "readiness",
        value: readinessMessages[value[0] - 1],
      })
    );
    nav("/summary");
  };

  const handleSliderChange = (val: number[]) => {
    setValue(val);
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
        <div className="w=[20px] h=[20px]">
          <Detective />
        </div>
        <p className="flex flex-1  text-[14px]/[20px] font-medium text-[#1B2559]">
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
          colors={[
            "#1C63DB",
            "#1C63DB",
            "#1C63DB",
            "#1C63DB",
            "#1C63DB",
            "#1C63DB",
            "#1C63DB",
            "#1C63DB",
            "#1C63DB",
            "#1C63DB",
          ]}
        />
        <div className="flex justify-between mt-2 text-xs text-[#1D1D1F] font-[12px] ">
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
          isButtonActive={() => true}
        />
      }
    />
  );
};
