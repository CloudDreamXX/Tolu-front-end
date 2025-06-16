import { useEffect, useState } from "react";
import { Footer } from "../../Footer";
import { Header } from "../../Header";
import { MiddleCard } from "./components";
import { contents } from "./index";
import Lock from "shared/assets/icons/lock";
import Medkit from "shared/assets/icons/medkit";
import PapersLock from "shared/assets/icons/papers-lock";
import Handshake from "shared/assets/icons/handshake";
import Like from "shared/assets/icons/like";
import { useNavigate } from "react-router-dom";
import { AuthPageWrapper } from "shared/ui";

export const OnboardingWelcome = () => {
  const icons = [
    <Lock key={1} />,
    <Medkit key={2} />,
    <PapersLock key={3} />,
    <Handshake key={4} />,
    <Like key={5} />,
  ];
  const nav = useNavigate();
  const [curentWindow, setCurentWindow] = useState(0);
  contents.forEach((content, index) => {
    content.icon = icons[index];
  });
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const addStep = () => {
    setCurentWindow((prev) => prev + 1);

    if (curentWindow === contents.length) {
      nav("/select-type");
    }
  };

  return (
    <AuthPageWrapper>
      <Footer position={isMobile ? "top-left" : undefined} />
      <Header description="COACH ADMIN" />
      <main className="absolute bottom-0 flex flex-col items-center self-stretch md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:right-auto md:w-full">
        {curentWindow === 0 ? (
          <div className="flex flex-col items-center justify-center gap-[40px] shadow-wrapper xl:mx-0 md:gap-[32px] py-[24px] px-[24px] md:py-[40px] md:mx-[40px] md:px-[40px] xl:py-[56px] xl:px-[100px] rounded-t-[20px] md:rounded-[20px] border-[1px] border-[rgba(255, 255, 255, 0.50)] bg-white">
            <div className="flex flex-col items-center gap-[40px] md:gap-[24px] ">
              <h3 className="w-full md:w-[597px] xl:w-[860px] text-black font-inter text-center text-[24px] md:text-[32px] xl:text-[40px]/[59px] font-semibold">
                Welcome to TOLU,
                <br /> your AI-powered assistant for
                <br /> functional and holistic practice.
              </h3>
              <p className="self-stretch text-center text-black font-[Nunito] text-[16px] md:text-[24px] font-medium ">
                Let’s get to know your specialty so we can tailor your dashboard
                and content
              </p>
            </div>
            <button
              onClick={addStep}
              className="flex justify-center items-center h-[56px] w-full md:w-[250px] p-[16px] rounded-full bg-[#1C63DB] text-white"
            >
              Get started
            </button>
          </div>
        ) : (
          <MiddleCard
            title={contents[curentWindow - 1].title}
            description={contents[curentWindow - 1].description}
            icon={
              <span className="w-[100px] h-[100px]">
                {contents[curentWindow - 1].icon}
              </span>
            }
            handleNext={addStep}
          />
        )}
      </main>
    </AuthPageWrapper>
  );
};
