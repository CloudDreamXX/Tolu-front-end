import { Footer } from "../../Footer";
import { Header } from "../../Header";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "entities/store";
import { UserService } from "entities/user";
import { AuthPageWrapper } from "shared/ui";

export const OnboardingFinish = () => {
  const coachOnboarding = useSelector(
    (state: RootState) => state.coachOnboarding
  );
  const token = useSelector((state: RootState) => state.user.token);
  const nav = useNavigate();

  const handleLastClick = async () => {
    try {
      const message = await UserService.onboardUser(coachOnboarding, token);
      nav("/content-manager/published");
    } catch (error) {
      console.error("Error during onboarding:", error);
    }
  };
  return (
    <AuthPageWrapper>
      <Header />
      <main className="flex flex-col items-center flex-1 justify-center self-stretch mt-20">
        <div className="flex flex-col items-center justify-center gap-[32px] py-[56px] px-[100px] rounded-[20px] border-[1px] border-[rgba(255, 255, 255, 0.50)] bg-white">
          <div className="flex flex-col items-center gap-[24px]">
            <h3 className="w-[860px] text-black font-inter text-center text-[40px]/[59px] font-semibold">
              You’re all set!
            </h3>
            <p className="self-stretch text-center text-black font-[Nunito] text-[24px] font-medium ">
              We’ve set up your dashboard with tools, templates, and content
              tailored to:
              <br /> Functional Nutrition + Gut Health & Menopause Support
            </p>
          </div>
          <button
            onClick={handleLastClick}
            className="flex justify-center items-center h-[44px] w-[250px] p-[16px] rounded-full bg-[#1C63DB] text-white"
          >
            Go to My Dashboard
          </button>
        </div>
      </main>
      <Footer />
    </AuthPageWrapper>
  );
};
