import { useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { GoGear } from "react-icons/go";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { GrAttachment } from "react-icons/gr";
import Modal from "../../../components/modals/Modal";
import AddFiles from "../../../pages/admin/addBlog/components/AddFiles";
import { types } from "./utils";
import classNames from "classnames";

function AIInput({
  placeholder,
  width = "w-full",
  height = "h-[125px]",
  onChangeValue,  // Callback for input value change
  onSubmitValue,  // Callback for returning typed value
  onFileUpload,
  handleRemoveFile,  // Callback when a file is uploaded
  isLoading,
  selectedFile,
  setSelectedFile,    // Prop to indicate loading state
	type,
  fetchFile,
  folder,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const [addFile ,setAddFile]= useState(false);
  const openAddFileModal=()=>{
    setAddFile(true);
  }
  const closeAddFilesModal=()=>{
    setAddFile(false);
  }
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setValue(e.target.value);
    if (onChangeValue) {
      onChangeValue(e.target.value);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (onFileUpload) {
        onFileUpload(file);
      }
    }
  };

  return (
    <>
      <Modal className="w-[500px]" isOpen={addFile} onClose={closeAddFilesModal} title={<h1 className="text-xl font-bold">Add Files</h1>}>
        <AddFiles
          fetchFile={fetchFile}
          folder={folder}
          setSelectedFile={setSelectedFile}
          selectedFile={selectedFile}
        />
      </Modal>
      <div className="relative flex flex-col items-center w-full">
        <label
          className={`absolute text-gray-500 transition-all duration-300 ${isFocused || value ? "text-xs text-gray-700 top-2" : "text-base top-4"} ${width === "w-full" ? "left-6" : width === "sm:w-3/4" ? "left-10" : "left-16"}`}
        >
          {placeholder}
        </label>
        <input
          type="text"
          className={`${width} ${height} p-4 pt-6 border-2 border-[#008FF614] bg-white shadow-[#7090B024] rounded-xl focus:outline-none transition-all`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          // onKeyDown={handleKeyDown}
          value={value}
          disabled={isLoading}
        />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <div
          className={`absolute flex space-x-2 text-gray-500 transition-all duration-300 ${width === "w-full" ? "right-6" : width === "sm:w-3/4" ? "right-10" : "right-16"} bottom-4`}
        >
          <button
            disabled={isLoading}
            // onClick={handleSubmit}
            className={`w-[36px] h-[36px] rounded-full flex justify-center items-center transition-all duration-200
            ${isLoading ? "bg-gray-400 cursor-not-allowed blur-sm" : "bg-black cursor-pointer"}
          `}
          >
            <IoPaperPlaneOutline className={`text-white w-5 h-5 ${isLoading ? "opacity-50" : ""}`} />
          </button>
        </div>
				<div
          className={classNames(
            "absolute left-6 bottom-2 flex items-center space-x-2",
            { hidden: !type }
          )}
        >
          {type === types.USER && (
            <>
              <div
                className="w-[36px] h-[36px] bg-contentBg rounded-full flex justify-center items-center cursor-pointer"
                onClick={openAddFileModal}
              >
                <GrAttachment className="text-black" />
              </div>
              <div
                className="w-[36px] h-[36px] bg-contentBg rounded-full flex justify-center items-center cursor-pointer"
                onClick={openAddFileModal}
              >
                <GoGear className="text-black" />
              </div>
            </>
          )}
          {type === types.ADMIN_DOC_OPENED && (
            <div
              className="w-[36px] h-[36px] bg-contentBg rounded-full flex justify-center items-center cursor-pointer"
              onClick={openAddFileModal}
            >
              <GrAttachment className="text-black" />
            </div>
          )}
        </div>
      </div>
    </>

  );
}

export default AIInput;
