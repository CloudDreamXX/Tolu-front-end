// import React, { useState } from "react";
// import { GrAttachment } from "react-icons/gr";
// import { FaArrowUp } from "react-icons/fa";
// function LibraryInput({placeholder}) {
//     const [isFocused, setIsFocused] = useState(false);
//     const [value, setValue] = useState("");

//     return (
//       <div className="relative flex flex-col  items-center w-full">
//         {/* Floating Label */}
//         <label
//           className={`absolute left-6 sm:left-10 md:left-16 lg:left-36 top-4  text-gray-500 transition-all duration-300 ${
//             isFocused || value ? "top-2 text-xs text-gray-700" : "top-4 text-base"
//           }`}
//         >
//           {placeholder}
//         </label>

//         {/* Input Field */}
//         <input
//           type="text"
//           className="w-[90%] sm:w-[85%] md:w-[75%] lg:w-[80%] h-[125px] p-4 pt-6 border-2 border-[#008FF614] bg-white shadow-[#7090B024] rounded-lg focus:outline-none"
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//           onChange={(e) => setValue(e.target.value)}
//           value={value}
//         />

//         {/* Icons Container */}
//         <div className="absolute flex right-6 sm:right-10 md:right-16 lg:right-36  bottom-4 text-gray-500 transition-all duration-300 space-x-2">
//           {/* Attachment Icon */}
//           <div className="w-[36px] h-[36px] bg-white border border-[#767779] rounded-full flex justify-center items-center">
//             <GrAttachment className="text-[#767779]" />
//           </div>

//           {/* Arrow Icon */}
//           <div className="w-[36px] h-[36px] bg-[#767779] rounded-full flex justify-center items-center">
//             <FaArrowUp className="text-white" />
//           </div>
//         </div>
//       </div>
//     );
//   };

// export default LibraryInput





import React, { useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { FaArrowUp } from "react-icons/fa";

function LibraryInput({
  placeholder,
  width = "w-full",
  height = "h-[125px]",
  onChangeValue,  // Add prop to handle the value change
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
    if (onChangeValue) {
      onChangeValue(e.target.value);  // Pass the value to the parent component
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Floating Label */}
      <label
        className={`absolute text-gray-500 transition-all duration-300 ${isFocused || value
            ? "text-xs text-gray-700 top-2"
            : "text-base top-4"
          } ${width === "w-full"
            ? "left-6"
            : width === "sm:w-3/4"
              ? "left-10"
              : "left-16"
          }`}
      >
        {placeholder}
      </label>

      {/* Input Field */}
      <input
        type="text"
        className={`${width} ${height} p-4 pt-6 border-2 border-[#008FF614] bg-white shadow-[#7090B024] rounded-xl focus:outline-none transition-all`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleChange}  // Use the new handler
        value={value}
      />

      {/* Icons Container */}
      <div
        className={`absolute flex space-x-2 text-gray-500 transition-all duration-300 ${width === "w-full"
            ? "right-6"
            : width === "sm:w-3/4"
              ? "right-10"
              : "right-16"
          } bottom-4`}
      >
        {/* Attachment Icon */}
        <div className="w-[36px] h-[36px] bg-white border border-[#767779] rounded-full flex justify-center items-center">
          <GrAttachment className="text-[#767779]" />
        </div>

        {/* Arrow Icon */}
        <div className="w-[36px] h-[36px] bg-[#767779] rounded-full flex justify-center items-center">
          <FaArrowUp className="text-white" />
        </div>
      </div>
    </div>
  );
}

export default LibraryInput;
