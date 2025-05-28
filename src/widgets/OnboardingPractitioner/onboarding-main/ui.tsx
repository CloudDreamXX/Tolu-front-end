import { useEffect, useState } from "react";
import { Footer } from "../../Footer";
import { Button, HeaderOnboarding } from "./components";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCoachField } from "../../../entities/store/coachOnboardingSlice";
import { AuthPageWrapper, Input } from "shared/ui";
import Search from "shared/assets/icons/search";
import LightIcon from "shared/assets/icons/light";
import { buttons } from "./mock";
import { cn } from "shared/lib";

export const OnboardingMain = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setShowHint] = useState(false);
  const [customButtons, setCustomButtons] = useState(buttons);
  const [otherText, setOtherText] = useState("");
  const [isClosedHint, setIsClosedHint] = useState(false);
  const [selectedButtons, setSelectedButtons] = useState<string[]>([]);
  const nav = useNavigate();

  const handleOther = () => {
    if (!otherText.trim()) return;

    setSelectedButtons((prevSelected) =>
      prevSelected.filter((n) => n !== "Other").concat(otherText)
    );

    setCustomButtons((prev) => {
      const copy = [...prev];
      const lastRow = copy[copy.length - 1];

      if (lastRow.length >= 3) {
        return [...copy, [otherText]];
      } else {
        lastRow.push(otherText);
        return copy;
      }
    });

    setOtherText("");
  };

  useEffect(() => {
    if (selectedButtons.length > 0) {
      setShowHint(true);
    }
  }, [selectedButtons]);

  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleButtonClick = (buttonText: string, id: number = 0) => {
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

  const handleHintButtonClick = () => {
    setIsClosedHint(true);
  };

  const isNextDisabled =
    selectedButtons.length === 0 ||
    (selectedButtons.includes("Other") && otherText.trim() === "");

  const isShowHint = !isNextDisabled && !isClosedHint;

  return (
    <AuthPageWrapper>
      <HeaderOnboarding currentStep={1} />
      <main className="flex flex-col items-center flex-1 justify-center gap-[60px] self-stretch">
        <h3 className="font-inter text-[32px] font-medium text-black text-center self-stretch">
          What are your primary focus areas?
        </h3>
        <section className="w-[900px] items-center justify-center flex flex-col gap-[32px]">
          <div className="flex w-[500px] items-start gap-[12px] flex-col">
            <Input
              variant="none"
              type="text"
              icon={<Search className="ml-2" />}
              placeholder="Search"
              className="h-[44px] py-[8px] flex items-center gap-[8px] self-stretch rounded-full border-[1px] border-[#DBDEE1] bg-white flex-1 font-[Nunito] text-[14px] font-semibold text-[#5F5F65]"
            />
          </div>
          <div className="flex gap-[17px] items-center justify-center content-center py-[17px] px-[13px] flex-wrap self-stretch">
            {customButtons.map((row, index) => (
              <div key={index} className="flex gap-[13px]">
                {row.map((buttonText) => (
                  <Button
                    key={buttonText}
                    selected={selectedButtons.includes(buttonText)}
                    onClick={() => handleButtonClick(buttonText)}
                  >
                    {buttonText}
                  </Button>
                ))}
              </div>
            ))}
          </div>
          {isOtherSelected() ? (
            <div className="w-[300px] flex justify-center gap-[8px] items-center">
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
                className="flex outline-none w-[300px] h-[44px] py-[11px] px-[16px] justify-center items-center self-stretch text-[#5F5F65] font-[Bubito] text-[16px] font-medium rounded-[8px] border-[1px] border-[#DFDFDF] bg-white focus:border-[#1C63DB] focus:outline-none"
              />
              {otherText.length > 0 && (
                <button
                  onClick={handleOther}
                  className="text-nowrap flex rounded-full bg-[#1C63DB] h-[44px] p-[16px] items-center font-[Nunito] text-[16px] font-semibold text-white w-auto"
                >
                  Add niche
                </button>
              )}
            </div>
          ) : (
            ""
          )}
        </section>
        <div className="flex items-center gap-[16px] relative">
          <button
            onClick={() => nav(-1)}
            className="flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-[#1C63DB]"
            style={{ background: "rgba(0, 143, 246, 0.10)" }}
          >
            Back
          </button>
          <Link
            to={!isNextDisabled ? "/about-your-practice" : ""}
            className={
              !isNextDisabled
                ? "bg-[#1C63DB] flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-white"
                : "flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full bg-[#D5DAE2] text-[16px] font-[Nunito] font-semibold text-[#5F5F65] cursor-not-allowed"
            }
            tabIndex={isNextDisabled ? -1 : 0}
            aria-disabled={isNextDisabled}
          >
            Next
          </Link>
          {isShowHint && (
            <div
              className={cn(
                "absolute top-full left-10 right-0 mx-auto translate-y-[1.625rem] rounded-[0.625rem] p-4 bg-white border border-blue-500 font-semibold max-w-[19.375rem] w-full flex flex-col gap-3",
                "animate-in fade-in"
              )}
            >
              <div className="absolute bottom-full right-14 w-5 h-5 bg-white border border-blue-500 rotate-45 translate-y-1/2 translate-x-1/2 border-b-transparent border-r-transparent"></div>
              <h3 className="flex gap-2 text-[#1B2559] leading-[1.4]">
                <span className="w-6 h-6 shrink-0 ">
                  <LightIcon className="text-[#1B2559] " />
                </span>
                You can update your focus areas anytime from your dashboard.
              </h3>
              <button
                className="bg-[#1C63DB] inline-flex py-1 px-4 justify-center items-center gap-2 rounded-full font-[Nunito] font-semibold text-white self-center"
                onClick={handleHintButtonClick}
              >
                Got It
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </AuthPageWrapper>
  );
};
