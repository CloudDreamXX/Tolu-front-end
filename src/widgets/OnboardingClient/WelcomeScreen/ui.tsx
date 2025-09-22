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
        w-full
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
            <h2 className="text-black text-center text-[24px] md:text-[32px] font-medium">
              Welcome to Tolu, your health companion!
            </h2>
            <p className="text-[#5F5F65] max-w-[916px] text-[16px] md:text-[18px] xl:text-[20px] font-normal  text-center">
              Managing your symptoms while going through a chronic condition,
              such as hormonal shifts or diabetes, or weight gain, requires
              specific personal skills. <br /> Do you know what they are? Let's
              get into it.
            </p>
          </div>

          <button
            onClick={() => nav("/about-you")}
            type="button"
            className="p-4 pl-6 flex gap-2 items-center w-full md:w-auto justify-center rounded-full bg-[#1C63DB] hover:bg-[#2e5aa7] transition"
          >
            <span className="text-[16px] font-medium text-center text-white">
              Start here
            </span>
            <MaterialIcon
              iconName="arrow_right_alt"
              size={20}
              className="text-white"
            />
          </button>
        </div>
        <div className="bg-white md:bg-transparent lg:mt-[37px] w-full flex items-center justify-center gap-[24px] text-[18px] text-[#000] p-[16px] lg:py-0">
          All information you share is secure and confidential
          <img src={"/hipaa.png"} className="h-[50px]" />
          <img src={"/ssl.png"} className="h-[50px]" />
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
