import { useState } from "react";
import Chevron from "shared/assets/icons/chevron";
import CloseIcon from "shared/assets/icons/close";
import CheckedIcon from "shared/assets/icons/checked";
import UncheckedIcon from "shared/assets/icons/not-checked";

export const MultiSelectField = ({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const removeOption = (option: string) => {
    onChange(selected.filter((item) => item !== option));
  };

  return (
    <div className="relative w-full">
      <label className="block mb-[12px] text-[16px] text-[#000] font-semibold">
        {label}
      </label>
      <button
        className="w-full text-left border border-[#DBDEE1] rounded-[16px] md:rounded-[1000px] px-[12px] py-[8px] pr-[40px] text-[14px] text-[#1D1D1F] font-semibold bg-white relative flex flex-wrap gap-[8px] items-center min-h-[48px]"
        onClick={() => setOpen(!open)}
        type="button"
      >
        {selected.length === 0 ? (
          <span className="text-[#1D1D1F]">Select</span>
        ) : (
          selected.map((option) => (
            <span
              key={option}
              className="flex items-center gap-[8px] bg-[#DBDEE1] rounded-[8px] px-[8px] py-[6px] text-[14px] font-semibold"
            >
              {option}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(option);
                }}
              >
                <CloseIcon width={16} height={16} />
              </button>
            </span>
          ))
        )}
        <span className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2">
          <Chevron />
        </span>
      </button>
      {open && (
        <ul className="absolute z-10 mt-[4px] w-full bg-[#F9FAFB] rounded-[18px] shadow-[0_4px_8px_rgba(0,0,0,0.25)] p-[12px] space-y-2">
          {options.map((option) => (
            <li
              key={option}
              className={`cursor-pointer px-[12px] py-[8px] border rounded-[8px] text-[14px] text-[#1D1D1F] font-semibold bg-white flex items-center gap-[8px] ${selected.includes(option) ? "border-[#1D1D1F]" : "border-white hover:border-[#1D1D1F]"}`}
              onClick={() => toggleOption(option)}
            >
              {selected.includes(option) ? <CheckedIcon /> : <UncheckedIcon />}
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
