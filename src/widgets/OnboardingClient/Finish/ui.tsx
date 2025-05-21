import { AuthPageWrapper } from "shared/ui";
import { Footer } from "widgets/Footer";
import { Header } from "widgets/Header";
import Img1 from "shared/assets/images/card1.png";
import Img2 from "shared/assets/images/card2.png";
import Img3 from "shared/assets/images/card3.png";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { RootState } from "entities/store";
// import { UserService } from "entities/user";

export const FinishClientOnboarding = () => {
  // const token = useSelector((state: RootState) => state.user.token);
  // const client = useSelector((state: RootState) => state.clientOnboarding);
  const nav = useNavigate();
  useEffect(() => {
    const handleLast = async () => {
      try {
        // const message = await UserService.onboardClient(client, token);
      } catch (error) {
        console.error("Error during onboarding:", error);
      }
    };
    handleLast();
    const timer = setTimeout(() => {
      nav("/health-snapshot");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <AuthPageWrapper>
      <Header />
      <main className="flex flex-col items-center gap-8 justify-center self-stretch">
        <div className="w-full max-w-[1060px] py-[56px] px-[100px] rounded-2xl bg-white flex flex-col gap-6 items-start justify-center">
          <div className="flex gap-10 items-center justify-center">
            <img src={Img2} alt="card template" />
            <img src={Img1} alt="card template" />
            <img src={Img3} alt="card template" />
          </div>
          <div className="flex flex-col gap-6 items-center">
            <h1 className="font-[Nunito] text-center font-bold text-[40px] text-[#1D1D1F]">
              You’re all set!
            </h1>
            <h3 className="font-[Nunito] text-center text-[#5F5F65] text-[24px] font-normal">
              Your personalized journey has begun. Your dashboard is ready with
              tailored tools and insights just for you. Let’s take the next step
              together!
            </h3>
          </div>
        </div>
      </main>
      <Footer />
    </AuthPageWrapper>
  );
};
