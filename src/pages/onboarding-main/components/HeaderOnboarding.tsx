import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

interface HeaderOnboardingProps {
  currentStep: number; // 0-based index from 0 to 5
}

export const HeaderOnboarding = ({ currentStep }: HeaderOnboardingProps) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center self-stretch pr-[40px] gap-[351px] bg-gradient-to-b from-[#F3ECFE] to-[#E8EFFE]">
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

      {/* Progress Bar Section */}
      <div className="w-[750px] h-[95px] flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-1/2 left-0 right-0 h-[8px] bg-[#1866E0] z-0 transform -translate-y-1/2" />

        {/* Steps */}
        {Array.from({ length: 6 }).map((_, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={index}
              className="z-10 w-[32px] h-[32px] rounded-full border-[6px] border-[#D9D9D9] bg-white flex items-center justify-center"
              style={{
                backgroundColor: isCompleted || isCurrent ? "#1866E0" : "white",
                borderColor: isCompleted || isCurrent ? "#1866E0" : "#D9D9D9",
              }}
            >
              {isCompleted ? (
                <FaCheck className="text-white text-sm" />
              ) : isCurrent ? (
                <div className="w-[20px] h-[20px] flex items-center justify-center rounded-full border-4 border-white">
                  {index + 1}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </header>
  );
};
