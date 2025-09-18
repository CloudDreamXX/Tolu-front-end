import { toast } from "shared/lib/hooks/use-toast";
import { Footer } from "../../Footer";
import { useNavigate } from "react-router-dom";
import { AuthPageWrapper } from "shared/ui";
import { useEffect, useState } from "react";
import { AdminHeader } from "widgets/Header";
import { RootState } from "entities/store";
import { UserService } from "entities/user";
import { useSelector } from "react-redux";
import { findFirstIncompleteStep } from "./helpers";

export const OnboardingFinish = () => {
  const coachOnboarding = useSelector(
    (state: RootState) => state.coachOnboarding
  );
  const nav = useNavigate();
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  const handleLastClick = async () => {
    try {
      const res = await UserService.getOnboardingStatus();

      if (res.onboarding_filled === true) {
        await UserService.onboardUser(coachOnboarding);
        nav("/content-manager/library");
        toast({ title: "Onboarding successful" });
        return;
      }

      const issue = findFirstIncompleteStep(coachOnboarding);
      if (issue) {
        nav(issue.route);
        toast({
          variant: "destructive",
          title: "Please complete your onboarding",
          description: `Missing: ${issue.missing.join(", ")}`,
        });
        return;
      }

      await UserService.onboardUser(coachOnboarding);
      nav("/content-manager/library");
      toast({ title: "Onboarding successful" });
    } catch (error) {
      console.error("Error during onboarding:", error);
      toast({
        variant: "destructive",
        title: "Error during onboarding",
        description: "Error during onboarding. Please try again",
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AuthPageWrapper>
      <Footer position={isMobile ? "top-left" : "bottom-right"} />
      <AdminHeader />
      <main className="absolute bottom-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:right-auto md:w-full xl:w-[940px] flex flex-col items-center self-stretch">
        <div className="flex flex-col items-center justify-center gap-[40px] md:mx-[45px] xl:mx-0 md:gap-[32px] py-[24px] px-[24px] md:p-[40px] rounded-t-[20px] md:rounded-[20px] border-[1px] border-[rgba(255, 255, 255, 0.50)] bg-white">
          <div className="flex flex-col items-center gap-[40px] md:gap-[24px] ">
            <h3 className="w-full md:w-[597px] xl:w-[860px] text-black  text-center text-[32px] md:text-[48px] font-semibold">
              You’re all set!
            </h3>
            <p className="self-stretch text-center text-black  text-[16px] md:text-[24px] font-medium leading-[35px]">
              Start creating personalized research and content for all types of
              clients. Create, get paid, and grow! Nothing can stop you now
            </p>
          </div>
          <button
            onClick={handleLastClick}
            className="flex justify-center items-center h-[44px] w-full md:w-[250px] p-[16px] rounded-full bg-[#1C63DB] text-white"
          >
            Go to my library
          </button>
        </div>
      </main>
    </AuthPageWrapper>
  );
};
