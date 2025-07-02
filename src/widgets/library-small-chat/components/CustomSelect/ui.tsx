import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
      <button
        type="button"
        className="w-full text-left border border-[#DBDEE1] rounded-full py-[4px] px-[12px] text-[18px] font-[500] text-[#1D1D1F] bg-white flex items-center justify-between"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value || <span className="text-[#5F5F65]">{placeholder}</span>}
        {isOpen ? (
          <ChevronUp className="w-[20px] h-[20px]" />
        ) : (
          <ChevronDown className="w-[20px] h-[20px]" />
        )}
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-[4px] w-full min-w-[113px] bg-white border border-[#DBDEE1] rounded-[12px] shadow-sm max-h-[220px] overflow-y-auto text-[16px]">
          {options.map((option, index) => (
            <li
              key={option}
              className={`px-[17px] py-[8px] cursor-pointer hover:text-[#1C63DB] ${
                value === option ? "text-[#008FF6] font-semibold" : ""
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
