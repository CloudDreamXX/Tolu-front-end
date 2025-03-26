import { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { IoChevronDown } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";

const mockOptions = ["Option A", "Option B", "Option C"];

const SelectField = ({ label, value = [], setValue }) => {
  const [show, setShow] = useState(false);
  const wrapperRef = useRef(null);

  const toggleDropdown = () => setShow((prev) => !prev);
  const handleSelect = (option) => {
    const alreadySelected = value.includes(option);
    if (alreadySelected) {
      setValue(value.filter((item) => item !== option));
    } else {
      setValue([...value, option]);
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full flex justify-between items-center" ref={wrapperRef}>
      <label className="flex flex-col gap-2 relative w-full max-w-[472px]">
        {label}
        <div className="relative">
          <div
            onClick={toggleDropdown}
            className="cursor-pointer flex items-center justify-between w-full border border-stroke rounded-full p-3 pr-4"
          >
            <span className="truncate w-[90%]" title={value.join(", ")}>
              {value.length > 0 ? value.join(", ") : "Select options"}
            </span>
            <IoChevronDown
              className={classNames("transition-transform duration-300", {
                "rotate-180": show,
              })}
            />
          </div>

          {show && (
            <div className="absolute top-14 left-0 w-full bg-white z-50 border border-stroke rounded-2xl p-4 flex flex-col gap-2">
              {mockOptions.map((option) => (
                <div
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={classNames(
                    "cursor-pointer hover:bg-gray-100 rounded-lg px-3 py-2 flex justify-between items-center",
                    {
                      "bg-btnBg": value.includes(option),
                    }
                  )}
                >
                  <span>{option}</span>
                  {value.includes(option) && (
                    <FaCircleCheck className="text-accent w-4 h-4" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </label>

      {value.length > 0 && <FaCircleCheck className="text-success w-6 h-6" />}
    </div>
  );
};

export default SelectField;
