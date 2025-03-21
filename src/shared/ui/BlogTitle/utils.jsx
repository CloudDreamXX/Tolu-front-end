import { TbEdit } from "react-icons/tb";
import { CiFolderOn } from "react-icons/ci";
import { HiOutlineHashtag } from "react-icons/hi";

export const showIcon = (type) => {
    switch (type) {
        case "folder":
            return <CiFolderOn className="w-9 h-9" />;
        case "topic":
            return <HiOutlineHashtag className="w-9 h-9" />;
        default:
            return <TbEdit className="w-9 h-9 cursor-pointer" />;
    }    
};