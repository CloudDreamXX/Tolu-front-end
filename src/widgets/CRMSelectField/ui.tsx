import { useState } from "react";
import Chevron from "shared/assets/icons/chevron";

export const SelectField = ({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string;
  onChange: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <label className="block mb-[12px] text-[16px] text-[#000] font-semibold">
        {label}
      </label>
      <button
        className="w-full text-left border border-[#DBDEE1] rounded-[1000px] px-[12px] py-[12.5px] pr-[40px] text-[14px] text-[#1D1D1F] font-semibold bg-white relative"
        onClick={() => setOpen(!open)}
        type="button"
      >
        {selected || "Select"}
        <span className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2">
          <Chevron />
        </span>
      </button>
      {open && (
        <ul className="absolute z-10 mt-[4px] w-full bg-[#F9FAFB] rounded-[18px] shadow-[0_4px_8px_rgba(0,0,0,0.25)] p-[12px] space-y-2">
          {options.map(({ value, label }) => (
            <li
              key={value}
              className="cursor-pointer px-[12px] py-[8px] border border-white hover:border-[#1D1D1F] rounded-[8px] text-[14px] text-[#1D1D1F] font-semibold bg-white"
              onClick={() => {
                onChange(value);
                setOpen(false);
              }}
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
