import { LuFolderSymlink } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";

function DocActions() {
    return (
        <div className="w-full max-w-11 flex flex-col gap-2">
            <button 
                className="rounded-full p-2 shadow-md flex items-center justify-center transition-transform hover:scale-105 h-11 bg-white">
                    <LuFolderSymlink className="w-6 h-6" />
            </button>
            <button
                className="rounded-full p-2 shadow-md flex items-center justify-center transition-transform hover:scale-105 h-11 bg-white"
            >
                <TbEdit className="w-6 h-6" />
            </button>
            <button
                className="rounded-full p-2 shadow-md flex items-center justify-center transition-transform hover:scale-105 text-error h-11 bg-white"
            >
                <FaRegTrashAlt className="w-6 h-6" />
            </button>
        </div>
    );
};

export default DocActions;