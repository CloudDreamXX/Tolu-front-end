import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClientWelcomePicture from "shared/assets/images/Illustration.png";
import { usePageWidth } from "shared/lib";
import { AuthPageWrapper } from "shared/ui";
import { Footer } from "widgets/Footer";
import { ClientHeader } from "widgets/Header";

export const WelcomeScreen = () => {
  const nav = useNavigate();
  const { isMobileOrTablet } = usePageWidth();

  return (
    <AuthPageWrapper>
      <ClientHeader />
      <main className="flex flex-col items-center justify-center flex-1 self-stretch py-[28px] pb-0 md:pb-[28px]">
        <div className="flex flex-col  items-center justify-center gap-8 rounded-t-3xl bg-white py-[24px] px-[16px] md:p-10 md:rounded-3xl">
          <img
            src={ClientWelcomePicture}
            alt="Welcome to the TOLU! Create and configure your account."
          />
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-black text-center text-[40px]/[54px] font-bold font-[Nunito]">
              Welcome to A Healthy Menopause
              <br /> Transformation
            </h2>
            <p className="text-[#5F5F65] text-[24px]/[32px] font-normal font-[Nunito] text-center">
              TOLU supports you through your menopause journey with personalized
              tools,
              <br /> guidance, and insights based on who you are and how you
              live your life.
            </p>
          </div>
          <button
            onClick={() => nav("/about-you")}
            type="button"
            className="py-4 px-6 flex gap-4 items-center w-full md:w-auto justify-center h-16 rounded-full bg-[#1C63DB] hover:bg-[#2e5aa7] transition"
          >
            <span className="text-center text-white text-2xl font-semibold font-[Nunito]">
              Let’s Begin
            </span>
            <ArrowRight color="#fff" size={32} />
          </button>
        </div>
      </main>
      <Footer position={isMobileOrTablet ? "top-right" : "bottom-right"} />
    </AuthPageWrapper>
  );
};
