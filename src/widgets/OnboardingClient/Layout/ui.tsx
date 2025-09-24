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
  const mainClass = `
    flex flex-col items-center justify-end lg:justify-center
    w-full lg:gap-[32px]
     xl:h-full xl:pb-[120px]
  `;

  return (
    <AuthPageWrapper>
      {currentStep != null && numberOfSteps != null && (
        <HeaderOnboarding
          isClient
          currentStep={currentStep}
          steps={numberOfSteps}
        />
      )}

      <main className={mainClass}>
        {title != null && !isMobileOrTablet && title}

        <div
          className="w-full lg:max-w-[718px] flex flex-col 
  items-start justify-center gap-[24px] bg-white rounded-t-3xl lg:rounded-3xl py-[24px] px-[16px] md:p-[40px] lg:p-[24px]"
        >
          {title != null && isMobileOrTablet && title}
          {children}
          {buttons != null && isMobileOrTablet && buttons}
        </div>

        {buttons != null && !isMobileOrTablet && buttons}
        <div className="bg-white lg:bg-transparent lg:mt-[37px] w-full flex items-center justify-center gap-[24px] text-[18px] text-[#000] p-[16px] lg:py-0">
          All information you share is secure and confidential
          <img src={"/hipaa.png"} className="h-[50px]" />
          <img src={"/ssl.png"} className="h-[50px]" />
        </div>
      </main>

      {/* <Footer position={isMobileOrTablet ? "top-right" : "bottom-right"} /> */}
    </AuthPageWrapper>
  );
};
