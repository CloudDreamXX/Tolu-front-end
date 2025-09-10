import { useEffect, useRef, useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib/utils";

type Group = { title: string; options: string[] };
type OptionsInput = Array<string | Group>;

const isGroup = (item: string | Group): item is Group =>
  typeof item !== "string" && Array.isArray(item.options);

export const MultiSelect = ({
  placeholder,
  options,
  selected,
  defaultValue,
  className,
  onChange,
}: {
  placeholder: string;
  options: OptionsInput;
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const renderOption = (option: string) => (
    <li key={option}>
      <button
        type="button"
        className={cn(
          "px-[17px] py-[8px] cursor-pointer flex items-center gap-[8px] font-[500] text-[16px] hover:bg-[#F2F2F2] w-full text-left",
          { "text-[#1C63DB]": selected.includes(option) }
        )}
        onClick={() => toggleOption(option)}
      >
        <MaterialIcon
          iconName={
            selected.includes(option) ? "check" : "check_box_outline_blank"
          }
        />

        {option}
      </button>
    </li>
  );

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        className={
          "w-full text-left border border-[#DBDEE1] rounded-md px-3 py-2 pr-10 h-[38px] text-sm font-[500] text-[#1D1D1F] bg-white relative flex flex-wrap items-center outline-0"
        }
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected.length === 0 ? (
          <span className="text-[#5F5F65]">{placeholder}</span>
        ) : (
          selected
            .filter((item) => item !== "Other")
            .map((option, index) => (
              <span
                key={`${option}-${index}`}
                className="flex items-center gap-[8px] text-[14px] font-[500] text-[#1D1D1F]"
              >
                {index !== 0 && ", "} {option}
              </span>
            ))
        )}
        <span className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2">
          <MaterialIcon
            iconName="keyboard_arrow_down"
            className="text-[#1D1D1F] opacity-50"
          />
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-10 mt-[4px] w-full bg-white border border-[#DBDEE1] rounded-md shadow-sm max-h-[260px] overflow-y-auto"
        >
          {options.map((item, idx) =>
            isGroup(item) ? (
              <li key={`group-${idx}`} className="py-[6px]">
                <div className="px-[17px] py-[6px] font-[700] text-[16px] text-[#1D1D1F] cursor-default pointer-events-none">
                  {item.title}
                </div>
                <ul>{item.options.map(renderOption)}</ul>
              </li>
            ) : (
              renderOption(item)
            )
          )}
        </ul>
      )}
    </div>
  );
};
