import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { getStepStyle } from "./uitls";

interface HeaderOnboardingProps {
  currentStep: number;
  steps?: number;
}

export const HeaderOnboarding = ({ currentStep }: HeaderOnboardingProps) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center self-stretch pr-[40px] gap-[351px] bg-gradient-to-b from-[#F3ECFE] to-[#E8EFFE]">
      {/* Logo Section */}
      <div className="flex flex-col items-center p-[40px] justify-center">
        <h2
          onClick={() => navigate("/")}
          className="cursor-pointer text-[#1D1D1F] text-center text-[40px] font-bold font-open h-[54px]"
        >
          TOLU
        </h2>
        <h4 className="text-[#1D1D1F] text-center text-[20px] font-medium font-open h-[27px]">
          Coach Admin
        </h4>
      </div>

      {/* Progress Bar Section */}
      <div className="w-[750px] h-[95px] flex items-center justify-between relative">
        {/* Gray base line */}
        <div className="absolute top-1/2 left-0 right-0 h-[8px] bg-[#E2E2E2] z-0 transform -translate-y-1/2" />

        {/* Blue progress line (behind completed steps only) */}
        <div
          className="absolute top-1/2 left-0 h-[8px] bg-[#1866E0] z-10 transform -translate-y-1/2 transition-all duration-300"
          style={{ width: `${(currentStep / 5) * 100}%` }}
        />

        {Array.from({ length: 6 }).map((_, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const style = getStepStyle({ isCompleted, isCurrent });

          return (
            <div
              key={index}
              className="z-20 relative w-[32px] h-[32px] flex items-center justify-center rounded-full"
              style={{
                ...style,
              }}
            >
              {isCompleted ? (
                <FaCheck size={14} />
              ) : isCurrent ? (
                <div className="w-[14px] h-[14px] rounded-full border-[3px] border-[#1866E0] bg-white"></div>
              ) : (
                <div className="text-white font-[Roboto] font-bold">
                  {index + 1}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </header>
  );
};
