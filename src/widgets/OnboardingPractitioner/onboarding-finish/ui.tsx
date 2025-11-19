import { toast } from "shared/lib/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AuthPageWrapper, Button } from "shared/ui";
import { AdminHeader } from "widgets/Header";
import { RootState } from "entities/store";
import { useOnboardUserMutation } from "entities/user";
import { useSelector } from "react-redux";

export const OnboardingFinish = () => {
  const coachOnboarding = useSelector(
    (state: RootState) => state.coachOnboarding
  );
  const nav = useNavigate();
  const [onboardUser] = useOnboardUserMutation();

  const handleLastClick = async () => {
    try {
      await onboardUser({ data: coachOnboarding }).unwrap();
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

  return (
    <AuthPageWrapper>
      <AdminHeader />
      <main className="absolute bottom-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:right-auto md:w-full xl:w-[940px] flex flex-col items-center self-stretch">
        <div className="flex flex-col items-center justify-center gap-[40px] md:mx-[45px] xl:mx-0 md:gap-[32px] py-[24px] px-[24px] md:p-[40px] rounded-t-[20px] md:rounded-[20px] border-[1px] border-[rgba(255, 255, 255, 0.50)] bg-white">
          <div className="flex flex-col items-center gap-[40px] md:gap-[24px] ">
            <h3 className="w-full md:w-[597px] xl:w-[860px] text-black  text-center text-[32px] md:text-[48px] font-semibold">
              You’re all set!
            </h3>
            <p className="self-stretch text-center text-black  text-[16px] md:text-[24px] font-medium leading-[35px]">
              Start creating personalized research and content for all types of
              clients. Create and grow! Nothing can stop you now.
            </p>
          </div>
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            onClick={handleLastClick}
            className="flex justify-center items-center h-[44px] w-full md:w-[250px] p-[16px] rounded-full bg-[#1C63DB] text-white"
          >
            Go to my library
          </Button>
        </div>
      </main>
    </AuthPageWrapper>
  );
};
