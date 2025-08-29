import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Handshake from "shared/assets/icons/handshake";
import Like from "shared/assets/icons/like";
import Lock from "shared/assets/icons/lock";
import Medkit from "shared/assets/icons/medkit";
import PapersLock from "shared/assets/icons/papers-lock";
import { usePageWidth } from "shared/lib";
import { AuthPageWrapper } from "shared/ui";
import { AdminHeader } from "widgets/Header";
import { Footer } from "../../Footer";
import { contents } from "./index";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { IndependentContractorAgreement } from "./components/IndependentContractorAgreement";
import { ContentLicensing } from "./components/ContentLicensing";
import { AffiliatePromoter } from "./components/AffiliatePromoter";
import { DataProtection } from "./components/DataProtection";
import { MediaTestimonial } from "./components/MediaTestimonial";

export const OnboardingWelcome = () => {
  const icons = [
    <Lock key={1} />,
    <Medkit key={2} />,
    <PapersLock key={3} />,
    <Handshake key={4} />,
    <Like key={5} />,
  ];
  const nav = useNavigate();
  const { isMobile } = usePageWidth();
  const [curentWindow, setCurentWindow] = useState(0);
  contents.forEach((content, index) => {
    content.icon = icons[index];
  });
  const [checkedStates, setCheckedStates] = useState<boolean[]>(
    new Array(contents.length).fill(false)
  );

  const addStep = () => {
    setCurentWindow((prev) => prev + 1);

    if (curentWindow === contents.length) {
      nav("/select-type");
    }
  };

  return (
    <AuthPageWrapper>
      <Footer position={isMobile ? "top-left" : undefined} />
      <AdminHeader />
      <main className="absolute bottom-0 flex flex-col items-center self-stretch md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:right-auto md:w-full">
        {curentWindow === 0 && (
          <div className="flex flex-col items-center justify-center gap-[40px] shadow-wrapper xl:mx-0 md:gap-[32px] py-[24px] px-[24px] md:py-[40px] md:mx-[40px] md:px-[40px] xl:py-[56px] xl:px-[100px] rounded-t-[20px] md:rounded-[20px] border-[1px] border-[rgba(255, 255, 255, 0.50)] bg-white">
            <div className="flex flex-col items-center gap-[40px] md:gap-[24px] ">
              <h3 className="w-full md:w-[597px] xl:w-[860px] text-black font-inter text-center text-[24px] md:text-[32px] xl:text-[40px]/[59px] font-semibold">
                Welcome to Tolu,
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
        )}
        {curentWindow === 1 && (
          <PrivacyPolicy
            isChecked={checkedStates[0]}
            setIsChecked={(value) => {
              const updated = [...checkedStates];
              updated[0] = value;
              setCheckedStates(updated);
            }}
            handleNext={addStep}
          />
        )}
        {curentWindow === 2 && (
          <IndependentContractorAgreement
            isChecked={checkedStates[1]}
            setIsChecked={(value) => {
              const updated = [...checkedStates];
              updated[1] = value;
              setCheckedStates(updated);
            }}
            handleNext={addStep}
          />
        )}
        {curentWindow === 3 && (
          <ContentLicensing
            isChecked={checkedStates[2]}
            setIsChecked={(value) => {
              const updated = [...checkedStates];
              updated[2] = value;
              setCheckedStates(updated);
            }}
            handleNext={addStep}
          />
        )}
        {curentWindow === 4 && (
          <AffiliatePromoter
            isChecked={checkedStates[3]}
            setIsChecked={(value) => {
              const updated = [...checkedStates];
              updated[3] = value;
              setCheckedStates(updated);
            }}
            handleNext={addStep}
          />
        )}
        {curentWindow === 5 && (
          <DataProtection
            isChecked={checkedStates[4]}
            setIsChecked={(value) => {
              const updated = [...checkedStates];
              updated[4] = value;
              setCheckedStates(updated);
            }}
            handleNext={addStep}
          />
        )}
        {curentWindow === 6 && (
          <MediaTestimonial
            isChecked={checkedStates[5]}
            setIsChecked={(value) => {
              const updated = [...checkedStates];
              updated[5] = value;
              setCheckedStates(updated);
            }}
            handleNext={addStep}
          />
        )}
      </main>
    </AuthPageWrapper>
  );
};
