import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePageWidth } from "shared/lib";
import { AuthPageWrapper } from "shared/ui";
import { Footer } from "../../Footer";
import { HeaderOnboarding } from "../../HeaderOnboarding";
import { PriceCard } from "./components";

export const SubscriptionPlan = () => {
  const [activeCard, setActiveCard] = useState<
    "starting" | "professional" | ""
  >("");
  const nav = useNavigate();
  const { isMobile } = usePageWidth();

  return (
    <AuthPageWrapper>
      <HeaderOnboarding currentStep={3} />
      <main className="flex flex-col items-center flex-1 justify-center gap-[32px] self-stretch px-[16px] md:p-0">
        <h3 className="font-inter text-[24px] md:text-[32px] font-medium text-black text-center self-stretch">
          Choose subscription plan
        </h3>
        <section className="flex flex-col md:flex-row gap-[32px] w-full xl:w-[1150px] items-center justify-center md:px-[24px]">
          <PriceCard
            onClick={() => setActiveCard("starting")}
            active={activeCard === "starting"}
            plan="starting"
            price="$0.00"
          />
          <PriceCard
            onClick={() => setActiveCard("professional")}
            active={activeCard === "professional"}
            plan="professional"
            price="$39.00"
            mostPopular
          />
        </section>
        <div className="flex items-center gap-[16px] pb-8 md:pb-[100px] w-full md:w-fit">
          <button
            onClick={() => nav(-1)}
            className="flex w-full md:w-[250px] md:h-[44px] p-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-[#1C63DB]"
            style={{ background: "rgba(0, 143, 246, 0.10)" }}
          >
            Back
          </button>
          <Link
            to="/profile-setup"
            className={
              activeCard !== ""
                ? "bg-[#1C63DB] flex w-full md:w-[250px] md:h-[44px] p-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-white"
                : "flex w-full md:w-[250px] md:h-[44px] p-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full bg-[#D5DAE2] text-[16px] font-[Nunito] font-semibold text-[#5F5F65]"
            }
          >
            Next
          </Link>
        </div>
      </main>
      <Footer position={isMobile ? "top-right" : "bottom-right"} />
    </AuthPageWrapper>
  );
};
