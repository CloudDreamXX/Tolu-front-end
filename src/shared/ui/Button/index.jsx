import classnames from 'classnames';
import { FiPlus } from "react-icons/fi";
import { MdOutlineFileUpload } from "react-icons/md";
import { BsStars } from "react-icons/bs";
import { HiOutlineUpload } from "react-icons/hi";

function Button({ name, icon, onClick, type }) {
    return (
        <button 
            className={classnames(
                "flex items-center justify-center px-8 py-3 rounded-full",
                {
                    "bg-btnBg text-accent": type === "action" || type === "create" || type === "upload",
                    "bg-accent text-white": type === "primary",
                    "bg-transparent text-gray-500": type === "load",
                }
            )}
            onClick={onClick}
        >
            {type === "action" && <FiPlus className="mr-2" />}
            {type === "primary" && <MdOutlineFileUpload className="mr-2" />}
            {type === "load" && <FiPlus className="mr-2" />}
            {type === "create" && <BsStars className="mr-2" />}
            {type === "upload" && <HiOutlineUpload className="mr-2" />}
            {name}
        </button>
    );
};

export default Button;