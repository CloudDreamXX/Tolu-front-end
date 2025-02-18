
import { useState } from "react";
const CustomInput = ({ style, type = "text", label, ...rest }) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="">
      <div className="flex flex-col space-y-3">
        <label
          className={`${style ? style : "text-base md:text-lg text-textColor/80 pb-1 block"
            }`}
        >
          {label}
        </label>
        <div className="flex items-center gap-4">

          <input
            type={type}
            value={inputValue}
            onChange={handleChange}
            {...rest}
            className="border border-primary/10 w-[95%] outline-none h-[50px] px-3 bg-transparent rounded-[10px]"
          />
          <div className="">

            {inputValue && (
              <span className="  text-green-500">
                ✔️
              </span>
            )}
          </div>
        </div>
        {/* Display check icon if the input is filled */}
      </div>

    </div>

  );
};

export default CustomInput;
