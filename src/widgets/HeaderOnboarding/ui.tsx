import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { usePageWidth } from "shared/lib";
import { getStepStyle } from "./uitls";

interface HeaderOnboardingProps {
  currentStep: number;
  steps?: number;
  isClient?: boolean;
  text?: string;
}

export const HeaderOnboarding = ({
  currentStep,
  isClient,
  steps = 5,
  text,
}: HeaderOnboardingProps) => {
  const navigate = useNavigate();
  const { isMobile } = usePageWidth();

  return (
    <header className="w-full px-4 pt-[48px] pb-[16px] md:gap-4 md:h-fit flex flex-col justify-center md:items-center relative">
      {/* Logo Section */}
      <img src="/logo.png" className="w-[50px] h-[46px]" />
      <div className="flex flex-col mx-auto w-fit">
        <h2
          onClick={() => navigate("/")}
          className="cursor-pointer text-[#1D1D1F] text-center text-[27px] md:text-[44px] font-bold"
        >
          Tolu AI
        </h2>
        <h4 className="capitalize text-[#1D1D1F] text-center text-[9.7px] md:text-[11.429px] font-semibold  leading-[normal]">
          {isClient ? (
            <span className="text-[#1D1D1F] text-[16px] md:text-[22px] font-normal  leading-[normal] text-center">
              {text ? text : "Knowledge Before Care"}
            </span>
          ) : (
            <span className="capitalize text-[#1D1D1F] text-center text-[9.7px] md:text-[17.733px] font-semibold  leading-[normal]">
              Health Educator Admin
            </span>
          )}
        </h4>
      </div>

      {/* Progress Steps */}
      {steps !== 0 && (
        <div className=" mt-4 relative :top-1/2 md:-translate-y-1/2 md:min-w-[489px] lg:w-[700px] xl:w-full max-w-[750px]">
          <div className="relative w-full h-[32px] xl:h-[40px]">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[5px] xl:h-[8px] bg-[#E2E2E2] rounded-full" />

            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[5px] xl:h-[8px] bg-[#1866E0] rounded-full transition-all duration-300"
              style={{
                width: `${Math.max(0, Math.min(1, currentStep / (steps - 1))) * 100}%`,
              }}
            />

            <div className="absolute inset-0 z-10 flex items-center justify-between">
              {Array.from({ length: steps }).map((_, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                const style = getStepStyle({
                  isCompleted,
                  isCurrent,
                  isMobile,
                });

                return (
                  <div
                    key={index}
                    className="w-[18px] h-[18px] xl:w-[32px] xl:h-[32px] flex items-center justify-center rounded-full"
                    style={style}
                  >
                    {isCompleted ? (
                      <MaterialIcon iconName="check" />
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
        </div>
      )}
    </header>
  );
};
