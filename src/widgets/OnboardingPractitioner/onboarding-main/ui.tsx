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
  const [customButtons, setCustomButtons] = useState(buttons);
  const [otherText, setOtherText] = useState("");
  const [isClosedHint, setIsClosedHint] = useState(false);
  const [selectedButtons, setSelectedButtons] = useState<string[]>([]);
  const nav = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchText, setSearchText] = useState("");
  const [isNextHovered, setIsNextHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const dispatch = useDispatch();

  const handleButtonClick = (buttonText: string) => {
    setSelectedButtons((prevSelected) => {
      const isSelected = prevSelected.includes(buttonText);

      if (isSelected) {
        const updated = prevSelected.filter((item) => item !== buttonText);
        dispatch(updateCoachField({ key: "primary_niches", value: updated }));
        return updated;
      }

      if (prevSelected.length >= 5) return prevSelected;

      const updated = [...prevSelected, buttonText];
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

  const shouldStickToBottom = isMobile && isOtherSelected();
  const isShowHint = isNextHovered && !isNextDisabled && !isClosedHint;

  const filteredButtons = customButtons.map((row) =>
    row.filter((btn) => btn.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <AuthPageWrapper>
      <Footer position={isMobile ? "top-right" : undefined} />
      <HeaderOnboarding currentStep={1} />
      <main
        className={`flex flex-col items-center flex-1 justify-center gap-[32px] md:gap-[60px] self-stretch bg-white py-[24px] px-[16px] md:p-0 rounded-t-[20px] md:rounded-0
    ${shouldStickToBottom ? "absolute bottom-0 left-0 w-full z-10" : "relative"} 
    ${isMobile ? "shadow-md" : ""} md:bg-transparent`}
      >
        <h3 className="font-inter text-[24px] md:text-[32px] font-medium text-black text-center self-stretch">
          What are your primary focus areas?
        </h3>
        <section className="w-full lg:w-[900px] items-center justify-center flex flex-col gap-[32px]">
          <div className="flex w-full md:w-[500px] items-start gap-[12px] flex-col">
            <Input
              variant="none"
              type="text"
              icon={<Search className="ml-2" />}
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="h-[44px] py-[8px] flex items-center gap-[8px] self-stretch rounded-full border-[1px] border-[#DBDEE1] bg-white flex-1 font-[Nunito] text-[14px] font-semibold text-[#5F5F65]"
            />
          </div>
          {isMobile ? (
            <div className="flex flex-wrap gap-[13px] justify-center self-stretch">
              {(isOtherSelected() ? ["Other"] : filteredButtons.flat()).map(
                (buttonText) => {
                  const isSelected = selectedButtons.includes(buttonText);
                  const isDisabled = !isSelected && selectedButtons.length >= 5;

                  return (
                    <Button
                      key={buttonText}
                      selected={isSelected}
                      onClick={() => handleButtonClick(buttonText)}
                      disabled={isDisabled}
                    >
                      {buttonText}
                    </Button>
                  );
                }
              )}
            </div>
          ) : (
            <div className="flex gap-[17px] items-center justify-center content-center py-[17px] px-[13px] flex-wrap self-stretch">
              {filteredButtons
                .filter((row) => row.length > 0)
                .map((filteredRow, index) => (
                  <div key={index} className="flex gap-[13px]">
                    {filteredRow.map((buttonText) => {
                      const isSelected = selectedButtons.includes(buttonText);
                      const isDisabled =
                        !isSelected && selectedButtons.length >= 5;

                      return (
                        <Button
                          key={buttonText}
                          selected={isSelected}
                          onClick={() => handleButtonClick(buttonText)}
                          disabled={isDisabled}
                        >
                          {buttonText}
                        </Button>
                      );
                    })}
                  </div>
                ))}
            </div>
          )}

          {isOtherSelected() ? (
            <div
              className={`w-full ${otherText.length > 0 ? "md:w-[414px]" : "md:w-[300px]"} flex justify-center items-center gap-[8px]`}
            >
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
                  className="text-nowrap flex rounded-full bg-[#1C63DB] h-[44px] w-[120px] p-[16px] items-center font-[Nunito] text-[16px] font-semibold text-white w-auto"
                >
                  Add niche
                </button>
              )}
            </div>
          ) : (
            ""
          )}
        </section>
        <div className="flex items-center gap-[8px] md:gap-[16px] w-full md:w-fit md:pb-[140px]">
          <button
            onClick={() => nav(-1)}
            className="flex w-full md:w-[250px] md:h-[44px] py-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-[#1C63DB]"
            style={{ background: "rgba(0, 143, 246, 0.10)" }}
          >
            Back
          </button>
          <Link
            to={!isNextDisabled ? "/about-your-practice" : ""}
            className={
              !isNextDisabled
                ? "bg-[#1C63DB] flex w-full md:w-[250px] md:h-[44px] py-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-white"
                : "flex w-full md:w-[250px] md:h-[44px] py-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full bg-[#D5DAE2] text-[16px] font-[Nunito] font-semibold text-[#5F5F65] cursor-not-allowed"
            }
            tabIndex={isNextDisabled ? -1 : 0}
            aria-disabled={isNextDisabled}
            onMouseEnter={() => !isNextDisabled && setIsNextHovered(true)}
            onMouseLeave={() => setIsNextHovered(false)}
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
              <div className="absolute w-5 h-5 rotate-45 translate-x-1/2 translate-y-1/2 bg-white border border-blue-500 bottom-full right-14 border-b-transparent border-r-transparent"></div>
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
    </AuthPageWrapper>
  );
};
