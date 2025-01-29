import React, { useState, useRef } from "react";
import { GrAttachment } from "react-icons/gr";
import { FaArrowUp } from "react-icons/fa";

function LibraryInput({
  placeholder,
  width = "w-full",
  height = "h-[125px]",
  onChangeValue,  // Callback for input value change
  onSubmitValue,  // Callback for returning typed value
  onFileUpload,   // Callback when a file is uploaded
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const fileInputRef = useRef(null); // Ref for file input

  // Handle text input change
  const handleChange = (e) => {
    setValue(e.target.value);
    if (onChangeValue) {
      onChangeValue(e.target.value);  // Notify parent about value change
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (onFileUpload && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]); // Return selected file
    }
  };

  // Trigger file input on icon click
  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  // Return typed value on arrow click
  const handleSubmit = () => {
    if (onSubmitValue) {
      onSubmitValue(value);
      setValue('')
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Floating Label */}
      <label
        className={`absolute text-gray-500 transition-all duration-300 ${
          isFocused || value ? "text-xs text-gray-700 top-2" : "text-base top-4"
        } ${width === "w-full" ? "left-6" : width === "sm:w-3/4" ? "left-10" : "left-16"}`}
      >
        {placeholder}
      </label>

      {/* Input Field */}
      <input
        type="text"
        className={`${width} ${height} p-4 pt-6 border-2 border-[#008FF614] bg-white shadow-[#7090B024] rounded-xl focus:outline-none transition-all`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleChange}  // Handle input change
        value={value}
      />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Icons Container */}
      <div
        className={`absolute flex space-x-2 text-gray-500 transition-all duration-300 ${
          width === "w-full" ? "right-6" : width === "sm:w-3/4" ? "right-10" : "right-16"
        } bottom-4`}
      >
        {/* Attachment Icon (File Upload) */}
        <div className="w-[36px] h-[36px] bg-white border border-[#767779] rounded-full flex justify-center items-center cursor-pointer"
          onClick={handleFileUploadClick}
        >
          <GrAttachment className="text-[#767779]" />
        </div>

        {/* Arrow Icon (Submit Value) */}
        <div className="w-[36px] h-[36px] bg-[#767779] rounded-full flex justify-center items-center cursor-pointer"
          onClick={handleSubmit}
        >
          <FaArrowUp className="text-white" />
        </div>
      </div>
    </div>
  );
}

export default LibraryInput;
