import { ArrowRight } from "lucide-react";
import { Footer } from "widgets/Footer";
import { Header } from "widgets/Header";
import ClientWelcomePicture from "shared/assets/images/Illustration.png";
import { useNavigate } from "react-router-dom";
import { AuthPageWrapper } from "shared/ui";

export const WelcomeScreen = () => {
  const nav = useNavigate();
  return (
    <AuthPageWrapper>
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 self-stretch py-[32px]">
        <div className="flex py-[56px] px-[100px] gap-8 flex-col items-center justify-center rounded-t-3xl md:rounded-3xl bg-white">
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
            className="py-4 px-6 flex gap-4 items-center justify-center h-16 rounded-full bg-[#1C63DB] hover:bg-[#2e5aa7] transition"
          >
            <span className="text-center text-white text-2xl font-semibold font-[Nunito]">
              Let’s Begin
            </span>
            <ArrowRight color="#fff" size={32} />
          </button>
        </div>
      </main>
      <Footer />
    </AuthPageWrapper>
  );
};
