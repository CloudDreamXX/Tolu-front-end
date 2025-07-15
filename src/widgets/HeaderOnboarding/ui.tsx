import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { getStepStyle } from "./uitls";
import { usePageWidth } from "shared/lib";

interface HeaderOnboardingProps {
  currentStep: number;
  steps?: number;
  isClient?: boolean;
}

export const HeaderOnboarding = ({
  currentStep,
  isClient,
  steps = 6,
}: HeaderOnboardingProps) => {
  const navigate = useNavigate();
  const { isMobile } = usePageWidth();

  return (
    <header className="w-full bg-gradient-to-b from-[#F3ECFE] to-[#E8EFFE] px-4 pt-4 pb-2 md:h-[160px] flex flex-col md:items-center md:justify-center relative">
      {/* Logo Section */}
      <div className="flex flex-col self-start items-centr md:absolute md:left-10 md:top-1/2 md:-translate-y-1/2 md:self-center">
        <h2
          onClick={() => navigate("/")}
          className="cursor-pointer text-[#1D1D1F] text-center text-[27px] md:text-[44px] font-bold font-open h-[38px] md:h-[61px]"
        >
          TOLU
        </h2>
        <h4 className="capitalize text-[#1D1D1F] text-center text-[9.7px] md:text-[11.429px] font-semibold font-open leading-[normal]">
          {isClient ? (
            <div className="flex flex-col text-center">
              <span className="text-[#1D1D1F] text-[7px] md:text-[11.429px] font-semibold font-open leading-[normal]">
                YOUR MENOPAUSE
              </span>
              <span className="text-[#1D1D1F] text-[7px] md:text-[11.429px] font-semibold font-open leading-[normal]">
                HEALTH ASSISTANT
              </span>
            </div>
          ) : (
            <span className="capitalize text-[#1D1D1F] text-center text-[9.7px] md:text-[17.733px] font-semibold font-open leading-[normal]">
              COACH ADMIN
            </span>
          )}
        </h4>
      </div>

      {/* Progress Steps */}
      {!isClient && (
        <div className="mt-4 xl:top-1/2 md:left-[100px] lg:left-[70px] xl:left-0 md:-translate-y-1/2 md:min-w-[489px] lg:w-[700px] xl:w-full max-w-[750px] md:relative">
          <div className="absolute top-5 left-0 md:top-1/2 h-[5px] xl:h-[8px] w-full bg-[#E2E2E2] rounded-full relative z-0" />

          <div
            className="absolute left-[16px] top-[104px] md:left-0 md:top-1/2 h-[5px] xl:h-[8px] bg-[#1866E0] rounded-full z-10 transition-all duration-300"
            style={{
              width: `${(currentStep / (steps - 1)) * (isMobile ? 90 : 100)}%`,
            }}
          />

          <div className="relative z-20 flex justify-between items-center w-full mt-[-32px] md:mt-0 h-[95px] md:h-auto xl:h-[95px]">
            {Array.from({ length: steps }).map((_, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const style = getStepStyle({ isCompleted, isCurrent, isMobile });

              return (
                <div
                  key={index}
                  className="w-[18px] h-[18px] xl:w-[32px] xl:h-[32px] flex items-center justify-center rounded-full"
                  style={style}
                >
                  {isCompleted ? (
                    <FaCheck size={isMobile ? 10 : 14} />
                  ) : isCurrent ? (
                    <div className="w-[12px] h-[12px] xl:w-[14px] xl:h-[14px] rounded-full border-[3px] border-[#1866E0] bg-white" />
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
      )}
    </header>
  );
};
