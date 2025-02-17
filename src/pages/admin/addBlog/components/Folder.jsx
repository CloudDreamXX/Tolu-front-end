import { FaRegFolderOpen, FaRegFolder } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";

const Folder = ({ folder, openFolders, toggleFolder, addArticlesHandler, level }) => {
    const isOpen = openFolders[level] === folder.id;
    // console.log("folder", folder)
    // console.log("folderhugyghkugyttfgjhjk")
    return (
        <div className="">
            {/* Folder Name */}
            <div
                className={`flex justify-between items-center cursor-pointer rounded-lg p-2 mb-2 ${isOpen ? "bg-gray-300 hover:bg-gray-400" : "bg-gray-200 hover:bg-gray-400"
                    }`}
                onClick={() => toggleFolder(folder.id, level)}
            >
                <div className="flex gap-2">
                    {/* Folder Icon */}
                    <span className="text-gray-700">
                        {isOpen ? <FaRegFolderOpen /> : <FaRegFolder />}
                    </span>
                    <span className="truncate w-[150px]">{folder.name}</span>
                </div>
                {/* Add Content Button */}
                <span className="cursor-pointer">
                    <AiOutlinePlus onClick={(event) => addArticlesHandler(event, folder.id)} />
                </span>
            </div>

            {/* Render Subfolders & Files (If Open) */}
            {isOpen && (
                
                <div className="ml-2 border-l-2 border-gray-300 pl-2">
                    {/* Check if there are no subfolders and no content */}
                    {(!folder.subfolders?.length && !folder.content?.length) ? (
                        <div className="ml-6 text-gray-500 text-sm">No data available</div>
                    ) : (
                        <>
                            {/* Render Subfolders */}
                            {folder.subfolders?.map((subfolder) => (
                                <Folder
                                    key={subfolder.id}
                                    folder={subfolder}
                                    openFolders={openFolders}
                                    toggleFolder={toggleFolder}
                                    addArticlesHandler={addArticlesHandler}
                                    level={level + 1} // Increase level for nested folders
                                />
                            ))}

                            {/* Render Files Inside Folder */}
                            {folder.content?.map((file, index) => (
                                <div key={index} className="ml-6 text-gray-700 text-sm">
                                    📄 {file.title}
                                </div>
                            ))}
                        </>
                    )}
                </div>

            )}
        </div>
    );
};

export default Folder;
