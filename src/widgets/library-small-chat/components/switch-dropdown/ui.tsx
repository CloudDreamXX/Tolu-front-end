import { useState, useEffect, useRef } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { SwitchValue } from "widgets/library-small-chat/switch-config";

type Props = {
  options: SwitchValue[];
  selectedSwitch: string;
  handleSwitchChange: (value: string) => void;
  isCoach?: boolean;
};

const SwitchDropdown: React.FC<Props> = ({
  options,
  selectedSwitch,
  handleSwitchChange,
  isCoach,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative flex items-center justify-center">
      <button
        className={`flex items-center gap-2 p-[6px] md:p-2 ${isCoach ? "flex-row-reverse text-[#1C63DB] font-semibold" : "bg-[#1C63DB] text-white font-[500]"} text-[16px] lg:text-[14px] 2xl:text-[18px] rounded-lg`}
        onClick={toggleDropdown}
      >
        <div className="whitespace-nowrap">{selectedSwitch}</div>
        <MaterialIcon iconName="keyboard_arrow_down" size={24} />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute top-[30px] md:top-[38px] ${isCoach ? "left-[16px]" : "left-1/2 -translate-x-1/2"} transform mt-2 w-[160px] bg-white border border-[#1C63DB] rounded-[8px] shadow-lg z-[999]`}
        >
          <ul className="py-2">
            {options.map((option) => (
              <li
                key={option}
                className="px-4 py-2 font-medium hover:text-[#1C63DB] cursor-pointer"
                onClick={() => {
                  handleSwitchChange(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SwitchDropdown;
