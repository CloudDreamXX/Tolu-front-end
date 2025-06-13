import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import CircleQuestion from "shared/assets/icons/circle-question";
import { Footer } from "../../Footer";
import { HeaderOnboarding } from "../../HeaderOnboarding";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCoachField } from "entities/store/coachOnboardingSlice";
import { titlesAndIcons } from "./mock";
import { AuthPageWrapper } from "shared/ui";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipTrigger } from "shared/ui/tooltip";

export const SelectType = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    new Array(5).fill("")
  );
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [otherText, setOtherText] = useState<string>("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelection = (index: number, value: string) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[index] = value;
    setSelectedOptions(updatedOptions);
    setActiveDropdown(null);
  };

  const toggleDropdown = (index: number) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  const isAllSelected = () => {
    return selectedOptions.every((option) => option !== "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAllSelected()) return;

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
      <main className="flex flex-col items-center flex-1 justify-center gap-[32px] self-stretch">
        {!isMobile && (
          <h1 className="flex text-center font-inter text-[32px] font-medium text-black">
            What type of practitioner best describes your role?
          </h1>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[25px] py-[24px] px-[16px] md:p-[40px] items-center w-full md:w-fit rounded-t-[20px] md:rounded-[20px] bg-white border-[1px] border-[#1C63DB] shadow-md"
        >
          {isMobile && (
            <h1 className="flex text-center font-inter text-[24px] font-medium text-black">
              What type of practitioner best describes your role?
            </h1>
          )}
          <div className="mt-[24px] mb-[24px] md:m-0 flex flex-col gap-[16px] w-full">
            {titlesAndIcons.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-[16px] md:gap-[20px] w-full md:w-[460px] items-start"
              >
                <div className="flex items-center self-stretch gap-[8px]">
                  {item.icon}
                  <h2 className="text-[#1B2559] font-[Nunito] text-nowrap text-[16px] mb:text-[20px] font-semibold">
                    {item.title}
                  </h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <CircleQuestion />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span className="whitespace-pre-line text-[#1B2559] text-[16px] font-semibold">
                          {item.tooltipContent}
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {/* Custom Dropdown */}
                <div className="relative w-full">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between bg-[#FAFAFA] border-[#9D9D9D] border-[1px] rounded-[8px] h-[52px] px-[12px] cursor-pointer"
                    onClick={() => toggleDropdown(index)}
                  >
                    <span className="text-[#000] font-[Nunito] text-[16px]">
                      {selectedOptions[index] || "Select your type"}
                    </span>
                    <ChevronDown className="text-[#9D9D9D]" />
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
                      placeholder="Please specify"
                      className="mt-[4px] outline-none w-full h-[52px] px-[12px] border-[1px] border-[#9D9D9D] rounded-[8px] bg-[#FAFAFA] text-[16px] text-[#000] font-[Nunito]"
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
              disabled={!isAllSelected()}
              className={`flex items-center justify-center w-full md:h-[44px] p-[16px] rounded-full ${
                isAllSelected()
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
              disabled={!isAllSelected()}
              className={`mt-[20px] flex items-center justify-center w-[250px] h-[44px] p-[16px] rounded-full ${
                isAllSelected()
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
