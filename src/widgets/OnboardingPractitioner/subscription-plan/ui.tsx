import { HeaderOnboarding } from "../../HeaderOnboarding";
import { Footer } from "../../Footer";
import { PriceCard } from "./components";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { features } from "./mock";

export const SubscriptionPlan = () => {
  const [activeCard, setActiveCard] = useState<
    "starting" | "professional" | ""
  >("");
  const nav = useNavigate();
  return (
    <div
      className="w-full h-full m-0 p-0"
      style={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), radial-gradient(107.14% 107.09% at 50.55% 99.73%, rgba(248, 251, 255, 0.81) 0%, rgba(222, 236, 255, 0.90) 68.27%, rgba(247, 230, 255, 0.90) 100%), #FFF`,
      }}
    >
      <HeaderOnboarding currentStep={3} />
      <main className="flex flex-col items-center flex-1 justify-center gap-[32px] self-stretch">
        <h3 className="font-[Inter] text-[32px] font-medium text-black text-center self-stretch">
          Choose subscription plan
        </h3>
        <section className="flex gap-[32px] w-[1050px] items-center">
          <PriceCard
            onClick={() => setActiveCard("starting")}
            active={activeCard === "starting"}
            plan="starting"
            price="$00.00"
            features={features}
          />
          <PriceCard
            onClick={() => setActiveCard("professional")}
            active={activeCard === "professional"}
            plan="professional"
            price="$33.99"
            mostPopular
            features={features}
          />
        </section>
        <div className="pb-10 flex items-center gap-[16px]">
          <button
            onClick={() => nav(-1)}
            className="flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-[#1C63DB]"
            style={{ background: "rgba(0, 143, 246, 0.10)" }}
          >
            Back
          </button>
          <Link
            to="/profile-setup"
            className={
              activeCard !== ""
                ? "bg-[#1C63DB] flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-white"
                : "flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full bg-[#D5DAE2] text-[16px] font-[Nunito] font-semibold text-[#5F5F65]"
            }
          >
            Next
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};
