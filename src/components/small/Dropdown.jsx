
import { useEffect, useRef, useState } from "react";
import { GoChevronDown } from "react-icons/go";

const Dropdown = ({ options = [], defaultText = "Select", onSelect, label, width, mainClassName, readOnly = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const dropdownRef = useRef(null);

  const selectHandler = (option) => {
    if (readOnly) return;
    setSelected(option);
    setIsOpen(false);
    if (onSelect) onSelect(option); // Pass the selected option to parent
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setSelected(null)
  }, [defaultText === 'Select Name'])

  return (
    <div className={`relative ${width ? width : "w-full"}`} ref={dropdownRef}>
      {label && <label className="text-xs md:text-sm text-secondaryGray mb-1 block">{label}</label>}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={`Dropdown for ${label || "options"}`}
        className={`w-full h-[45px] px-4 border ${readOnly ? "cursor-not-allowed" : "border-[#E0E0E9]"
          } ${mainClassName} rounded-lg  text-sm text-[#383838E5] flex items-center justify-between`}
        onClick={() => !readOnly && setIsOpen(!isOpen)}
        disabled={readOnly}
      >
        <span className="text-sm text-[#383838E5] capitalize">
          {selected ? selected.label || selected.option : defaultText}
        </span>
        <div className={`transition-all duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}>
          <GoChevronDown fontSize={20} color={readOnly ? "#999999" : "#292D3280"} />
        </div>
      </button>
      {isOpen && !readOnly && (
        <ul className="absolute z-10 w-full rounded-md shadow-md cursor-pointer mt-1 bg-white">
          {options.map((option) => (
            <li
              className="py-2 text-sm px-4 border-b hover:bg-[hsl(208,100%,95%)]"
              key={option.value}
              onClick={() => selectHandler(option)}
            >
              {option.label || option.option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
