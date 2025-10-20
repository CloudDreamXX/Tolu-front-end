import { ReactNode } from "react";
import { usePageWidth } from "shared/lib";
import { AuthPageWrapper } from "shared/ui";
import { HeaderOnboarding } from "widgets/HeaderOnboarding";

interface OnboardingClientLayoutProps {
  currentStep?: number;
  numberOfSteps?: number;
  title?: ReactNode;
  headerText?: string;
  buttons?: ReactNode;
  children: ReactNode;
}

export const OnboardingClientLayout: React.FC<OnboardingClientLayoutProps> = ({
  currentStep,
  numberOfSteps,
  title,
  headerText,
  buttons,
  children,
}) => {
  const { isMobileOrTablet } = usePageWidth();
  const isLibrary = location.pathname.startsWith("/library");

  return (
    <AuthPageWrapper>
      {currentStep != null && numberOfSteps != null && (
        <HeaderOnboarding
          isClient
          currentStep={currentStep}
          steps={numberOfSteps}
          text={headerText}
        />
      )}

      <main className="flex flex-col items-center justify-start w-full h-full overflow-hidden lg:gap-[32px]">
        {title != null && !isMobileOrTablet && title}

        <div
          className={`w-full lg:max-w-[718px] flex flex-col items-start gap-[24px] bg-white rounded-t-3xl lg:rounded-3xl py-[24px] px-[16px] md:p-[40px] lg:p-[24px] ${
            isLibrary
              ? "overflow-y-auto flex-1 max-h-[70vh] lg:max-h-[35vh] scroll-smooth"
              : ""
          }`}
        >
          {title != null && isMobileOrTablet && title}
          {children}
          {buttons != null && isMobileOrTablet && buttons}
        </div>

        {buttons != null && !isMobileOrTablet && buttons}

        {!isLibrary && (
          <div className="bg-white lg:bg-transparent w-full flex items-center justify-center gap-[24px] text-[14px] text-center md:text-[18px] text-[#000] p-[16px] lg:py-[20px]">
            All information you share is secure and confidential
            <img src="/hipaa.png" className="h-[40px] md:h-[50px]" />
            <img src="/ssl.png" className="h-[40px] md:h-[50px]" />
          </div>
        )}
      </main>
    </AuthPageWrapper>
  );
};
