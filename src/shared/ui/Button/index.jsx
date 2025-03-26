import classnames from "classnames";
import { FiPlus } from "react-icons/fi";
import { MdOutlineFileUpload } from "react-icons/md";
import { BsStars } from "react-icons/bs";
import { HiOutlineUpload } from "react-icons/hi";
import { LuFolderInput } from "react-icons/lu";
import { MdOutlineHeadphones } from "react-icons/md";
import { FiChevronLeft } from "react-icons/fi";

function Button({ name, icon, onClick, type }) {
  return (
    <button
      className={classnames(
        "flex w-full sm:w-fit items-center justify-center px-8 py-3 rounded-full font-medium",
        {
          "bg-btnBg text-accent":
            type === "action" ||
            type === "create" ||
            type === "upload" ||
            type === "play" ||
            type === "move",
          "bg-accent text-white sm:w-full":
            type === "primary" || type === "unpublish" || type === "default",
          "bg-transparent text-gray-500": type === "load" || type === "back",
        }
      )}
      onClick={onClick}
    >
      {type === "action" && <FiPlus className="mr-2" />}
      {type === "primary" && <MdOutlineFileUpload className="mr-2" />}
      {type === "load" && <FiPlus className="mr-2" />}
      {type === "create" && <BsStars className="mr-2" />}
      {type === "upload" && <HiOutlineUpload className="mr-2" />}
      {type === "move" && <LuFolderInput className="mr-2" />}
      {type === "play" && <MdOutlineHeadphones className="mr-2" />}
      {type === "back" && <FiChevronLeft className="mr-2" />}
      {type === "unpublish" && ""}
      {name}
    </button>
  );
}

export default Button;
