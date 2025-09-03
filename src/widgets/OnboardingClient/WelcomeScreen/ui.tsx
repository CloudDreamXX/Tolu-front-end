import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ClientWelcomePicture from "shared/assets/images/Illustration.png";
import { AuthPageWrapper } from "shared/ui";
import { ClientHeader } from "widgets/Header";
import { ConfirmCancelModal } from "widgets/ConfirmCancelModal";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

export const WelcomeScreen = () => {
  const nav = useNavigate();
  const [isTallScreen, setIsTallScreen] = useState(false);
  const [IsCancelOpen, setIsCancelOpen] = useState<boolean>(false);
  const location = useLocation();
  const inviteSource = location.state?.inviteSource ?? "";

  useEffect(() => {
    if (inviteSource === "referral") {
      nav("/library");
    }
  }, [inviteSource]);

  useEffect(() => {
    const checkHeight = () => {
      setIsTallScreen(window.innerHeight > 1000);
    };

    checkHeight(); // Check on mount

    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, []);

  return (
    <AuthPageWrapper>
      <ClientHeader />
      <main
        className="
        flex flex-col items-center justify-end lg:justify-center
        w-full gap-[16px] md:gap-[8px]
        lg:fixed lg:top-[50%] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%] h-full
        mt-[100px] lg:mt-0
        absolute bottom-0
      "
      >
        <div
          className={`
            flex flex-col items-center justify-center gap-8 rounded-t-3xl bg-white 
            py-[24px] px-[16px] md:px-[40px] xl:p-8 md:rounded-3xl w-full xl:w-fit xl:mt-[20px]
            ${isTallScreen ? "md:py-[121px]" : ""}
          `}
        >
          <img
            src={ClientWelcomePicture}
            alt="Welcome to the Tolu! Create and configure your account."
            className="w-[350px]"
          />
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-black text-center text-[24px] md:text-[32px] xl:text-[40px]/[54px] font-bold font-[Nunito]">
              Welcome to A Healthy Menopause
              <br /> Transformation
            </h2>
            <p className="text-[#5F5F65] text-[16px] md:text-[18px] xl:text-[24px]/[32px] font-normal font-[Nunito] text-center">
              Tolu supports you through your menopause journey with personalized
              tools,
              <br /> guidance, and insights based on who you are and how you
              live your life.
            </p>
          </div>
          <div className="flex flex-col-reverse md:flex-row gap-[16px] justify-between items-center w-full">
            <button
              className={`flex p-4 h-[44px] items-center justify-center text-base font-semibold text-[#1C63DB]`}
              onClick={() => setIsCancelOpen(true)}
            >
              Skip onboarding
            </button>
            <button
              onClick={() => nav("/about-you")}
              type="button"
              className="py-4 px-6 flex gap-4 items-center w-full md:w-auto justify-center h-16 rounded-full bg-[#1C63DB] hover:bg-[#2e5aa7] transition"
            >
              <span className="text-center text-white text-2xl font-semibold font-[Nunito]">
                Let’s Begin
              </span>
              <MaterialIcon iconName="arrow_right_alt" className="text-white" />
            </button>
          </div>
        </div>
      </main>
      {IsCancelOpen && (
        <ConfirmCancelModal
          title={"Are you sure you want to skip this form?"}
          description={
            "This helps us tailor your journey and ensure the right support — nothing is ever shared without your permission."
          }
          backTitle={"Skip this for now"}
          continueTitle={"Continue filling out"}
          onCancel={() => nav("/library")}
          onDiscard={() => setIsCancelOpen(false)}
          onClose={() => setIsCancelOpen(false)}
        />
      )}
    </AuthPageWrapper>
  );
};
