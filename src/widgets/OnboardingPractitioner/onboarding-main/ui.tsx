import { useEffect, useState } from "react";
import { Footer } from "../../Footer";
import { Button, HeaderOnboarding } from "./components";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCoachField } from "../../../entities/store/coachOnboardingSlice";
import { AuthPageWrapper, Input } from "shared/ui";

const buttons = [
  ["Perimenopause & Menopause", "Gut Health", "Thyroid & Autoimmune"],
  [
    "Weight & Metabolic Health",
    "Blood Sugar & Insulin Resistance",
    "Fertility & Hormones",
  ],
  ["Chronic Fatigue / Long COVID", "Anxiety & Sleep", "Mold / Lyme / MCAS"],
  [
    "Inflammation & Pain",
    "Postpartum / Pelvic Floor",
    "Cancer Support",
    "Other",
  ],
];

export const OnboardingMain = () => {
  const [showHint, setShowHint] = useState(false);
  const [otherText, setOtherText] = useState("");
  const [selectedButtons, setSelectedButtons] = useState<string[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    if (selectedButtons.length > 0) {
      setShowHint(true);
    }
  }, [selectedButtons]);

  const dispatch = useDispatch();

  const handleButtonClick = (buttonText: string) => {
    setSelectedButtons((prevSelected) => {
      let updated;
      if (prevSelected.includes(buttonText)) {
        updated = prevSelected.filter((item) => item !== buttonText);
      } else {
        updated = [...prevSelected, buttonText];
      }
      dispatch(updateCoachField({ key: "primary_niches", value: updated }));
      return updated;
    });
  };

  const isOtherSelected = () => {
    return selectedButtons.includes("Other");
  };

  return (
    <AuthPageWrapper>
      <HeaderOnboarding currentStep={1} />
      <main className="flex flex-col items-center flex-1 justify-center gap-[60px] self-stretch">
        <h3 className="font-[Inter] text-[32px] font-medium text-black text-center self-stretch">
          What are your primary focus areas?
        </h3>
        <section className="w-[900px] items-center justify-center flex flex-col gap-[32px]">
          <div className="flex w-[500px] items-start gap-[12px] flex-col">
            <Input
              type="text"
              placeholder="Search"
              className="h-[44px] px-[12px] py-[8px] flex items-center gap-[8px] self-stretch rounded-full border-[1px] border-[#DBDEE1] bg-white flex-1 font-[Nunito] text-[14px] font-semibold text-[#5F5F65]"
            />
          </div>
          <div className="flex gap-[17px] items-center justify-center content-center py-[17px] px-[13px] flex-wrap self-stretch">
            {buttons.map((row, index) => (
              <div key={index} className="flex gap-[13px]">
                {row.map((buttonText) => (
                  <Button
                    key={buttonText}
                    onClick={() => handleButtonClick(buttonText)}
                    style={{
                      background: selectedButtons.includes(buttonText)
                        ? "rgba(0, 143, 246, 0.10)"
                        : "transparent",
                    }}
                  >
                    {buttonText}
                  </Button>
                ))}
              </div>
            ))}
          </div>
          {isOtherSelected() ? (
            <div className="flex justify-center gap-[8px] items-start w-full">
              <Input
                onChange={(e) => {
                  setOtherText(e.target.value);
                  dispatch(
                    updateCoachField({
                      key: "primary_niches",
                      value: [
                        ...selectedButtons.filter((n) => n !== "Other"),
                        e.target.value,
                      ],
                    })
                  );
                }}
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
            onClick={() => nav(-1)}
            className="flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-[#1C63DB]"
            style={{ background: "rgba(0, 143, 246, 0.10)" }}
          >
            Back
          </button>
          <Link
            to={selectedButtons.length > 0 ? "/about-your-practice" : ""}
            className={
              selectedButtons.length >= 1
                ? "bg-[#1C63DB] flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-white"
                : "flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full bg-[#D5DAE2] text-[16px] font-[Nunito] font-semibold text-[#5F5F65]"
            }
          >
            Next
          </Link>
        </div>
      </main>
      <Footer />
    </AuthPageWrapper>
  );
};
