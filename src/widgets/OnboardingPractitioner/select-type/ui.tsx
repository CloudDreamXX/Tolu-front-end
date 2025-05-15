import { useState } from "react";
import { ChevronDown } from "lucide-react";
import CircleQuestion from "shared/assets/icons/circle-question";
import { Footer } from "../Footer";
import { HeaderOnboarding } from "../HeaderOnboarding";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCoachField } from "entities/store/coachOnboardingSlice";
import { dropdownOptions, titlesAndIcons } from "./mock";

export const SelectType = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    new Array(5).fill("")
  );
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dispatch = useDispatch();
  const nav = useNavigate();

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

    const filledTypes = selectedOptions.filter(
      (option) => option.trim() !== ""
    );

    dispatch(
      updateCoachField({ key: "practitioner_types", value: filledTypes })
    );
    nav("/onboarding-welcome");
  };

  return (
    <div
      className="w-full h-full"
      style={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), radial-gradient(107.14% 107.09% at 50.55% 99.73%, rgba(248, 251, 255, 0.81) 0%, rgba(222, 236, 255, 0.90) 68.27%, rgba(247, 230, 255, 0.90) 100%), #FFF`,
      }}
    >
      <HeaderOnboarding currentStep={0} />
      <main className="flex flex-col items-center flex-1 justify-center gap-[32px] self-stretch">
        <h1 className="flex text-center font-[Inter] text-[32px] font-medium text-black">
          What type of practitioner best describes your role?
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[20px] p-[40px] items-center rounded-[20px] bg-white shadow-md border-[1px] border-[#1C63DB]"
        >
          {titlesAndIcons.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-[20px] w-[460px] items-start"
            >
              <div className="flex items-center self-stretch gap-[8px]">
                {item.icon}
                <h2 className="text-[#1B2559] font-[Nunito] text-nowrap text-[20px] font-semibold">
                  {item.title}
                </h2>
                <CircleQuestion />
              </div>
              {/* Custom Dropdown */}
              <div className="relative w-full">
                <button
                  type="button"
                  className="flex w-full items-center justify-between bg-[#FAFAFA] border-[#9D9D9D] border-[1px] rounded-[8px] h-[52px] px-[12px] cursor-pointer"
                  onClick={() => toggleDropdown(index)}
                >
                  <span className="text-[#5F5F65] font-[Nunito] text-[16px]">
                    {selectedOptions[index] || "Select your type"}
                  </span>
                  <ChevronDown className="text-[#9D9D9D]" />
                </button>
                {activeDropdown === index && (
                  <div className="absolute z-10 flex flex-col gap-[10px] w-full mt-[4px] bg-white border-[#9D9D9D] border-[1px] rounded-[8px] shadow-lg max-h-[200px] overflow-y-auto">
                    {dropdownOptions.map((option) => (
                      <button
                        type="button"
                        key={option}
                        className={`p-[12px] text-[#1D1D1F] text-[16px] font-medium cursor-pointer hover:bg-[#F1F1F1] hover:text-[#1C63DB] ${selectedOptions[index] === option ? "bg-[#E4E9F2]" : ""}`}
                        onClick={() => handleSelection(index, option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </form>
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
      </main>
      <Footer />
    </div>
  );
};
