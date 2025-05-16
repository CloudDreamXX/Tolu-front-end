import { useState } from "react";
import Detective from "shared/assets/icons/detective";
import { AuthPageWrapper } from "shared/ui";
import { BottomButtons } from "widgets/BottomButtons";
import { HeaderOnboarding } from "widgets/HeaderOnboarding";
import { Slider } from "shared/ui/slider";
import { useDispatch } from "react-redux";
import { setFormField } from "entities/store/clientOnboardingSlice";
import { useNavigate } from "react-router-dom";

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

  return (
    <AuthPageWrapper>
      <HeaderOnboarding currentStep={6} steps={8} />
      <main className="flex flex-col w-full items-center gap-8 justify-center self-stretch">
        <div className="flex flex-col items-center">
          <h1 className="flex items-center justify-center text-[#1D1D1F] text-center text-h1">
            Readiness to Commit
          </h1>
        </div>

        <div className="w-full max-w-[700px] p-[40px] rounded-2xl bg-white flex flex-col gap-6 items-start justify-center">
          <h3 className="font-[Nunito] text-[18px] font-bold text-[#1D1D1F]">
            How ready are you to make changes for your health?
          </h3>

          {/* Slider Message Box */}
          <div className="flex gap-2 items-center justify-center">
            <Detective width={20} height={20} />
            <p className="flex flex-1 font-[Nunito] text-[14px]/[20px] font-medium text-[#1B2559]">
              {readinessMessages[value[0] - 1]}
            </p>
          </div>

          {/* Slider Control */}
          <div className="w-full">
            <Slider
              min={1}
              max={10}
              step={1}
              value={value}
              onValueChange={handleSliderChange}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-[#1D1D1F] font-[12px] font-[Nunito]">
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
          </div>
        </div>

        <BottomButtons
          handleNext={handleNext}
          skipButton={() => nav("/summary")}
          isButtonActive={() => true}
        />
      </main>
    </AuthPageWrapper>
  );
};
