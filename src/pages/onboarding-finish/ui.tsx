import { Footer, Header } from "pages/onboarding-welcome/components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "entities/store";
import { setCredentials, UserService } from "entities/user";
import { clearTempCred } from "entities/store/tempCredSlice";
import { access } from "fs";

export const OnboardingFinish = () => {
    const coachOnboarding = useSelector((state: RootState) => state.coachOnboarding);
    const token = useSelector((state: RootState) => state.user.token);
    const tempCred = useSelector((state: RootState) => state.tempCred);
    const dispatch = useDispatch();
    const nav = useNavigate();

    const handleLastClick = async () => {
  try {
    // Step 1: Log in using saved email/password
    alert(tempCred.email);
    alert(tempCred.password);
    const loginResponse = await UserService.login({
      email: tempCred.email,
      password: tempCred.password,
    });

    if (loginResponse?.accessToken && loginResponse?.user) {
      // Step 2: Save token to Redux
      dispatch(setCredentials({
        user: loginResponse.user,
        accessToken: loginResponse.accessToken,
      }));
      alert(loginResponse.accessToken);

      // Step 3: Onboard the user using the freshly acquired token
      const onboardResponse = await UserService.onboardUser(coachOnboarding, loginResponse.accessToken);

      if (onboardResponse.success) {
        dispatch(clearTempCred()); // Clean up
        nav("/content-manager/published");
      } else {
        console.error("Onboarding failed:", onboardResponse.success);
      }
    } else {
      console.error("Login failed after registration:", loginResponse);
    }
  } catch (error) {
    console.error("Error during login/onboarding:", error);
  }
  };

  return (
    <div
      className="w-full h-screen m-0 p-0"
      style={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), radial-gradient(107.14% 107.09% at 50.55% 99.73%, rgba(248, 251, 255, 0.81) 0%, rgba(222, 236, 255, 0.90) 68.27%, rgba(247, 230, 255, 0.90) 100%), #FFF`,
      }}
    >
      <Header />
      <main className="flex flex-col items-center flex-1 justify-center self-stretch mt-20">
        <div className="flex flex-col items-center justify-center gap-[32px] py-[56px] px-[100px] rounded-[20px] border-[1px] border-[rgba(255, 255, 255, 0.50)] bg-white">
          <div className="flex flex-col items-center gap-[24px]">
            <h3 className="w-[860px] text-black font-[Inter] text-center text-[40px]/[59px] font-semibold">
              You’re all set!
            </h3>
            <p className="self-stretch text-center text-black font-[Nunito] text-[24px] font-medium ">
              We’ve set up your dashboard with tools, templates, and content
              tailored to:<br/> Functional Nutrition + Gut Health & Menopause Support
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
    </div>
  );
};
