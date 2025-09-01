import { useState } from "react";
import { Footer } from "pages/onboarding-welcome/components";
import { HeaderOnboarding } from "pages/onboarding-main/components";
import LeavesIcon from "shared/assets/icons/leaves";
import Brain from "shared/assets/icons/brain";
import Chemistry from "shared/assets/icons/chemistry";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

export const SelectType = () => {
  const titlesAndIcosn = [
    {
      title: "Clinical & Licensed Healthcare Providers",
      icon: <MaterialIcon iconName="lightbulb" fill={1} size={20} />,
    },
    {
      title: "Functional & Holistic Health Practitioners",
      icon: <LeavesIcon />,
    },
    {
      title: "Lifestyle, Mind-Body, and Wellness Coaches",
      icon: <Brain />,
    },
    {
      title: "Women's Health & Specialty Coaches",
      icon: <MaterialIcon iconName="female" />,
    },
    {
      title: "Other",
      icon: <Chemistry />,
    },
  ];
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    new Array(5).fill("")
  );
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

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

  return (
    <div
      className="w-full h-full"
      style={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), radial-gradient(107.14% 107.09% at 50.55% 99.73%, rgba(248, 251, 255, 0.81) 0%, rgba(222, 236, 255, 0.90) 68.27%, rgba(247, 230, 255, 0.90) 100%), #FFF`,
      }}
    >
      <HeaderOnboarding />
      <main className="flex flex-col items-center flex-1 justify-center gap-[32px] self-stretch">
        <h1 className="flex text-center font-inter text-[32px] font-medium text-black">
          What type of practitioner best describes your role?
        </h1>
        <form
          onSubmit={() => {}}
          className="flex flex-col gap-[20px] p-[40px] items-center rounded-[20px] bg-white shadow-md border-[1px] border-[#1C63DB]"
        >
          {titlesAndIcosn.map((item, index) => (
            <div
              key={item.title}
              className="flex flex-col gap-[20px] w-[460px] items-start"
            >
              <div className="flex items-center self-stretch gap-[8px]">
                <h2 className="text-[#1B2559] font-[Nunito] text-nowrap text-[20px] font-semibold">
                  {item.title}
                </h2>
                <MaterialIcon
                  iconName="help"
                  size={16}
                  fill={1}
                  className="text-[#1C63DB]"
                />
              </div>
              {/* Custom Dropdown */}
              <div className="relative w-full">
                <button
                  type="button"
                  className="flex w-full items-center justify-between bg-[#FAFAFA] border-[#9D9D9D] border-[1px] rounded-[8px] h-[52px] px-[12px] cursor-pointer"
                  onClick={() => toggleDropdown(index)} // Toggle dropdown visibility based on index
                >
                  <span className="text-[#5F5F65] font-[Nunito] text-[16px]">
                    {selectedOptions[index] || "Select your type"}
                  </span>
                  <MaterialIcon
                    iconName="keyboard_arrow_down"
                    size={20}
                    className="text-[#9D9D9D]"
                  />
                </button>
                {/* Dropdown options */}
                {activeDropdown === index && ( // Only show dropdown if it's the active one
                  <div className="absolute z-10 flex flex-col gap-[10px] w-full mt-[4px] bg-white border-[#9D9D9D] border-[1px] rounded-[8px] shadow-lg max-h-[200px] overflow-y-auto">
                    {[
                      "Clinical Psychologist",
                      "Psychiatrist",
                      "Psychoanalyst",
                      "Psychotherapist",
                      "Clinical Social Worker",
                      "Licensed Professional Counselor",
                      "Marriage and Family Therapist",
                    ].map((item) => (
                      <button
                        type="button"
                        key={item}
                        className={`p-[12px] text-[#1D1D1F] text-[16px] font-medium cursor-pointer hover:bg-[#F1F1F1] hover:text-[#1C63DB] ${selectedOptions[index] === item ? "bg-[#E4E9F2]" : ""}`}
                        onClick={() => handleSelection(index, item)} // Update selection for this dropdown
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </form>
        <button
          type="submit"
          className={
            isAllSelected()
              ? "flex items-center justify-center w-[250px] h-[44px] text-white p-[16px] rounded-full bg-[#1C63DB]"
              : "flex items-center justify-center w-[250px] h-[44px] p-[16px] rounded-full bg-[#D5DAE2]"
          }
        >
          Next
        </button>
      </main>
      <Footer />
    </div>
  );
};
