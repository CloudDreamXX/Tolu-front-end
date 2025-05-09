import { useState } from "react";
import { Footer, MiddleCard } from "./components";
import { contents } from "./index";
import Lock from "shared/assets/icons/lock";
import Medkit from "shared/assets/icons/medkit";
import PapersLock from "shared/assets/icons/papers-lock";
import Handshake from "shared/assets/icons/handshake";
import Like from "shared/assets/icons/like";
import { useNavigate } from "react-router-dom";
import { Header } from "./components";

export const OnboardingWerlcome = () => {
  const icons = [
    <Lock key={1}/>,
    <Medkit key={2}/>,
    <PapersLock key={3}/>,
    <Handshake key={4}/>,
    <Like key={5}/>,
  ];
  const nav = useNavigate();
  const [curentWindow, setCurentWindow] = useState(0);
  contents.forEach((content, index) => {
    content.icon = icons[index];
})
  const addStep = () => {
    setCurentWindow((prev) => prev + 1);

    if (curentWindow === contents.length) {
      nav("/onboarding-welcome");
    }
  }

  return (
    <div
      className="w-full h-screen m-0 p-0"
      style={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), radial-gradient(107.14% 107.09% at 50.55% 99.73%, rgba(248, 251, 255, 0.81) 0%, rgba(222, 236, 255, 0.90) 68.27%, rgba(247, 230, 255, 0.90) 100%), #FFF`,
      }}
    >
      <Header/>
      <main className="flex flex-col items-center flex-1 justify-center self-stretch">
        {curentWindow === 0 ? (

            <div className="flex flex-col items-center justify-center gap-[32px] py-[56px] px-[100px] rounded-[20px] border-[1px] border-[rgba(255, 255, 255, 0.50)] bg-white">
          <div className="flex flex-col items-center gap-[24px]">
            <h3 className="w-[860px] text-black font-[Inter] text-center text-[40px]/[59px] font-semibold">
              Welcome to VITAI,<br/> your AI-powered assistant for<br/> functional and
              holistic practice.
            </h3>
            <p className="self-stretch text-center text-black font-[Nunito] text-[24px] font-medium ">
              Let’s get to know your specialty so we can tailor your dashboard
              and content
            </p>
          </div>
          <button onClick={addStep} className="flex justify-center items-center h-[44px] w-[250px] p-[16px] rounded-full bg-[#1C63DB] text-white">Get started</button>
        </div>
        ) : (
            <MiddleCard title={contents[curentWindow -1].title} description={contents[curentWindow -1].description} icon={contents[curentWindow -1].icon} handleNext={addStep}/>
        )}
      </main>
        <Footer />
    </div>
  );
};
