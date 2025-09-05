import { useState, useEffect } from "react";
import { CoachOnboardingState } from "entities/store/coachOnboardingSlice";
import { TooltipWrapper } from "shared/ui";
import { titlesAndIcons } from "widgets/OnboardingPractitioner/select-type";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

type StepTypeProps = {
  data: CoachOnboardingState;
  setDataState: React.Dispatch<React.SetStateAction<CoachOnboardingState>>;
};

export function StepType({ data, setDataState }: StepTypeProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    data.practitioner_types && data.practitioner_types.length > 0
      ? data.practitioner_types
      : []
  );
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [otherText, setOtherText] = useState<string>("");

  const toggleDropdown = (index: number) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  const handleSelection = (index: number, value: string) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[index] = value;
    setSelectedOptions(updatedOptions);
    setActiveDropdown(null);
  };

  useEffect(() => {
    const filledTypes = selectedOptions.map((option) =>
      option === "Other (please specify)" ? otherText : option
    );

    setDataState((prevState) => ({
      ...prevState,
      practitioner_types: filledTypes,
    }));
  }, [selectedOptions, otherText, setDataState]);

  return (
    <div className="flex flex-col gap-8 mt-2">
      {titlesAndIcons.map((item, index) => (
        <div
          key={item.title}
          className="flex flex-col items-start w-full gap-5"
        >
          <div className="flex items-center self-stretch gap-[8px]">
            {item.icon}
            <label className="text-[#1B2559] text-[16px] font-semibold">
              {item.title}
            </label>
            <TooltipWrapper content={item.tooltipContent}>
              <MaterialIcon
                iconName="help"
                size={16}
                fill={1}
                className="text-[#1C63DB]"
              />
            </TooltipWrapper>
          </div>

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
              <div className="border border-[#9D9D9D] absolute z-10 flex flex-col w-full mt-[4px] bg-[#FAFAFA] rounded-[8px] shadow-lg max-h-[200px] overflow-y-auto scrollbar-hide">
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
  );
}
