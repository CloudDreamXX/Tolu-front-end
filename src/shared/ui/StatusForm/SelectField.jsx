import { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { IoChevronDown } from "react-icons/io5";
import { FaCircleCheck } from "react-icons/fa6";
const mockOptions = ["Option A", "Option B", "Option C"];

const SelectField = ({ label, value, setValue }) => {
  const [show, setShow] = useState(false);
  const wrapperRef = useRef(null);

  const toggle = () => setShow((prev) => !prev);

  const handleCheckboxChange = (option) => {
    setValue((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
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
            onMouseDown={(e) => {
              e.preventDefault();
              toggle();
            }}
            className="cursor-pointer flex items-center justify-between w-full border border-stroke rounded-full p-3 pr-4"
          >
            <span className="truncate w-[90%]" title={value.join(", ")}>
              {value.length > 0 ? value.join(", ") : "Select Allergies"}
            </span>
            <IoChevronDown
              className={classNames("transition-transform duration-300", {
                "rotate-180": show,
              })}
            />
          </div>

          {show && (
            <div className="absolute top-14 left-0 w-full bg-white z-50 border border-stroke rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                {mockOptions.map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={value.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </label>
      {value.length > 0 && <FaCircleCheck className="text-success w-6 h-6" />}
    </div>
  );
};

export default SelectField;
