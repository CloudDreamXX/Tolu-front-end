import { useState, useEffect } from "react";
import classNames from "classnames";
import { IoChevronDown } from "react-icons/io5";
import { allergiesOptions } from "./config";
import Search from "../../../shared/ui/Search";
import Button from "../../../shared/ui/Button";

function StepAllergies({ data, setData }) {
  const [showSelect, setShowSelect] = useState(false);
  const [selected, setSelected] = useState(data.allergies || []);

  useEffect(() => {
    setData({ allergies: selected });
  }, [selected]);

  const toggleSelect = () => {
    setShowSelect((prev) => !prev);
  };

  const handleCheckboxChange = (option) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleApply = () => {
    setData({ allergies: selected });
    setShowSelect(false);
  };

  return (
    <div className="relative">
      <div
        onClick={toggleSelect}
        className="cursor-pointer flex items-center justify-between w-full border border-stroke rounded-full p-3 pr-4"
      >
        <span className="truncate w-[90%]">
          {selected.length > 0 ? selected.join(", ") : "Select Allergies"}
        </span>
        <IoChevronDown
          className={classNames(
            "transition-transform duration-300",
            { "rotate-180": showSelect }
          )}
        />
      </div>
      <div
        className={classNames(
          "absolute top-14 left-0 w-full bg-white z-50 border border-stroke rounded-2xl p-6 flex flex-col gap-4",
          { hidden: !showSelect }
        )}
      >
        <Search size="full" />
        <div className="flex flex-col gap-3 max-h-60 overflow-auto">
          {allergiesOptions.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
              {option}
            </label>
          ))}
        </div>
        <Button name="Apply" type="default" onClick={handleApply} />
      </div>
    </div>
  );
}

export default StepAllergies;
