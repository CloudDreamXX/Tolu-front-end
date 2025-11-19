import { useState, useRef, useEffect } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button } from "shared/ui";

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

export const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant={"unstyled"}
        size={"unstyled"}
        type="button"
        className={`w-full text-left border ${isOpen ? "border-[#1C63DB]" : "border-[#DBDEE1]"} rounded-full py-[4px] px-[12px] text-[16px] md:text-[18px] font-[500] text-[#1D1D1F] bg-white flex items-center justify-between`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value || <span className="text-[#5F5F65]">{placeholder}</span>}
        <MaterialIcon
          iconName={isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
        />
      </Button>

      {isOpen && (
        <ul className="absolute z-10 mt-[4px] w-full md:w-[302px] bg-white border border-[#DBDEE1] rounded-[12px] shadow-sm max-h-[220px] overflow-y-auto text-[14px] md:text-[16px]">
          {options.map((option, index) => (
            <li
              key={option}
              className={`px-[17px] py-[8px] cursor-pointer hover:text-[#1C63DB] font-[500] ${
                value === option ? "text-[#1C63DB]" : ""
              } ${index < options.length - 1 ? "border-b border-[#C2C6D2]" : ""}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
