import { updateCoachField } from "entities/store/coachOnboardingSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePageWidth } from "shared/lib";
import { AuthPageWrapper, TooltipWrapper } from "shared/ui";
import { Footer } from "../../Footer";
import { HeaderOnboarding } from "../../HeaderOnboarding";
import { titlesAndIcons } from "./mock";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

export const SelectType = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { isMobile } = usePageWidth();
  const [otherText, setOtherText] = useState<string>("");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    new Array(5).fill("")
  );

  const handleSelection = (index: number, value: string) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[index] = value;
    setSelectedOptions(updatedOptions);
    setActiveDropdown(null);
  };

  const toggleDropdown = (index: number) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  const isSelected = () => {
    return selectedOptions.find((option) => option !== "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSelected()) return;

    const filledTypes = selectedOptions.map((option) =>
      option === "Other (please specify)" ? otherText : option
    );

    dispatch(
      updateCoachField({ key: "practitioner_types", value: filledTypes })
    );
    nav("/onboarding-welcome");
  };

  return (
    <AuthPageWrapper>
      <Footer position={isMobile ? "top-right" : undefined} />
      <HeaderOnboarding currentStep={0} />
      <main className="flex flex-col items-center flex-1 justify-center gap-[32px] self-stretch md:px-[24px]">
        {!isMobile && (
          <h1 className="flex text-center  text-[32px] font-medium text-black">
            What type of practitioner best describes your role?
          </h1>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[25px] py-[24px] px-[16px] md:p-[40px] items-center w-full lg:w-fit rounded-t-[20px] md:rounded-[20px] bg-white border-[1px] border-[#1C63DB] shadow-md"
        >
          {isMobile && (
            <h1 className="flex text-center  text-[24px] font-medium text-black">
              What type of practitioner best describes your role?
            </h1>
          )}
          <div className="mt-[24px] mb-[24px] md:m-0 flex flex-col gap-[16px] w-full">
            {titlesAndIcons.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-[16px] md:gap-[20px] w-full lg:w-[460px] items-start"
              >
                <div className="flex items-center self-stretch gap-[8px]">
                  <h2 className="text-[#1B2559]  text-nowrap text-[16px] md:text-[20px] font-semibold">
                    {item.title}
                  </h2>
                  <TooltipWrapper content={item.tooltipContent}>
                    <MaterialIcon
                      iconName="help"
                      size={16}
                      fill={1}
                      className="text-[#1C63DB]"
                    />
                  </TooltipWrapper>
                </div>
                {/* Custom Dropdown */}
                <div className="relative w-full">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between bg-[#FAFAFA] border-[#9D9D9D] border-[1px] rounded-[8px] h-[52px] px-[12px] cursor-pointer"
                    onClick={() => toggleDropdown(index)}
                  >
                    <span className="text-[#000]  text-[16px]">
                      {selectedOptions[index] || "Select your type"}
                    </span>
                    <MaterialIcon iconName="keyboard_arrow_down" />
                  </button>
                  {activeDropdown === index && (
                    <div className="absolute z-10 flex flex-col w-full mt-[4px] bg-[#FAFAFA] border-none rounded-[8px] shadow-lg max-h-[200px] overflow-y-auto scrollbar-hide">
                      {item.options.map((option) => (
                        <button
                          type="button"
                          key={option}
                          className="py-[15px] px-[12px] text-left text-[#1D1D1F] text-[16px] font-medium cursor-pointer hover:bg-[#F2F2F2] hover:text-[#1C63DB]"
                          onClick={() => handleSelection(index, option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedOptions[index] === "Other (please specify)" && (
                    <input
                      type="text"
                      value={otherText}
                      onChange={(e) => setOtherText(e.target.value)}
                      placeholder="Other text"
                      className="mt-[4px] outline-none w-full h-[52px] px-[12px] border-[1px] border-[#9D9D9D] rounded-[8px] bg-[#FAFAFA] text-[16px] text-[#000] "
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          {isMobile && (
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={!isSelected()}
              className={`flex items-center justify-center w-full md:h-[44px] p-[16px] rounded-full ${
                isSelected()
                  ? "bg-[#1C63DB] text-white"
                  : "bg-[#D5DAE2] text-[#5F5F65]"
              }`}
            >
              Next
            </button>
          )}
        </form>
        {!isMobile && (
          <div className="pb-10 md:pb-[140px]">
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={!isSelected()}
              className={`mt-[20px] flex items-center justify-center w-[250px] h-[44px] p-[16px] rounded-full ${
                isSelected()
                  ? "bg-[#1C63DB] text-white"
                  : "bg-[#D5DAE2] text-[#5F5F65]"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </AuthPageWrapper>
  );
};
