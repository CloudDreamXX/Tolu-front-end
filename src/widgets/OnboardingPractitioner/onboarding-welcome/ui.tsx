import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const nav = useNavigate();
  const { isMobile } = usePageWidth();
  const [curentWindow, setCurentWindow] = useState(0);
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
      <main className="absolute bottom-0 mt-[40px] xl:mt-[180px] w-full xl:max-w-[1200px] flex flex-col items-center md:px-[40px] xl:px-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:right-auto md:w-full max-h-[65dvh] md:max-h-full">
        {curentWindow === 0 && (
          <div className="flex flex-col items-center justify-center w-full xl:w-[1200px] gap-[40px] shadow-wrapper md:gap-[70px] py-[24px] px-[24px] md:py-[40px] md:px-[40px] xl:py-[56px] xl:px-[100px] rounded-t-[20px] md:rounded-[20px] border-[1px] border-[rgba(255, 255, 255, 0.50)] bg-white">
            <div className="flex flex-col items-center gap-[39px] w-full">
              <div>
                <h3 className="xl:w-[860px] text-black  text-center text-[24px] md:text-[32px] xl:text-[32px]/[59px] font-semibold">
                  Welcome to Tolu!
                </h3>
                <p className="text-black italic text-[24px] max-w-[788px] text-center">
                  Here you can begin, elevate, and grow your holistic practice
                  by relying on your knowledge and professional network
                  expansion.
                </p>
              </div>
              <ul className="flex flex-col text-black text-[18px]">
                <li>• Streamline personalized intaking</li>
                <li>• Build health timelines and matrixes quickly</li>
                <li>
                  • Deliver personalized education that fits each client’s
                  unique journey
                </li>
                <li>
                  • Connect with peers and client to share and gain knowledge
                </li>
              </ul>
              <p className="text-black  text-center text-[20px] italic font-[300]">
                Let’s get to know your specialty so we can tailor your dashboard
                and content
              </p>
            </div>
            <button
              onClick={addStep}
              className="flex justify-center items-center h-[56px] w-full md:w-[250px] p-[16px] rounded-full bg-[#1C63DB] text-white"
            >
              Get Started
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
        <div className="bg-white md:bg-transparent md:mt-[37px] w-full flex items-center justify-center gap-[24px] text-[14px] text-center md:text-[18px] text-[#000] p-[16px]">
          All information you share is secure and confidential
          <img src={"/hipaa.png"} className="h-[40px] md:h-[50px]" />
          <img src={"/ssl.png"} className="h-[40px] md:h-[50px]" />
        </div>
      </main>
    </AuthPageWrapper>
  );
};
