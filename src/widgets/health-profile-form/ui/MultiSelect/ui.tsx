import { useEffect, useRef, useState } from "react";
import CheckedIcon from "shared/assets/icons/checked";
import Chevron from "shared/assets/icons/chevron";
import UncheckedIcon from "shared/assets/icons/not-checked";
import { cn } from "shared/lib/utils";

export const MultiSelect = ({
  placeholder,
  options,
  selected,
  defaultValue,
  className,
  onChange,
}: {
  placeholder: string;
  options: string[];
  selected: string[];
  defaultValue?: string;
  className?: string;
  onChange: (val: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (defaultValue && selected.length === 0) {
      onChange([defaultValue]);
    }
  }, [defaultValue, selected, onChange]);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        className={cn(
          "w-full text-left border border-[#DBDEE1] rounded-md px-3 py-2 pr-10 text-sm font-[500] text-[#1D1D1F] bg-white relative flex flex-wrap items-center",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 gap-2"
        )}
        onClick={() => setOpen(!open)}
        type="button"
      >
        {selected.length === 0 ? (
          <span className="text-[#5F5F65]">{placeholder}</span>
        ) : (
          selected
            .filter((item) => item !== "Other")
            .map((option, index) => (
              <span
                key={option}
                className="flex items-center gap-[8px] text-[16px] font-[500] text-[#1D1D1F]"
              >
                {index !== 0 && ", "} {option}
              </span>
            ))
        )}
        <span className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2">
          <Chevron />
        </span>
      </button>
      {open && (
        <ul className="absolute z-10 mt-[4px] w-full bg-white border border-[#DBDEE1] rounded-md shadow-sm max-h-[220px] overflow-y-auto">
          {options.map((option) => (
            <li key={option}>
              <button
                className={cn(
                  "px-[17px] py-[8px] cursor-pointer flex items-center gap-[8px] font-[500] text-[16px] hover:bg-[#F2F2F2]",
                  {
                    "text-[#1C63DB]": selected.includes(option),
                  }
                )}
                onClick={() => toggleOption(option)}
              >
                {selected.includes(option) ? (
                  <CheckedIcon />
                ) : (
                  <UncheckedIcon />
                )}
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
