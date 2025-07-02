import { useState } from "react";
import { Footer } from "pages/onboarding-welcome/components";
import { Button, HeaderOnboarding } from "./components";

export const OnboardingMain = () => {
  const [otherText, setOtherText] = useState("");
  const [selectedButtons, setSelectedButtons] = useState<string[]>([]);

  const handleButtonClick = (buttonText: string) => {
    setSelectedButtons((prevSelected) => {
      if (prevSelected.includes(buttonText)) {
        return prevSelected.filter((item) => item !== buttonText);
      } else {
        return [...prevSelected, buttonText];
      }
    });
  };

  const isOtherSelected = () => {
    return selectedButtons.includes("Other");
  };

  return (
    <div
      className="w-full h-screen p-0 m-0"
      style={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), radial-gradient(107.14% 107.09% at 50.55% 99.73%, rgba(248, 251, 255, 0.81) 0%, rgba(222, 236, 255, 0.90) 68.27%, rgba(247, 230, 255, 0.90) 100%), #FFF`,
      }}
    >
      <HeaderOnboarding />
      <main className="flex flex-col items-center flex-1 justify-center gap-[60px] self-stretch">
        <h3 className="font-inter text-[32px] font-medium text-black text-center self-stretch">
          What are your primary focus areas?
        </h3>
        <section className="w-[900px] items-center justify-center flex flex-col gap-[32px]">
          <div className="flex w-[500px] items-start gap-[12px] flex-col">
            <input
              type="text"
              placeholder="Search"
              className="h-[44px] px-[12px] py-[8px] flex items-center gap-[8px] self-stretch rounded-full border-[1px] border-[#DBDEE1] bg-white flex-1 font-[Nunito] text-[14px] font-semibold text-[#5F5F65]"
            />
          </div>
          <div className="flex gap-[17px] items-center justify-center content-center py-[17px] px-[13px] flex-wrap self-stretch">
            <div className="flex gap-[13px]">
              <Button
                onClick={() => handleButtonClick("Perimenopause & Menopause")}
                style={{
                  background: selectedButtons.includes(
                    "Perimenopause & Menopause"
                  )
                    ? "rgba(0, 143, 246, 0.10)"
                    : "transparent",
                }}
              >
                Perimenopause & Menopause
              </Button>
              <Button
                onClick={() => handleButtonClick("Gut Health")}
                style={{
                  background: selectedButtons.includes("Gut Health")
                    ? "rgba(0, 143, 246, 0.10)"
                    : "transparent",
                }}
              >
                Gut Health
              </Button>
              <Button
                onClick={() => handleButtonClick("Thyroid & Autoimmune")}
                style={{
                  background: selectedButtons.includes("Thyroid & Autoimmune")
                    ? "rgba(0, 143, 246, 0.10)"
                    : "transparent",
                }}
              >
                Thyroid & Autoimmune
              </Button>
            </div>
            <div className="flex gap-[13px]">
              <Button
                onClick={() => handleButtonClick("Weight & Metabolic Health")}
                style={{
                  background: selectedButtons.includes(
                    "Weight & Metabolic Health"
                  )
                    ? "rgba(0, 143, 246, 0.10)"
                    : "transparent",
                }}
              >
                Weight & Metabolic Health
              </Button>
              <Button
                onClick={() =>
                  handleButtonClick("Blood Sugar & Insulin Resistance")
                }
                style={{
                  background: selectedButtons.includes(
                    "Blood Sugar & Insulin Resistance"
                  )
                    ? "rgba(0, 143, 246, 0.10)"
                    : "transparent",
                }}
              >
                Blood Sugar & Insulin Resistance
              </Button>
              <Button
                onClick={() => handleButtonClick("Fertility & Hormones")}
                style={{
                  background: selectedButtons.includes("Fertility & Hormones")
                    ? "rgba(0, 143, 246, 0.10)"
                    : "transparent",
                }}
              >
                Fertility & Hormones
              </Button>
            </div>
            <div className="flex gap-[13px]">
              <Button
                onClick={() =>
                  handleButtonClick("Chronic Fatigue / Long COVID")
                }
                style={{
                  background: selectedButtons.includes(
                    "Chronic Fatigue / Long COVID"
                  )
                    ? "rgba(0, 143, 246, 0.10)"
                    : "transparent",
                }}
              >
                Chronic Fatigue / Long COVID
              </Button>
              <Button
                onClick={() => handleButtonClick("Anxiety & Sleep")}
                style={{
                  background: selectedButtons.includes("Anxiety & Sleep")
                    ? "rgba(0, 143, 246, 0.10)"
                    : "transparent",
                }}
              >
                Anxiety & Sleep
              </Button>
              <Button
                onClick={() => handleButtonClick("Mold / Lyme / MCAS")}
                style={{
                  background: selectedButtons.includes("Mold / Lyme / MCAS")
                    ? "rgba(0, 143, 246, 0.10)"
                    : "transparent",
                }}
              >
                Mold / Lyme / MCAS
              </Button>
            </div>
            <div className="flex gap-[13px]">
              <Button
                onClick={() => handleButtonClick("Inflammation & Pain")}
                style={{
                  background: selectedButtons.includes("Inflammation & Pain")
                    ? "rgba(0, 143, 246, 0.10)"
                    : "transparent",
                }}
              >
                Inflammation & Pain
              </Button>
              <Button
                onClick={() => handleButtonClick("Postpartum / Pelvic Floor")}
                style={{
                  background: selectedButtons.includes(
                    "Postpartum / Pelvic Floor"
                  )
                    ? "rgba(0, 143, 246, 0.10)"
                    : "transparent",
                }}
              >
                Postpartum / Pelvic Floor
              </Button>
              <Button
                onClick={() => handleButtonClick("Cancer Support")}
                style={{
                  background: selectedButtons.includes("Cancer Support")
                    ? "rgba(0, 143, 246, 0.10)"
                    : "transparent",
                }}
              >
                Cancer Support
              </Button>
              <Button
                onClick={() => handleButtonClick("Other")}
                style={{
                  background: selectedButtons.includes("Other")
                    ? "rgba(0, 143, 246, 0.10)"
                    : "transparent",
                }}
              >
                Other
              </Button>
            </div>
          </div>
          {isOtherSelected() ? (
            <div className="flex justify-center gap-[8px] items-start">
              <input
                onChange={(e) => setOtherText(e.target.value)}
                type="text"
                placeholder="Please specify your niche"
                className="flex outline-none w-[300px] h-[44px] py-[11px] px-[16px] justify-center items-center self-stretch text-[#5F5F65] font-[Bubito] text-[16px] font-medium rounded-[8px] border-[1px] border-[#DFDFDF] bg-white"
              />
              {otherText.length > 0 && (
                <button className="flex rounded-full bg-[#1C63DB] h-[44px] p-[16px] items-center font-[Nunito] text-[16px] font-semibold text-white">
                  Add niche
                </button>
              )}
            </div>
          ) : (
            ""
          )}
        </section>
        <div className="flex items-center gap-[16px]">
          <button
            className="flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-[#1C63DB]"
            style={{ background: "rgba(0, 143, 246, 0.10)" }}
          >
            Back
          </button>
          <button
            className={
              selectedButtons.length >= 1
                ? "bg-[#1C63DB] flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-white"
                : "flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full bg-[#D5DAE2] text-[16px] font-[Nunito] font-semibold text-[#5F5F65]"
            }
          >
            Next
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};
