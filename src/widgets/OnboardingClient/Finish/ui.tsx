import { AuthPageWrapper } from "shared/ui";
import { Footer } from "widgets/Footer";
import Img1 from "shared/assets/images/card1.png";
import Img2 from "shared/assets/images/card2.png";
import Img3 from "shared/assets/images/card3.png";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "shared/lib/hooks/use-toast";
import { usePageWidth } from "shared/lib";
import { ClientHeader } from "widgets/Header";
// import { useSelector } from "react-redux";
// import { RootState } from "entities/store";
// import { UserService } from "entities/user";

export const FinishClientOnboarding = () => {
  // const token = useSelector((state: RootState) => state.user.token);
  // const client = useSelector((state: RootState) => state.clientOnboarding);
  const nav = useNavigate();
  const { isMobileOrTablet } = usePageWidth();

  useEffect(() => {
    const handleLast = async () => {
      try {
        // const message = await UserService.onboardClient(client, token);
        toast({
          title: "Onboarding successful",
        });
      } catch (error) {
        console.error("Error during onboarding:", error);
        toast({
          variant: "destructive",
          title: "Error during onboarding",
          description: "Error during onboarding. Please try again",
        });
      }
    };
    handleLast();
    const timer = setTimeout(() => {
      nav("/library");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthPageWrapper>
      <ClientHeader />
      <main className="flex flex-col items-center justify-center self-stretch h-[calc(100vh-98px)] md:h-[calc(100vh-171px)] lg:h-[calc(100vh-141px)]">
        <div className="flex flex-col items-center justify-center gap-8 px-4 bg-white rounded-t-3xl md:rounded-3xl pt-[56px] pb-6 lg:px-[100px] md:py-[40px] mt-auto max-w-[1000px] lg:m-auto">
          <div className="flex items-center justify-center w-full gap-4 md:gap-10 ">
            <img
              src={Img2}
              alt="card template2"
              className="w-auto max-w-[30%] object-contain "
            />
            <img
              src={Img1}
              alt="card template1"
              className="w-auto max-w-[30%] object-contain "
            />
            <img
              src={Img3}
              alt="card template3"
              className="w-auto max-w-[30%] object-contain"
            />
          </div>
          <div className="flex flex-col items-center gap-6">
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
      <Footer position={isMobileOrTablet ? "top-right" : "bottom-right"} />
    </AuthPageWrapper>
  );
};
