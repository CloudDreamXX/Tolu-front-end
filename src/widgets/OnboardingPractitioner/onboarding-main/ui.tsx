import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePageWidth } from "shared/lib";
import {
  AuthPageWrapper,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "shared/ui";
import { updateCoachField } from "../../../entities/store/coachOnboardingSlice";
import { Footer } from "../../Footer";
import { HeaderOnboarding } from "./components";
import { buttons } from "./mock";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

export const OnboardingMain = () => {
  const nav = useNavigate();
  const { isMobile } = usePageWidth();
  const [customButtons] = useState(buttons);
  const [otherText, setOtherText] = useState("");
  const [selectedButtons, setSelectedButtons] = useState<string[]>([]);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    setIsTooltipOpen(false);
  };

  const isNextDisabled =
    selectedButtons.length === 0 ||
    (selectedButtons.includes("Other") && otherText.trim() === "");

  const handleNext = () => {
    let updatedButtons = [...selectedButtons];

    if (isOtherSelected() && otherText.trim()) {
      updatedButtons = updatedButtons
        .filter((btn) => btn !== "Other")
        .concat(otherText);
    }

    dispatch(
      updateCoachField({ key: "primary_niches", value: updatedButtons })
    );

    nav("/about-your-practice");
  };

  return (
    <AuthPageWrapper>
      <Footer position={isMobile ? "top-right" : undefined} />
      <HeaderOnboarding currentStep={1} />
      <main
        className={`flex flex-col items-center flex-1 justify-center gap-[32px] md:gap-[60px] self-stretch bg-white py-[24px] px-[16px] md:p-0 rounded-t-[20px] md:rounded-0
    ${isMobile ? "absolute bottom-0 left-0 w-full z-10" : "relative"} 
    ${isMobile ? "shadow-md" : ""} md:bg-transparent`}
      >
        <h3 className="font-inter text-[24px] md:text-[32px] font-medium text-black text-center self-stretch">
          What are your primary focus areas?
        </h3>

        <section className="w-full lg:w-[900px] items-center justify-center flex flex-col">
          {/* Dropdown Multi-Select */}
          <div className="relative">
            <div
              className="flex justify-between items-center w-full md:w-[620px] py-[11px] px-[16px] rounded-[8px] border bg-white cursor-pointer"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <div className="flex flex-wrap gap-[8px]">
                {selectedButtons.length === 0 && (
                  <span className="text-[#5F5F65]">
                    Select one or more options
                  </span>
                )}
                {selectedButtons.map((buttonText) => (
                  <span
                    key={buttonText}
                    className="border border-[#CBCFD8] px-[16px] py-[6px] rounded-[6px] flex items-center gap-2"
                  >
                    {buttonText}
                    <button
                      type="button"
                      className="ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = selectedButtons.filter(
                          (s) => s !== buttonText
                        );
                        setSelectedButtons(updated);
                        dispatch(
                          updateCoachField({
                            key: "primary_niches",
                            value: updated,
                          })
                        );
                      }}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.7667 6.33422C11.4542 6.0218 10.9477 6.0218 10.6353 6.33422L8.00098 8.96853L5.36666 6.33422C5.05424 6.0218 4.54771 6.0218 4.23529 6.33422C3.92287 6.64664 3.92287 7.15317 4.23529 7.46559L7.43529 10.6656C7.74771 10.978 8.25424 10.978 8.56666 10.6656L11.7667 7.46559C12.0791 7.15317 12.0791 6.64664 11.7667 6.33422Z"
                  fill="#1D1D1F"
                />
              </svg>
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full mt-1 left-0 w-full max-h-[174px] overflow-y-auto bg-[#FAFAFA] rounded-md shadow-md flex flex-col gap-[8px]">
                {customButtons.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex flex-col">
                    {row.map((buttonText) => {
                      const isSelected = selectedButtons.includes(buttonText);

                      return (
                        <div
                          key={buttonText}
                          onClick={() => handleButtonClick(buttonText)}
                          className="cursor-pointer px-[12px] py-[15px] hover:bg-[#F2F2F2] hover:text-[#1C63DB] flex items-center gap-[12px]"
                        >
                          <span className="w-[20px] h-[20px] flex items-center justify-center">
                            <MaterialIcon
                              iconName={
                                isSelected ? "check" : "check_box_outline_blank"
                              }
                            />
                          </span>
                          {buttonText}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {isOtherSelected() && (
            <div className="w-full mt-2 flex justify-center">
              <input
                type="text"
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                placeholder="Please specify your niche"
                className="peer w-full md:w-[620px] py-[11px] px-[16px] pr-[40px] rounded-[8px] border border-[#DFDFDF] bg-white outline-none placeholder-[#5F5F65] focus:border-[#1C63DB]"
              />
            </div>
          )}
        </section>

        {/* Next Button */}
        <div className="flex items-center gap-[8px] md:gap-[16px] w-full md:w-fit">
          <button
            onClick={() => nav(-1)}
            className="flex w-full md:w-[250px] md:h-[44px] py-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-[#1C63DB]"
            style={{ background: "rgba(0, 143, 246, 0.10)" }}
          >
            Back
          </button>

          <TooltipProvider delayDuration={500}>
            <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
              <TooltipTrigger asChild>
                <button
                  className={
                    !isNextDisabled
                      ? "bg-[#1C63DB] flex w-full md:w-[250px] md:h-[44px] py-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-white"
                      : "flex w-full md:w-[250px] md:h-[44px] py-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full bg-[#D5DAE2] text-[16px] font-[Nunito] font-semibold text-[#5F5F65] cursor-not-allowed"
                  }
                  tabIndex={isNextDisabled ? -1 : 0}
                  aria-disabled={isNextDisabled}
                  onClick={handleNext}
                >
                  Next
                </button>
              </TooltipTrigger>

              <TooltipContent side="bottom">
                <div className="flex flex-col items-center gap-2">
                  <h3 className="flex gap-2 text-[#1B2559] leading-[1.4]">
                    <span className="w-6 h-6 shrink-0">
                      <MaterialIcon
                        iconName="lightbulb"
                        className="text-[#1B2559]"
                      />
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
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </main>
    </AuthPageWrapper>
  );
};
