import { ReactNode } from "react";
import { usePageWidth } from "shared/lib";
import { AuthPageWrapper } from "shared/ui";
import { Footer } from "widgets/Footer";
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

      <main className="flex flex-col items-center justify-center flex-1 gap-8 md:pb-[32px]">
        {title != null && !isMobileOrTablet && title}

        <div className="w-full max-w-[700px] flex flex-col gap-6 items-start justify-center rounded-t-3xl bg-white py-[24px] px-[16px] md:p-10 md:rounded-3xl">
          {title != null && isMobileOrTablet && title}
          {children}
          {buttons != null && isMobileOrTablet && buttons}
        </div>

        {buttons != null && !isMobileOrTablet && buttons}
      </main>

      <Footer position={isMobileOrTablet ? "top-right" : "bottom-right"} />
    </AuthPageWrapper>
  );
};
