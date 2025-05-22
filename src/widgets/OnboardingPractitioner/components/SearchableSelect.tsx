import { useEffect, useRef, useState } from "react";

interface SearchableSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  labelStyle?: string;
  width?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  labelStyle,
  options,
  value,
  onChange,
  placeholder = "Select",
  width = "w-[100%]",
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  }, [inputValue, options]);

  const handleSelect = (option: string) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`${width} relative`} ref={containerRef}>
      <label
        className={`peer-focus:text-[#1D1D1F] ${labelStyle} font-[Nunito] text-[16px] font-medium text-[#1D1D1F] mb-2 block`}
      >
        {label}
      </label>
      <input
        type="text"
        value={inputValue}
        onClick={() => setIsOpen(true)}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsOpen(true);
        }}
        placeholder={placeholder ? placeholder : "Select"}
        className="peer w-full py-[11px] px-[16px] pr-[40px] rounded-[8px] border border-[#DFDFDF] bg-white outline-none placeholder-[#5F5F65] focus:border-[#1C63DB]"
      />
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full max-h-[160px] overflow-y-auto scrollbar-hide border border-[#1C63DB] bg-white rounded-md shadow-md p-[16px] flex flex-col gap-[8px]">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className="cursor-pointer hover:bg-[#F3F6FB]"
              >
                {option}
              </li>
            ))
          ) : (
            <li className="px-[16px] py-[8px] text-[#888]">No matches found</li>
          )}
        </ul>
      )}
      <div
        className={`pointer-events-none absolute right-4 top-[48px] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.7667 6.33422C11.4542 6.0218 10.9477 6.0218 10.6353 6.33422L8.00098 8.96853L5.36666 6.33422C5.05424 6.0218 4.54771 6.0218 4.23529 6.33422C3.92287 6.64664 3.92287 7.15317 4.23529 7.46559L7.43529 10.6656C7.74771 10.978 8.25424 10.978 8.56666 10.6656L11.7667 7.46559C12.0791 7.15317 12.0791 6.64664 11.7667 6.33422Z"
            fill="#1D1D1F"
          />
        </svg>
      </div>
    </div>
  );
};
