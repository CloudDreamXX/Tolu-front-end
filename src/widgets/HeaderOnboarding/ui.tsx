import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { getStepStyle } from "./uitls";

interface HeaderOnboardingProps {
  currentStep: number;
  steps?: number;
}

export const HeaderOnboarding = ({ currentStep, steps = 6 }: HeaderOnboardingProps) => {
  const navigate = useNavigate();
  
  return (
    <header className="flex items-center justify-between px-[40px] self-stretch bg-gradient-to-b from-[#F3ECFE] to-[#E8EFFE]">
  {/* Logo Section */}
  <div className="flex flex-col items-center p-[40px] justify-center">
    <h2
      onClick={() => navigate("/")}
      className="cursor-pointer text-[#1D1D1F] text-center text-[40px] font-bold font-[Open Sans]"
    >
      VITAI
    </h2>
    <h4 className="text-[#1D1D1F] text-center text-[20px] font-medium font-[Open Sans]">
      Coach Admin
    </h4>
  </div>

  {/* Progress Bar Section (centered) */}
  <div className="flex-1 flex justify-center mr-44">
    <div className="w-[750px] h-[95px] flex items-center justify-between relative">
      <div className="absolute top-1/2 left-0 right-0 h-[8px] bg-[#E2E2E2] z-0 transform -translate-y-1/2" />
      <div
        className="absolute top-1/2 left-0 h-[8px] bg-[#1866E0] z-10 transform -translate-y-1/2 transition-all duration-300"
        style={{ width: `${(currentStep / (steps - 1)) * 100}%` }}
      />
      {Array.from({ length: steps }).map((_, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const style = getStepStyle({ isCompleted, isCurrent });

        return (
          <div
            key={index}
            className="z-20 relative w-[32px] h-[32px] flex items-center justify-center rounded-full"
            style={style}
          >
            {isCompleted ? (
              <FaCheck size={14} />
            ) : isCurrent ? (
              <div className="w-[14px] h-[14px] rounded-full border-[3px] border-[#1866E0] bg-white"></div>
            ) : (
              <div className="text-white font-[Roboto] font-bold">{index + 1}</div>
            )}
          </div>
        );
      })}
    </div>
  </div>
</header>

  );
};
