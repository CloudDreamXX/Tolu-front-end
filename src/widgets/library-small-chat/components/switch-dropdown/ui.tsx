import { useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { SwitchValue } from "widgets/library-small-chat/switch-config";

type Props = {
  options: SwitchValue[];
  selectedSwitch: string;
  handleSwitchChange: (value: string) => void;
};

const SwitchDropdown: React.FC<Props> = ({
  options,
  selectedSwitch,
  handleSwitchChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative flex items-center justify-center">
      <button
        className="flex items-center gap-2 p-[6px] md:p-2 bg-[#1C63DB] text-white font-[500] text-[16px] md:text-[18px] rounded-lg"
        onClick={toggleDropdown}
      >
        <span>{selectedSwitch}</span>
        <MaterialIcon iconName="keyboard_arrow_down" size={24} />
      </button>

      {isOpen && (
        <div className="absolute top-[30px] md:top-[38px] left-1/2 transform -translate-x-1/2 mt-2 w-[160px] bg-white border border-[#1C63DB] rounded-[8px] shadow-lg z-10">
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
