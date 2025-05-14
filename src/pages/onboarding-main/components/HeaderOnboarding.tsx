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

          return (
            <div
              key={index}
              className="z-20 relative w-[32px] h-[32px] flex items-center justify-center rounded-full"
              style={{
                backgroundColor: isCompleted
                  ? "#1866E0"
                  : isCurrent
                    ? "white"
                    : "#D9D9D9",
                border: isCompleted
                  ? "3px solid #1866E0"
                  : isCurrent
                    ? "3px solid #1866E0"
                    : "3px solid #D9D9D9",
                boxShadow: "inset 0px 1px 3px rgba(0,0,0,0.2)",
                color: isCompleted ? "white" : "#5F5F65",
                fontWeight: "700",
                fontSize: "14px",
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
