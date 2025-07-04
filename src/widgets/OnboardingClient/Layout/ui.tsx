import { ReactNode } from "react";
import { usePageWidth } from "shared/lib";
import { AuthPageWrapper } from "shared/ui";
// import { Footer } from "widgets/Footer";
import { HeaderOnboarding } from "widgets/HeaderOnboarding";

interface OnboardingClientLayoutProps {
  currentStep?: number;
  numberOfSteps?: number;
  title?: ReactNode;
  buttons?: ReactNode;
  children: ReactNode;
}

export const OnboardingClientLayout: React.FC<OnboardingClientLayoutProps> = ({
  currentStep,
  numberOfSteps,
  title,
  buttons,
  children,
}) => {
  const { isMobileOrTablet } = usePageWidth();

  return (
    <AuthPageWrapper>
      {currentStep != null && numberOfSteps != null && (
        <HeaderOnboarding
          isClient
          currentStep={currentStep}
          steps={numberOfSteps}
        />
      )}

      <main
        className={`
    flex flex-col items-center justify-center
    w-full gap-[16px] md:gap-[8px]
    lg:fixed lg:top-[50%] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%]
    mt-[100px] lg:mt-0
  `}
      >
        {title != null && !isMobileOrTablet && title}

        <div
          className="w-full lg:max-w-[718px] flex flex-col 
  items-start justify-center bg-white rounded-t-3xl lg:rounded-3xl py-[24px] px-[16px] md:p-[40px] lg:p-[24px]"
        >
          {title != null && isMobileOrTablet && title}
          {children}
          {buttons != null && isMobileOrTablet && buttons}
        </div>

        {buttons != null && !isMobileOrTablet && buttons}
      </main>

      {/* <Footer position={isMobileOrTablet ? "top-right" : "bottom-right"} /> */}
    </AuthPageWrapper>
  );
};
