import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { getStepStyle } from "./uitls";

interface HeaderOnboardingProps {
  currentStep: number;
  steps?: number;
  isClient?: boolean;
}

export const HeaderOnboarding = ({ currentStep, isClient, steps = 6 }: HeaderOnboardingProps) => {
  const navigate = useNavigate();

  return (
    <header className="relative w-full bg-gradient-to-b from-[#F3ECFE] to-[#E8EFFE] h-[160px] flex items-center justify-center px-4">
      {/* Logo Section */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <h2
          onClick={() => navigate("/")}
          className="cursor-pointer text-[#1D1D1F] text-center text-[40px] font-bold font-open"
        >
          TOLU
        </h2>
        <h4 className="capitalize text-[#1D1D1F] text-center text-[11.429px] font-medium font-open">
          {isClient ? (
            <>
              <span className="text-nowrap">YOUR MENOPAUSE</span>
              <br />
              <span className="text-nowrap">HEALTH ASSISTANT</span>
            </>
          ) : (
            "COACH ADMIN"
          )}
        </h4>
      </div>

      {/* Centered Progress Bar with Steps */}
      <div className="w-full max-w-[750px] relative">
        {/* Base Track */}
        <div className="absolute top-1/2 left-0 w-full h-[8px] bg-[#E2E2E2] rounded-full -translate-y-1/2 z-0" />

        {/* Progress Fill */}
        <div
          className="absolute top-1/2 left-0 h-[8px] bg-[#1866E0] rounded-full -translate-y-1/2 z-10 transition-all duration-300"
          style={{
            width: `${(currentStep / (steps - 1)) * 100}%`,
          }}
        />

        {/* Step Circles */}
        <div className="relative z-20 flex justify-between items-center w-full h-[95px]">
          {Array.from({ length: steps }).map((_, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const style = getStepStyle({ isCompleted, isCurrent });

            return (
              <div
                key={index}
                className="w-[32px] h-[32px] flex items-center justify-center rounded-full"
                style={style}
              >
                {isCompleted ? (
                  <FaCheck size={14} />
                ) : isCurrent ? (
                  <div className="w-[14px] h-[14px] rounded-full border-[3px] border-[#1866E0] bg-white" />
                ) : (
                  <div className="text-white font-[Roboto] font-bold">
                    {index + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
};
