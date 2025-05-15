import { ArrowRight } from "lucide-react";
import { Footer } from "widgets/Footer";
import { Header } from "widgets/Header";
import ClientWelcomePicture from "shared/assets/images/Illustration.png";
import { useNavigate } from "react-router-dom";

export const WelcomeScreen = () => {
  const nav = useNavigate();
  return (
    <div
      className="w-full h-screen m-0 p-0"
      style={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), radial-gradient(107.14% 107.09% at 50.55% 99.73%, rgba(248, 251, 255, 0.81) 0%, rgba(222, 236, 255, 0.90) 68.27%, rgba(247, 230, 255, 0.90) 100%), #FFF`,
      }}
    >
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 self-stretch">
        <div className="flex py-[56px] px-[100px] gap-8 flex-col items-center justify-center rounded-3xl bg-white">
          <img src={ClientWelcomePicture} alt="Welcome to the VitAI! Create and configure your account." />
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-black text-center text-[40px]/[54px] font-bold font-[Nunito]">Welcome to Your Health Companion!</h2>
            <p className="text-[#5F5F65] text-[24px]/[32px] font-normal font-[Nunito] text-center">VITAI is here to support you through your menopause journey — with<br/> personalized tools, guidance, and insights based on who you are and how you<br/> live.</p>
          </div>
          <button onClick={() => nav("/")} className="py-4 px-6 flex gap-4 items-center justify-center h-16 rounded-full bg-[#1C63DB] hover:bg-[#2e5aa7] transition">
            <span className="text-center text-white text-2xl font-semibold font-[Nunito]">Let’s Begin</span>
            <ArrowRight color="#fff" size={32} />
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};
