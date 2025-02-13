import React, { useRef, useState } from "react";
import { FaArrowUp, FaTimes } from "react-icons/fa";
import { GrAttachment } from "react-icons/gr";

function LibraryInput({
  placeholder,
  width = "w-full",
  height = "h-[125px]",
  onChangeValue,  // Callback for input value change
  onSubmitValue,  // Callback for returning typed value
  onFileUpload,
  handleRemoveFile,  // Callback when a file is uploaded
  isLoading,
  selectedFile,
  setSelectedFile    // Prop to indicate loading state
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  // const [selectedFile, setSelectedFile] = useState(null); // Store selected file
  const fileInputRef = useRef(null); // Ref for file input

  // Handle text input change
  const handleChange = (e) => {
    setValue(e.target.value);
    if (onChangeValue) {
      onChangeValue(e.target.value);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file); // Store selected file
      if (onFileUpload) {
        onFileUpload(file);
      }
    }
  };

  // Handle file removal
  // const handleRemoveFile = () => {
  //   setSelectedFile(null); // Clear selected file
  //   fileInputRef.current.value = ""; // Reset file input
  // };

  // Trigger file input on icon click
  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  // Return typed value on arrow click
  const handleSubmit = () => {
    if (!isLoading && onSubmitValue) {
      onSubmitValue(value);
      setValue('');
    }
  };

  // Handle Enter key press to submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!isLoading) {
        handleSubmit();
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Floating Label */}
      <label
        className={`absolute text-gray-500 transition-all duration-300 ${isFocused || value ? "text-xs text-gray-700 top-2" : "text-base top-4"} ${width === "w-full" ? "left-6" : width === "sm:w-3/4" ? "left-10" : "left-16"}`}
      >
        {placeholder}
      </label>

      {/* Input Field */}
      <input
        type="text"
        className={`${width} ${height} p-4 pt-6 border-2 border-[#008FF614] bg-white shadow-[#7090B024] rounded-xl focus:outline-none transition-all`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={value}
        disabled={isLoading}
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
        className={`absolute flex space-x-2 text-gray-500 transition-all duration-300 ${width === "w-full" ? "right-6" : width === "sm:w-3/4" ? "right-10" : "right-16"} bottom-4`}
      >
        {/* File Icon / Remove File Icon */}
        <div
          className="w-[36px] h-[36px] bg-white border border-[#767779] rounded-full flex justify-center items-center cursor-pointer"
          onClick={selectedFile ? handleRemoveFile : handleFileUploadClick} // Toggle between upload/remove
        >
          {selectedFile ? (
            <FaTimes className="text-red-500" /> // Cross icon if file is selected
          ) : (
            <GrAttachment className="text-[#767779]" /> // File icon if no file
          )}
        </div>

        {/* Arrow Icon (Submit Button) */}
        <button
          disabled={isLoading}
          onClick={handleSubmit}
          className={`w-[36px] h-[36px] rounded-full flex justify-center items-center transition-all duration-200 
            ${isLoading ? "bg-gray-400 cursor-not-allowed blur-sm" : "bg-[#767779] cursor-pointer"}
          `}
        >
          <FaArrowUp className={`text-white ${isLoading ? "opacity-50" : ""}`} />
        </button>
      </div>
    </div>
  );
}

export default LibraryInput;
